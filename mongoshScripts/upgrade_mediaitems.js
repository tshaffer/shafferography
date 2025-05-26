db.mediaitems.aggregate([
  { $project: { schema: { $objectToArray: "$$ROOT" } } },
  { $unwind: "$schema" },
  { $group: { _id: "$schema.k", types: { $addToSet: { $type: "$schema.v" } }, example: { $first: "$schema.v" } } }
])