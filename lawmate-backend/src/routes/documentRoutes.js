const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/templates', documentController.getTemplates);
router.post('/generate', documentController.generateAndSave);
router.get('/my-documents', documentController.getMyDocuments);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
