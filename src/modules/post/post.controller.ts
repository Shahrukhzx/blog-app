import { NextFunction, Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }
        const result = await PostService.createPost(req.body, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        next(error)

    }
}

const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined;
        const tags = req.query.tags ? (req.query.tags as string).split(',') : [];
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined
            : undefined;
        const status = req.query.status as PostStatus;
        const authorId = req.query.authorId as string | undefined;



        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

        const result = await PostService.getAllPost({ search: searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: "Failed to get posts",
            details: error
        });

    }

}

const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            throw new Error("Post ID is required");
        }
        const result = await PostService.getPostById(postId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            error: "Failed to get posts",
            details: error
        });

    }
}

const getMyPosts = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!")
        }
        console.log("User data: ", user)
        const result = await PostService.getMyPosts(user.id);
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: "Post fetched failed",
            details: e
        })
    }
}

const updatePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!")
        }

        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN
        const result = await PostService.updatePost(postId as string, req.body, user.id, isAdmin);
        res.status(200).json(result)
    } catch (e) {
        const errorMessage = (e instanceof Error) ? e.message : "Post update failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}

const deletePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!")
        }

        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN
        const result = await PostService.deletePost(postId as string, user.id, isAdmin);
        res.status(200).json(result)
    } catch (e) {
        const errorMessage = (e instanceof Error) ? e.message : "Post delete failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}

const getStats = async (req: Request, res: Response) => {
    try {
        const result = await PostService.getStats();
        res.status(200).json(result)
    } catch (e) {
        const errorMessage = (e instanceof Error) ? e.message : "Stats fetched failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}

export const PostController = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getStats
};