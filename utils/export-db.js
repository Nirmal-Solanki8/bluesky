require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const exportDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crystal_pools';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Export...');

    const backupDir = path.join(__dirname, '../database_backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const c of collections) {
      const data = await mongoose.connection.db.collection(c.name).find({}).toArray();
      const filePath = path.join(backupDir, `${c.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Exported ${c.name} (${data.length} records) -> ${c.name}.json`);
    }

    console.log(`\n🎉 All database collections exported successfully into: database_backup/`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Export Error:', err);
    process.exit(1);
  }
};

exportDB();

