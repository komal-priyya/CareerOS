const  Opportunity= require ( "../models/Opportunity.js");

const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({

         $or: [
        { addedBy: req.user._id },
        {
          visibility: "public",
          reviewStatus: "approved",
        },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      opportunities,
    });
  } catch (error) {
      console.error("Error fetching opportunities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch opportunities",
    });
  }
};

const createOpportunity = async (req, res) => {
  try {
    const {
      title,
      organization,
      type,
      description,
      deadline,
      applicationUrl,
      skills,
      visibility,
    } = req.body;

       if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Opportunity  title is required"
            });
          }

    const opportunity = await Opportunity.create({
      title,
      organization,
      type,
      description,
      deadline: deadline === "" ? undefined : deadline,
      applicationUrl,
      skills,
      visibility,
      addedBy: req.user._id,
      reviewStatus: "pending",
    });

    return res.status(201).json({
      message: "Opportunity created successfully",
      opportunity,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Create opportunity error:", error);

    return res.status(500).json({
      message: "Unable to create opportunity",
    });
  }
};

const getMyOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      addedBy: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      opportunities,
    });
  } catch (error) {
    console.error("Error fetching my opportunities:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your opportunities",
    });
  }
};

module.exports = { createOpportunity,getOpportunities,getMyOpportunities };