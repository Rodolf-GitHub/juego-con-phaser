const express = require("express");
const multer = require('multer');
const router = express.Router();

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    const uniquePreffix = Date.now()
    cb(null, uniquePreffix + '-' + file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
});

router.post('/upload-image', upload.single('file'), (req, res) => {
  res.json({message: 'File uploaded successfully!', filePath: req.file.path});
});

router.use('/public', express.static('public'));

module.exports = router;