import { Response } from "express";

import { AuthRequest } from "../middleware/auth";
import {
    createTrainingStory,
    getTrainingStoriesByOwnerEmail,
    getTrainingStoryByIdAndOwnerEmail,
    updateTrainingStory,
    deleteTrainingStoryByIdAndOwnerEmail,
} from "../models/trainingStoryModel";
import {
    createFullTrainingStory,
    getFullTrainingStoryByIdAndOwnerEmail,
    updateFullTrainingStory,
} from "../models/trainingStoryFullModel";
export const TrainingStoryController = {
    async getAll(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const stories = await getTrainingStoriesByOwnerEmail(req.user.email);

        return res.json({
            success: true,
            data: stories,
        });
    },

    async getById(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const story = await getTrainingStoryByIdAndOwnerEmail(
            req.params.id,
            req.user.email
        );

        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Training story not found",
            });
        }

        return res.json({
            success: true,
            data: story,
        });
    },

    async getFullById(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const story = await getFullTrainingStoryByIdAndOwnerEmail(
            req.params.id,
            req.user.email
        );

        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Training story not found",
            });
        }

        return res.json({
            success: true,
            data: story,
        });
    },

    async create(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const story = await createTrainingStory({
            ownerEmail: req.user.email,
            title: req.body.title,
            description: req.body.description ?? "",
            ageGroup: req.body.ageGroup,
            durationMinutes: Number(req.body.durationMinutes),
            theme: req.body.theme,
            tags: req.body.tags ?? [],
            objectives: req.body.objectives ?? [],
            status: req.body.status ?? "draft",
        });

        return res.status(201).json({
            success: true,
            data: story,
        });
    },
    async createFull(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const story = await createFullTrainingStory({
            ownerEmail: req.user.email,
            title: req.body.title,
            description: req.body.description ?? "",
            ageGroup: req.body.ageGroup,
            durationMinutes: Number(req.body.durationMinutes),
            theme: req.body.theme,
            tags: req.body.tags ?? [],
            objectives: req.body.objectives ?? [],
            status: req.body.review ? "completed" : req.body.status ?? "draft",
            pitches: req.body.pitches ?? [],
            review: req.body.review,
        });

        return res.status(201).json({
            success: true,
            data: story,
        });
    },
    async update(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const existingStory = await getTrainingStoryByIdAndOwnerEmail(
            req.params.id,
            req.user.email
        );

        if (!existingStory) {
            return res.status(404).json({
                success: false,
                message: "Training story not found",
            });
        }

        const updatedStory = await updateTrainingStory({
            id: req.params.id,
            ownerEmail: req.user.email,
            title: req.body.title ?? existingStory.title,
            description: req.body.description ?? existingStory.description,
            ageGroup: req.body.ageGroup ?? existingStory.age_group,
            durationMinutes: Number(
                req.body.durationMinutes ?? existingStory.duration_minutes
            ),
            theme: req.body.theme ?? existingStory.theme,
            tags: req.body.tags ?? existingStory.tags,
            objectives: req.body.objectives ?? existingStory.objectives,
            status: req.body.status ?? existingStory.status,
        });

        return res.json({
            success: true,
            data: updatedStory,
        });
    },
    async updateFull(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const story = await updateFullTrainingStory({
            id: req.params.id,
            ownerEmail: req.user.email,
            title: req.body.title,
            description: req.body.description ?? "",
            ageGroup: req.body.ageGroup,
            durationMinutes: Number(req.body.durationMinutes),
            theme: req.body.theme,
            tags: req.body.tags ?? [],
            objectives: req.body.objectives ?? [],
            status: req.body.review ? "completed" : req.body.status ?? "draft",
            pitches: req.body.pitches ?? [],
            review: req.body.review,
        });

        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Training story not found",
            });
        }

        return res.json({
            success: true,
            data: story,
        });
    },
    async remove(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const deleted = await deleteTrainingStoryByIdAndOwnerEmail(
            req.params.id,
            req.user.email
        );

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Training story not found",
            });
        }

        return res.json({
            success: true,
            message: "Training story deleted",
        });
    },
};
