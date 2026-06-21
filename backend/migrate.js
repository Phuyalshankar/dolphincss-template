// Migration script: add new fields to existing components
import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/dolphincss-templates');
const C = mongoose.connection.collection('components');

// Step 1: Add missing fields to old docs
const migrated = await C.updateMany(
  { username: { $exists: false } },
  { $set: {
    username:    'core',
    variant:     'default',
    version:     '1.0.0',
    isOfficial:  true,
    isPublic:    true,
    downloads:   0,
    downloadLog: [],
    description: ''
  }}
);
console.log('Fields added to:', migrated.modifiedCount, 'docs');

// Step 2: Fix slugs for docs that have none
const docs = await C.find({ slug: { $exists: false } }).toArray();
for (const d of docs) {
  await C.updateOne(
    { _id: d._id },
    { $set: { slug: `core/${d.name}@1.0.0` } }
  );
}
console.log('Slugs fixed for:', docs.length, 'docs');

// Step 3: Show summary
const total = await C.countDocuments({});
const sample = await C.findOne({}, { projection: { name:1, username:1, version:1, slug:1, isOfficial:1, downloads:1 } });
console.log('Total components in DB:', total);
console.log('Sample doc:', JSON.stringify(sample, null, 2));

process.exit(0);
