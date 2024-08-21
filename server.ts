import { config } from "dotenv";
import { connectToDatabase } from "./src/db/connectToDatabase.js";

config({ path: "./.env" });

import app from "./app.js";
import envs from "./src/utils/getEnvironmentVar.js";

const port = envs.PORT ?? 4000;

connectToDatabase().then(() => {
  console.log("database connected");
  app.listen(port, () => {
    console.log(`app is running on port ${port}`);
  });
});
