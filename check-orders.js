const mongoose = require('mongoose');

// Order schema
const OrderSchema = new mongoose.Schema({
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
    userId: { type: String },
    userEmail: { type: String },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

async function checkOrders() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/fashnova');

        // Find all orders
        const allOrders = await Order.find({});

        console.log('Total orders:', allOrders.length);

        allOrders.forEach((order, index) => {
            console.log(`${index + 1}. Order ID: ${order.orderId}, Email: ${order.userEmail || 'NO EMAIL'}`);
        });

    } catch (error) {
        console.error('Error checking orders:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkOrders();
