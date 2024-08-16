import multer from "multer";
import path from 'path';
import fs from 'fs'
import { Request } from "express";

// Ensure the tmp directory exists
const tmpDir = '/tmp';
if (!fs.existsSync(tmpDir)){
    fs.mkdirSync(tmpDir);
}

const storage = multer.diskStorage({
    destination: function (req:Request, file, cb) {
        cb(null, tmpDir);
    },
    filename: function (req:Request, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${fileExtension}`);
    }
});

export const upload = multer({ storage: storage });