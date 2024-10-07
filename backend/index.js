import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./app.js";
dotenv.config();
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server running at ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed");
  });
