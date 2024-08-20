import fs from "fs";
export const deleteProvidedImage = (req) => {
    if (req.file && req.file.path) {
        try {
            fs.unlinkSync(req.file.path);
        }
        catch (error) {
        }
    }
};
