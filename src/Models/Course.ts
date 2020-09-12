import * as mongoose from 'mongoose';

export type CourseModel = {
    name: string;
    totalModulesStudied: number;
    averageScore: number;
    timeStudied: number;
} & mongoose.Document;

export const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        totalModulesStudied: {
            type: Number,
            default: 0,
        },
        averageScore: {
            type: Number,
        },
        timeStudied: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        collection: 'Courses',
    },
);

export const courseModel: mongoose.Model<CourseModel> = mongoose.model<CourseModel>('Course', courseSchema);
