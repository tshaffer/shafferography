// findDuplicateFilenames_rich.js
const fs = require("fs");

const GROUPS_OUT = "duplicate_filenames__groups.json";
const FLAT_OUT   = "duplicate_filenames__pairs_flat.json";

// Optional: limit output while iterating (set to 0 for no limit)
const LIMIT_GROUPS = 0;

const coll = db.mediaitems;

const pipeline = [
  { $match: { fileName: { $type: "string", $ne: "" } } },
  {
    $group: {
      _id: "$fileName",
      count: { $sum: 1 },
      items: {
        $push: {
          _id: "$_id",
          filePath: "$filePath",
          contentHash: "$contentHash",
          takenAt: "$takenAt",

          // Common dimension fields (include both in case your schema varies)
          imageWidth: "$imageWidth",
          imageHeight: "$imageHeight",

          // If your schema uses different names, we’ll adjust
          width: "$width",
          height: "$height",

          // Common file size field candidates
          fileSize: "$fileSize",
          fileSizeBytes: "$fileSizeBytes",
          sizeBytes: "$sizeBytes",

          // Sometimes helpful for spotting edited versions
          mimeType: "$mimeType",
          ext: "$ext",
          orientation: "$orientation"
        }
      }
    }
  },
  { $match: { count: { $gt: 1 } } },
  { $sort: { count: -1, _id: 1 } },
];

let groups = coll.aggregate(pipeline).toArray();
if (LIMIT_GROUPS && groups.length > LIMIT_GROUPS) {
  groups = groups.slice(0, LIMIT_GROUPS);
}

fs.writeFileSync(GROUPS_OUT, JSON.stringify(groups, null, 2));

// Flatten for easier filtering
const flat = [];
for (const g of groups) {
  for (const it of g.items) {
    flat.push({
      fileName: g._id,
      groupCount: g.count,
      _id: it._id,
      filePath: it.filePath,
      contentHash: it.contentHash,
      takenAt: it.takenAt,

      imageWidth: it.imageWidth ?? it.width,
      imageHeight: it.imageHeight ?? it.height,

      fileSizeBytes: it.fileSizeBytes ?? it.sizeBytes ?? it.fileSize,
      mimeType: it.mimeType,
      ext: it.ext,
      orientation: it.orientation,
    });
  }
}
fs.writeFileSync(FLAT_OUT, JSON.stringify(flat, null, 2));

print(`Wrote ${groups.length} groups to ${GROUPS_OUT}`);
print(`Wrote ${flat.length} rows to ${FLAT_OUT}`);
