'use strict';

import mongoose from 'mongoose';

const pictureSchema = mongoose.Schema({
  pictureTitle: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  size: {
    type: String,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId, // linking with other schema
    required: true,
  },
});

export default mongoose.model('picture', pictureSchema);
