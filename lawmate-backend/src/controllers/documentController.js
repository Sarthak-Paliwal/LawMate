const Document = require('../models/Document');
const { TEMPLATES } = require('../utils/documentTemplates');

exports.getTemplates = (req, res) => {
  // Return templates without the raw content logic to keep payload light if needed, 
  // but for now sending full object is fine.
  res.status(200).json({
    status: 'success',
    data: TEMPLATES
  });
};

exports.generateAndSave = async (req, res, next) => {
  try {
    const { templateId, data } = req.body;

    const templateObj = TEMPLATES.find(t => t.id === templateId);
    if (!templateObj) {
      return res.status(404).json({
        status: 'fail',
        message: 'Template not found'
      });
    }

    // Replace placeholders
    let content = templateObj.content;
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value || `[${key}]`);
    }

    // Save to DB
    const newDoc = await Document.create({
      user: req.user._id,
      type: templateObj.name,
      data,
      content
    });

    res.status(201).json({
      status: 'success',
      data: {
        document: newDoc,
        // formattedContent: content // Frontend can inspect 'content' from newDoc
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.getMyDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({
      status: 'success',
      data: docs
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------- Delete Document -------------------- */

exports.deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'Document not found or not authorized'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Document deleted'
    });
  } catch (error) {
    next(error);
  }
};
