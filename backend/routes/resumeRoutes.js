const express = require('express');
const router = express.Router();
const { uploadResume, getResumes, downloadResume, deleteResume } = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/download/:id', downloadResume);
router.delete('/:id', deleteResume);

module.exports = router;
