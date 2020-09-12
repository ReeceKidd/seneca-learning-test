import * as mongoose from 'mongoose';

export type SessionModel = {
    userId: string;
    courseId: string;
    totalModulesStudied: number;
    averageScore: number;
    timeStudied: number;
} & mongoose.Document;

export const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        courseId: {
            type: String,
            required: true,
        },
        totalModulesStudied: {
            type: Number,
            default: 0,
        },
        averageScore: {
            type: Number,
            default: 0,
        },
        timeStudied: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        collection: 'Sessions',
    },
);

export const sessionModel: mongoose.Model<SessionModel> = mongoose.model<SessionModel>('Session', sessionSchema);
