
use pgPhotos;

const fs = require('fs');
const path = "/Users/tedshaffer/Documents/MongoDBBackups/shafferography/photoStateBackup-07-15-1/photoStates.json";
const dir = path.substring(0, path.lastIndexOf('/'));

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const file = fs.openSync(path, 'w');

const cursor = db.mediaitems.find(
  { uniqueId: { $exists: true }, photoState: { $exists: true } },
  { _id: 0, uniqueId: 1, photoState: 1 }
);

cursor.forEach(doc => {
  fs.writeSync(file, JSON.stringify(doc) + '\n');
});

fs.closeSync(file);

print(`✅ Backup complete. File saved to: ${path}`);
