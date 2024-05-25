import { model, Schema } from "mongoose";

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    token: {
        type: String,
        unique: true,
        required: true,
    },
    createdAt: { type: Date, default: Date.now }
});

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 100 });

export const Token = model('token', tokenSchema);