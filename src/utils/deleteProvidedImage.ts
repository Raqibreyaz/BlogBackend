import { Request } from "express";
import fs from "fs";

export const deleteProvidedImage = (req: Request) => {
  if (req.file && req.file.path) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (error) {
      // console.log(error);
    }
  }
};
