"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const port = process.env.PORT || 5000;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.json({
        message: "Camper Shop Backend is running!",
    });
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // connect to the database
            yield mongoose_1.default.connect((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.DB_URL);
            // start the express server
            app.listen(port, () => {
                console.log(`Camper shop app is listening on port                                      ${port}`);
            });
        }
        catch (err) {
            // log any errors that occur during startup
            console.log(err);
        }
    });
}
main();
// Schemas
//product schema
const ProductSchema = new mongoose_1.Schema({
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
const OrderSchema = new mongoose_1.Schema({
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
const Product = (0, mongoose_1.model)("Product", ProductSchema);
//order model
const Order = (0, mongoose_1.model)("Order", OrderSchema);
//create product
app.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        const result = yield Product.create(product);
        res.send({
            success: true,
            message: "Product created successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while creating product.",
            data: {},
        });
    }
}));
//get all product
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchValue, category, minPrice, maxPrice, sort } = req.query;
    const filter = {};
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
    }
    else if (minPrice) {
        filter.price = { $gte: minPrice };
    }
    else if (maxPrice) {
        filter.price = { $lte: maxPrice };
    }
    let sortOption = {};
    if (sort === "asc") {
        sortOption.price = 1;
    }
    else if (sort === "desc") {
        sortOption.price = -1;
    }
    try {
        const result = yield Product.find(filter).sort(sortOption);
        res.status(200).json({
            success: true,
            message: "Products retrieved successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while finding product.",
            data: [],
        });
    }
}));
//get a single product
app.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Product.findById(req.params.id);
        res.json({
            success: true,
            message: "Product is retrieved successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while finding product.",
            data: {},
        });
    }
}));
//update a product
app.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const productData = req.body;
        // Find the product by ID and update it
        let result = yield Product.findByIdAndUpdate(id, productData, {
            new: true,
        });
        res.json({
            success: true,
            message: "Product updated successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the product.",
            data: {},
        });
    }
}));
//delete product
app.delete("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield Product.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Product deleted successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting product.",
            data: {},
        });
    }
}));
//create order
app.post("/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentData = req.body;
        const result = yield Order.create(paymentData);
        res.json({
            success: true,
            message: "Order successful!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while ordering product",
            data: {},
        });
    }
}));
//update order
app.put("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedProductData = req.body;
        // Update quantity for each product
        const updatedResults = yield Promise.all(updatedProductData.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            const existingProduct = yield Product.findById(product._id);
            if (!existingProduct) {
                // Handle invalid product ID
                return null;
            }
            existingProduct.quantity -= product.quantity;
            if (existingProduct.quantity <= 0) {
                existingProduct.stock = false;
            }
            return yield existingProduct.save();
        })));
        res.json({
            success: true,
            message: "Products quantity updated successfully!",
            data: updatedResults,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating product quantities.",
            data: [],
        });
    }
}));
//global error handler
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: (err === null || err === void 0 ? void 0 : err.message) || "Internal Server Error",
        error: err,
    });
});
//not found route
app.all("*", (req, res) => {
    res.status(400).json({
        success: false,
        message: "Route not found",
    });
});
