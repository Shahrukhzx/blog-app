import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }
        const result = await PostService.createPost(req.body, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            error: "Failed to create post",
            details: error
        });

    }
}

export const PostController = {
    createPost
};