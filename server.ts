import express, { Request, Response } from "express";
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

//product schema
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


//order schema
const OrderSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
});

// Models

//product model
const Product = model("Product", ProductSchema);


//order model
const Order = model("Order", OrderSchema);


//create product
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

//get all product
app.get("/products", async (req, res) => {
    const { searchValue, category, minPrice, maxPrice, sort } = req.query;
    const filter: any = {};

    if (searchValue) {
        filter.$or = [
            { name: { $regex: searchValue, $options: "i" } },
            { description: { $regex: searchValue, $options: "i" } },
        ];
    }

    if (category) {
        filter.category = category;
    }

    if (minPrice && maxPrice) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
        filter.price = { $gte: minPrice };
    } else if (maxPrice) {
        filter.price = { $lte: maxPrice };
    }

    let sortOption: any = {};

    if (sort === "asc") {
        sortOption.price = 1;
    } else if (sort === "desc") {
        sortOption.price = -1;
    }

    try {
        const result = await Product.find(filter).sort(sortOption);
        res.status(200).json({
            success: true,
            message: "Products retrieved successfully!",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while finding product.",
            data: [],
        });
    }
});

//get a single product
app.get("/products/:id", async (req, res) => {
    try {
        const result = await Product.findById(req.params.id);
        res.json({
            success: true,
            message: "Product is retrieved successfully!",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while finding product.",
            data: {},
        });
    }
});


//update a product
app.put("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const productData = req.body;

        // Find the product by ID and update it
        let result = await Product.findByIdAndUpdate(id, productData, {
            new: true,
        });

        res.json({
            success: true,
            message: "Product updated successfully!",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the product.",
            data: {},
        });
    }
});


//delete product
app.delete("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Product.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Product deleted successfully!",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting product.",
            data: {},
        });
    }
});


app.post("/orders", async (req, res) => {
    try {
        const paymentData = req.body;
        const result = await Order.create(paymentData);
        res.json({
            success: true,
            message: "Order successful!",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while ordering product",
            data: {},
        });
    }
});



//not found route
app.all("*", (req: Request, res: Response) => {
    res.status(400).json({
        success: false,
        message: "Route not found",
    });
});