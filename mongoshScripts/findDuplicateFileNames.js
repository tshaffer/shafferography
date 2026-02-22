// Adjust if needed
const OUTPUT_FILE = "duplicate_filenames.json";

const fs = require("fs");

const coll = db.mediaitems;

const results = coll.aggregate([
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
          takenAt: "$takenAt"
        }
      }
    }
  },
  { $match: { count: { $gt: 1 } } },
  { $sort: { count: -1, _id: 1 } }
]).toArray();

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

print(`Wrote ${results.length} duplicate filename groups to ${OUTPUT_FILE}`);
