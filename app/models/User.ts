import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    role: string;
    mobile?: string;
    address?: string;
    wishlist?: string[];
    userCart?: string[];
}

const UserSchema = new Schema<IUser>(
    {
        _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: { type: String, default: "user", required: true, enum: ["user", "admin"] },
        mobile: { type: String },
        address: { type: String },
        wishlist: [{ type: String }],
        userCart: [{ type: String }],
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
