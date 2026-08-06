import multer from "multer";
import path from "path";
import fs from "fs";

export const uploadDirectory = path.join(process.cwd(), "uploads");

// Ensure uploads work on a fresh clone where this folder does not exist yet.
// fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 1. Get entityType from route params (defaults to 'general' if missing)
    const entityType = req.params.entityType || 'general';
    const entityId = req.params.entityId || 'no-id';
    
    // 2. Build target directory path (e.g., 'src/uploads/users')
    const targetDir = path.join(process.cwd(), 'uploads', entityType, entityId);

    // 3. Ensure the folder exists (creates nested folders automatically if needed)
    fs.mkdirSync(targetDir, { recursive: true });

    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    console.log("multer f", file);
    
    const ext = path.extname(file.originalname);
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix + ext)
  }
})

const imageFilter = (req, file, cb) => {
  // Check if MIME type starts with "image/" (e.g., image/jpeg, image/png, image/webp)
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF) are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFilter, })

export default upload
