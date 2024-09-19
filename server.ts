import express from "express";
import mongoose from "mongoose";
const app = express();
const port = process.env.PORT || 5000;
import dotenv from "dotenv";
dotenv.config();

app.get("/", (req, res) => {
    res.json({
        message: "Camper Shop Backend is running!",
    });
});

async function main() {
    try {
        // connect to the database
        await mongoose.connect(process?.env?.DB_URL as string);

        // start the express server
        app.listen(port, () => {
            console.log(`Camper shop app is listening on port                                      ${port}`);
        });
    } catch (err) {
        // log any errors that occur during startup
        console.log(err);
    }
}
main();   