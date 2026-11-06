const mongoose = require( "mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    organization: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "internship",
        "hackathon",
        "fellowship",
        "competition",
        "other",
      ],
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    deadline: {
      type: Date,
    },

    applicationUrl: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    reviewStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports= mongoose.model("Opportunity", opportunitySchema);