const fs = require('fs');

// Step 1: Read the JSON file
const inputPath = '/Users/tedshaffer/Documents/MongoDBBackups/shafferography/backup-07-11-1/mediaitems.json'; // 🔁 Replace with your actual filename
const outputPath = '/Users/tedshaffer/Documents/MongoDBBackups/shafferography/backup-07-11-1/deduplicated-file.json';

const rawData = fs.readFileSync(inputPath, 'utf-8');
const data = JSON.parse(rawData);

// Step 2: Track the first occurrence of each filePath
const seenFilePaths = new Set();
const deduplicatedData = [];

for (const item of data) {
  if (!seenFilePaths.has(item.filePath)) {
    seenFilePaths.add(item.filePath);
    deduplicatedData.push(item);
  }
}

// Step 3: Write the cleaned data to a new file
fs.writeFileSync(outputPath, JSON.stringify(deduplicatedData, null, 2), 'utf-8');

console.log(`✅ Done. Original count: ${data.length}, After deduplication: ${deduplicatedData.length}`);
console.log(`📝 Output written to: ${outputPath}`);
