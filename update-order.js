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
    userEmail: { type: String, required: true },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

async function updateOrder() {
    try {
        // Connect to MongoDB (adjust connection string as needed)
        await mongoose.connect('mongodb://localhost:27017/fashnova');

        // Update the order
        const result = await Order.updateOne(
            { orderId: 'ORD-1762336606405' },
            { $set: { userEmail: 'adarshpawaiya345@gmail.com' } }
        );

        console.log('Update result:', result);

        if (result.modifiedCount > 0) {
            console.log('Order updated successfully');
        } else {
            console.log('Order not found or already has the email');
        }

    } catch (error) {
        console.error('Error updating order:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateOrder();
