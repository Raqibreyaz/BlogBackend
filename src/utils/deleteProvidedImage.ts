import { Request } from "express";
import fs from "fs";

export const deleteProvidedImage = (req: Request) => {
  if (req.file && req.file.path) {
    try {
      fs.unlink(req.file.path, (error) => {
        if (error) {
          console.error(`Error deleting file at path ${req.file?.path}:`, error);
        }
      });
    } catch (error) {
      // console.log(error);
    }
  }
};
