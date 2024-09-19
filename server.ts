import express from "express";
import mongoose, { model, Schema } from "mongoose";
const app = express();
import cors from "cors";
const port = process.env.PORT || 5000;
import dotenv from "dotenv";
dotenv.config();

//middlewares
app.use(express.json());
app.use(cors());


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


// Schemas
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    stock: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        required: true,
    },
});


// Models
const Product = model("Product", ProductSchema);



//product api
app.post("/products", async (req, res) => {
    try {
        const product = req.body;
        const result = await Product.create(product);

        res.send({
            success: true,
            message: "Product created successfully!",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while creating product.",
            data: {},
        });
    }
});


