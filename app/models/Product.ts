import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    stockQuantity: number;
    reservedStock: number;
    minStockThreshold: number;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        stockQuantity: { type: Number, required: true, default: 0 },
        reservedStock: { type: Number, required: true, default: 0 },
        minStockThreshold: { type: Number, required: true, default: 5 },
    },
    { timestamps: true }
);

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
