require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const importDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crystal_pools';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Import...');

    const backupDir = path.join(__dirname, '../database_backup');
    if (!fs.existsSync(backupDir)) {
      console.error('❌ database_backup directory not found!');
      process.exit(1);
    }

    const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const collectionName = path.basename(file, '.json');
      const filePath = path.join(backupDir, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const docs = JSON.parse(rawData);

      if (docs && docs.length > 0) {
        const collection = mongoose.connection.db.collection(collectionName);
        await collection.deleteMany({});
        await collection.insertMany(docs);
        console.log(`✅ Imported ${collectionName} (${docs.length} records)`);
      } else {
        console.log(`⚠️ ${collectionName} is empty, skipped.`);
      }
    }

    console.log(`\n🎉 Database imported successfully from: database_backup/`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Import Error:', err);
    process.exit(1);
  }
};

importDB();

