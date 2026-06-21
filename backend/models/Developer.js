import mongoose from 'mongoose';

const developerSchema = new mongoose.Schema({
  username: {
    type:     String,
    required: true,
    unique:   true,
    index:    true
  },
  token: {
    type:     String,
    required: true,
    unique:   true,
    index:    true
  },
  createdAt: {
    type:    Date,
    default: Date.now
  }
});

export default mongoose.model('Developer', developerSchema);
