import * as mongoose from 'mongoose';

export type ModuleModel = { name: string; type: string } & mongoose.Document;

export const moduleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: 'Modules',
    },
);

export const moduleModel: mongoose.Model<ModuleModel> = mongoose.model<ModuleModel>('Module', moduleSchema);
