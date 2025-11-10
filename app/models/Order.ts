import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
    name: string;
    quantity: number;
    price: number;
}

export interface IShippingAddress {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface IOrder extends Document {
    orderId: string;
    date: Date;
    status: "Processing" | "Shipped" | "Delivered";
    total: number;
    items: IOrderItem[];
    trackingNumber?: string;
    userName: string; // Name of the user who placed the order
    userEmail: string; // Email of the user who placed the order
    shippingAddress: IShippingAddress; // Complete shipping address for admin
}

const OrderSchema = new Schema<IOrder>(
    {
        orderId: { type: String, required: true, unique: true },
        date: { type: Date, required: true },
        status: { type: String, required: true, enum: ["Processing", "Shipped", "Delivered"] },
        total: { type: Number, required: true },
        items: [{
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }],
        trackingNumber: { type: String },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true },
        shippingAddress: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true }
        }
    },
    { timestamps: true }
);

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
