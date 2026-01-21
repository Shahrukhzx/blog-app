import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
    content: string;
    authorId: string;
    postId: string;
    parentId?: string;
}) => {
    // Implementation for creating a comment
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }
    return await prisma.comment.create({
        data: payload
    })
}

const getCommentById = async (commentId: string) => {
    return await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: { id: true, title: true, views: true }
            }
        }
    })
}

const getCommentsByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            post: {
                select: { id: true, title: true, views: true }
            }
        }
    })
}

//

const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })
    if (!commentData) {
        throw new Error("Comment not found or you are not authorized to delete this comment");
    }
    return await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })
}

// authorId, commentId, updatedData
const updateComment = async (commentId: string, data: { content?: string, status?: CommentStatus }, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Your provided input is invalid!")
    }

    return await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data
    })
}

const moderateComment = async (commentId: string, data: { status: CommentStatus }) => {
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        select: {
            id: true,
            status: true
        }
    })

    if (commentData.status === data.status) {
        throw new Error(`Your provided status is already ${data.status}`)
    }

    return await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            status: data.status
        }
    })
}

export const CommentService = {
    createComment,
    getCommentById,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    moderateComment
};