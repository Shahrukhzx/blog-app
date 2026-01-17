import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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

export const PostController = {
    createPost,
    getAllPost,
    getPostById
};