const coll = db.mediaitems;

const cursor = coll.aggregate([
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
]);

let n = 0;
cursor.forEach(doc => {
  n++;
  print(`\n=== ${doc._id}  (count=${doc.count}) ===`);
  doc.items.forEach(it => printjson(it));
});
print(`\nTotal duplicate-filename groups: ${n}`);