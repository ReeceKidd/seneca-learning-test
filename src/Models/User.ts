import * as mongoose from 'mongoose';

export type UserModel = { username: string } & mongoose.Document;

export const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            index: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        collection: 'Users',
    },
);

export const userModel: mongoose.Model<UserModel> = mongoose.model<UserModel>('User', userSchema);
