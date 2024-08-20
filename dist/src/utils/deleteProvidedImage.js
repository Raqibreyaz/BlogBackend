"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProvidedImage = void 0;
const fs_1 = __importDefault(require("fs"));
const deleteProvidedImage = (req) => {
    if (req.file && req.file.path) {
        try {
            fs_1.default.unlinkSync(req.file.path);
        }
        catch (error) {
        }
    }
};
exports.deleteProvidedImage = deleteProvidedImage;
