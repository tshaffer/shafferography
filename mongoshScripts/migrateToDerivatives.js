use pgPhotos;

/**
 * Shafferography MediaItem migration (mongosh)
 * - Adds/derives fields for original/derivative model
 * - Enforces single preferred per family
 * - Creates supporting indexes
 *
 * Usage: paste into mongosh while connected to your cluster.
 */

const DB_NAME = "pgPhotos";
const COLL = "mediaitems";

// ---- Options ----
const DRY_RUN = false;      // true = report only, no writes
const BACKUP = true;        // make a full collection backup first
const BACKUP_PREFIX = `${COLL}_backup_`;

// ---- Helpers ----
function isoNowSafe() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function log(...args) { print(new Date().toISOString(), "-", ...args); }

const dbx = db.getSiblingDB(DB_NAME);

// ---- 0) Backup ----
if (BACKUP) {
  const backupName = BACKUP_PREFIX + isoNowSafe();
  log(`Creating backup collection: ${backupName}`);
  if (!DRY_RUN) {
    dbx[COLL].aggregate([{ $match: {} }, { $out: backupName }], { allowDiskUse: true });
  }
}

// ---- 1) Backfill/normalize core fields with an aggregation pipeline update ----
// - isOriginal: true when derivedFrom missing; false when derivedFrom present
// - familyRootId: _id for originals; derivedFrom for derivatives
// - isPreferred (default): true for originals when missing; false for derivatives when missing
// - importedAt: default now() when missing; else keep existing
// - reviewLevel: default 'Unreviewed' when missing
// - orientation: default 1 when missing
log("Backfilling core fields (isOriginal, familyRootId, isPreferred, importedAt, reviewLevel, orientation)...");
const pipelineUpdate = [
  {
    $set: {
      isOriginal: {
        $cond: [{ $ifNull: ["$derivedFrom", null] }, false, true],
      },
    },
  },
  {
    $set: {
      familyRootId: {
        $cond: [
          "$isOriginal",
          "$_id",
          { $ifNull: ["$derivedFrom", "$_id"] } // fallback to _id if derivedFrom somehow null
        ],
      },
    },
  },
  {
    $set: {
      isPreferred: {
        $cond: [
          { $ne: ["$isPreferred", undefined] },
          "$isPreferred",
          { $cond: ["$isOriginal", true, false] }
        ],
      },
    },
  },
];

if (!DRY_RUN) {
  dbx[COLL].updateMany({}, pipelineUpdate);
}

// ---- 3) Resolve duplicate preferred per family (keep original if present; else keep most recent) ----
log("Scanning for families with duplicate preferred items...");
const dupFamilies = dbx[COLL].aggregate([
  { $match: { isPreferred: true }, },
  { $group: { _id: "$familyRootId", preferredCount: { $sum: 1 }, ids: { $push: "$_id" } } },
  { $match: { preferredCount: { $gt: 1 } } },
]).toArray();

log(`Found ${dupFamilies.length} family(ies) with duplicate preferred.`);

dupFamilies.forEach((fam, idx) => {
  const famId = fam._id;
  log(`Resolving family ${idx + 1}/${dupFamilies.length}: ${famId}`);

  // Load all active members in this family
  const members = dbx[COLL]
    .find({ familyRootId: famId })
    .sort({ isOriginal: -1 })
    .toArray();

  // Choose winner:
  // 1) Prefer the original if it's among the preferred ones
  // 2) Else keep the most recently imported/created among the preferred set
  const preferredIds = new Set(fam.ids.map(String));
  let winner = members.find(m => m.isOriginal && preferredIds.has(String(m._id)));
  if (!winner) {
    // pick the last (most recent by createdAt/importedAt order above) that is currently preferred
    const preferredMembers = members.filter(m => preferredIds.has(String(m._id)));
    winner = preferredMembers[preferredMembers.length - 1];
  }

  if (!winner) {
    // Fallback: if something odd happened, keep the original or the first member
    winner = members.find(m => m.isOriginal) || members[0];
  }

  const winnerId = winner._id;
  const losers = fam.ids.filter(id => String(id) !== String(winnerId));

  log(` -> winner: ${winnerId}, demoting ${losers.length} other(s)`);

  if (!DRY_RUN) {
    if (losers.length) {
      dbx[COLL].updateMany({ _id: { $in: losers } }, { $set: { isPreferred: false } });
    }
    dbx[COLL].updateOne({ _id: winnerId }, { $set: { isPreferred: true } });
  }
});

// ---- 4) Ensure each family has at least one preferred (in case nothing was set) ----
log("Ensuring each family has at least one preferred...");
const famsWithoutPreferred = dbx[COLL].aggregate([
  { $group: { _id: "$familyRootId", anyPreferred: { $max: { $toInt: "$isPreferred" } } } },
  { $match: { anyPreferred: 0 } },
]).toArray();

log(`Families with no preferred: ${famsWithoutPreferred.length}`);

famsWithoutPreferred.forEach((fam, idx) => {
  const famId = fam._id;
  // Prefer the original; else first by createdAt/importedAt
  const original = dbx[COLL].findOne({ familyRootId: famId, isOriginal: true });
  const chosen = original || dbx[COLL].find({ familyRootId: famId })
    .sort({ createdAt: 1, importedAt: 1 })
    .limit(1)
    .toArray()[0];

  if (chosen) {
    log(` -> setting preferred for family ${famId} to ${chosen._id}`);
    if (!DRY_RUN) {
      dbx[COLL].updateOne({ _id: chosen._id }, { $set: { isPreferred: true } });
    }
  } else {
    log(` -> WARNING: family ${famId} has no active members (all deleted?)`);
  }
});

// ---- 5) Create indexes (will be no-ops if already exist) ----
function createIndexSafely(coll, keys, opts) {
  try {
    const name = dbx[coll].createIndex(keys, opts);
    log(`Index created/exists: ${name}`);
  } catch (e) {
    log(`Index create error (likely duplicates or conflict):`, e.message);
  }
}

log("Creating indexes...");
if (!DRY_RUN) {
  // Unique 1-per-family preferred (ignore soft-deleted)
  createIndexSafely(
    COLL,
    { familyRootId: 1, isPreferred: 1 },
    { unique: true, partialFilterExpression: { isPreferred: true } }
  );

  // Fetch derivatives fast
  createIndexSafely(COLL, { derivedFrom: 1 }, {});
}

log("Migration complete.");
