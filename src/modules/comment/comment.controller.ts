import { Request, Response } from "express";
import { CommentService } from "./comment.service";


const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        req.body.authorId = user?.id;
        const result = await CommentService.createComment(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({
            error: "Failed to create comment",
            details: error
        });

    }
}

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const result = await CommentService.getCommentById(commentId as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch comment",
            details: error
        });

    }
}

const getCommentsByAuthor = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params;
        const result = await CommentService.getCommentsByAuthor(authorId as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            error: "Failed to fetch comment by authorId",
            details: error
        });

    }
}

const deleteComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await CommentService.deleteComment(commentId as string, user?.id as string)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({
            error: "Failed to delete comment",
            details: error
        });

    }
}
const updateComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await CommentService.updateComment(commentId as string, req.body, user?.id as string)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            error: "Comment update failed!",
            details: e
        })
    }
}


export const CommentController = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment
};