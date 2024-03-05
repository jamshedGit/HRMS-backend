const mongoose = require("mongoose");
const { toJSON, paginate } = require("../plugins");

const roleaccessSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, lowercase: true },
    resources: [
      {
        resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
        resourceName: { type: String },
        resourceSlug: { type: String },
        isMasterResource: { type: Boolean },
        isResourceShow: { type: Boolean },
        rightsShow: { type: Boolean },
        group: {
          type: String,
          // required: true,
          trim: true,
        },

        rights: [
          {
            rightName: { type: String },
            rightSlug: { type: String },
            access: { type: Boolean },
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
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
roleaccessSchema.plugin(toJSON);
roleaccessSchema.plugin(paginate);

/**
 * @typedef Roleaccess
 */
const Roleaccess = mongoose.model("Roleaccess", roleaccessSchema);
module.exports = Roleaccess;
