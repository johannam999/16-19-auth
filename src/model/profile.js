'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  nickname: { type: String },
  zipCode: { type: String },
  category: { type: String },
  picture: { type: String },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

export default mongoose.model('profile', profileSchema);

