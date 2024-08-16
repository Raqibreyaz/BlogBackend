import { config } from "dotenv";
import { connectToDatabase } from "./src/db/connectToDatabase";

config({ path: "./.env" });

import app from "./app";

const port = process.env.PORT ?? 4000;

connectToDatabase().then(() => {
  console.log("database connected");
  app.listen(port, () => {
    console.log(`app is running on port ${port}`);
  });
});
