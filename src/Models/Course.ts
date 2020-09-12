import * as mongoose from 'mongoose';

export type CourseModel = {
    userId: string;
    totalModulesStudied: number;
    averageScore: number;
    timeStudied: number;
} & mongoose.Document;

export const courseSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        totalModulesStudied: {
            type: Number,
            required: true,
            default: 0,
        },
        averageScore: {
            type: Number,
            required: true,
        },
        timeStudied: {
            type: String,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
        collection: 'Courses',
    },
);

export const courseModel: mongoose.Model<CourseModel> = mongoose.model<CourseModel>('Course', courseSchema);
