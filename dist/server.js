"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const connectToDatabase_1 = require("./src/db/connectToDatabase");
(0, dotenv_1.config)({ path: "./.env" });
const app_1 = __importDefault(require("./app"));
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000;
(0, connectToDatabase_1.connectToDatabase)().then(() => {
    console.log("database connected");
    app_1.default.listen(port, () => {
        console.log(`app is running on port ${port}`);
    });
});
