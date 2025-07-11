const fs = require('fs');

// Load and parse the JSON file
// const rawData = fs.readFileSync('/Users/tedshaffer/Documents/MongoDBBackups/shafferography/backup-07-11-1/mediaitems.json', 'utf-8'); // Replace with your actual filename
const rawData = fs.readFileSync('/Users/tedshaffer/Documents/MongoDBBackups/shafferography/backup-07-11-1/deduplicated-file.json', 'utf-8'); // Replace with your actual filename
const data = JSON.parse(rawData);

// Track counts of filePaths
const filePathCounts = {};

data.forEach(item => {
  const filePath = item.filePath;
  filePathCounts[filePath] = (filePathCounts[filePath] || 0) + 1;
});

// Filter duplicates
const duplicates = Object.entries(filePathCounts)
  .filter(([_, count]) => count > 1)
  .map(([filePath, _]) => filePath);

if (duplicates.length === 0) {
  console.log('✅ No duplicate filePaths found.');
} else {
  console.log('❗ Duplicate filePaths found:\n');
  duplicates.forEach(path => console.log(path));
}