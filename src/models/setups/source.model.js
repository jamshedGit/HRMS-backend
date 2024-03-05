const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const sourceSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    slug: { 
      type: String, 
      required: true, 
      lowercase: true 
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      // required: true 
    },
    updatedBy: { 
      type: mongoose.Schema.Types.ObjectId,
      // default : null
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
sourceSchema.plugin(toJSON);
sourceSchema.plugin(paginate);

/**
 * @typedef Source
 */
const Source = mongoose.model('Source', sourceSchema);

module.exports = Source;
