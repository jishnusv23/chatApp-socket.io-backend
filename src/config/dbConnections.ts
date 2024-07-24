import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoo_URI: string = process.env.MONGOO_URI || " ";

if (!mongoo_URI) {
  throw new Error("👽 - mongopath is not geting somethig problem");
}

export const dbConnect = () => {
  return mongoose
    .connect(mongoo_URI.trim())
    .then(() => {
      console.log("MongoDb connected successfully--🤺🤺 ");
    })
    .catch((err) => {
        console.error("Something wrong", err)
         process.exit(1);
    });
   
};
