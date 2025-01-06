import multer from "multer";
import path from "path";
import fs from "fs";

// Get the root directory of the project
const rootDir = process.cwd();

// Ensure the uploads folder exists in the project root
const uploadsFolder = path.join(rootDir, "uploads");
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination folder
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the original file name and timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize multer with the storage engine and file size limit (optional)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

export default upload;
