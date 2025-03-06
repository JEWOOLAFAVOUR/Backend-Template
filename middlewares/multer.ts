// import multer, { StorageEngine } from "multer";
// import { Request } from "express";

// // Define storage
// const storage: StorageEngine = multer.diskStorage({});

// // Define file filter
// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: (error: string | null, acceptFile: boolean) => void
// ) => {
//   if (!file.mimetype.includes("image")) {
//     return cb("Invalid image format", false);
//   }
//   cb(null, true);
// };

// // Export multer instance
// const upload = multer({ storage, fileFilter });

// export default upload;
