const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const resourceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    group: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    isMasterResource: { type: Boolean },
    isResourceShow: { type: Boolean },
    rightsShow: { type: Boolean },
    rights: [
      {
        rightName: { type: String },
        rightSlug: { type: String },
        access: { type: Boolean, default: false },
        isRightShow: { type: Boolean, default: false },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          // default: null,
        },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      // default: null,
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
resourceSchema.plugin(toJSON);
resourceSchema.plugin(paginate);

/**
 * @typedef Resource
 */
const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
