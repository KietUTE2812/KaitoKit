"use client";
import api from "@/api/apiInstance";
import Avatar from "../ui/avatar";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { SendIcon, Heart, MessageCircle, MoreVertical, Edit, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { vi } from "date-fns/locale";

interface CommentAuthor {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
}

interface Comment {
    _id: string;
    content: string;
    author: CommentAuthor;
    post: string;
    parentComment: string | null;
    replies: Comment[];
    likes: string[];
    likeCount: number;
    isSpam: boolean;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
    updatedAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

interface CommentsResponse {
    comments: Comment[];
    pagination: Pagination;
}

const Comments = ({ postId }: { postId: string }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sort, setSort] = useState<'newest' | 'oldest' | 'mostLiked'>('newest');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const { user } = useUserStore();
    const [comment, setComment] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");

    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get(`/comments/post/${postId}`, {
                params: {
                    page,
                    limit,
                    sort
                }
            });

            const data: CommentsResponse = res;
            setComments(data.comments);
            setPagination(data.pagination);
        } catch (err: any) {
            setError(err.message || 'Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId, page, sort]);

    const handleSubmit = async () => {
        if (!comment.trim()) return;

        try {
            setSubmitting(true);
            setError(null);

            await api.post(`/comments`, {
                postId,
                content: comment.trim(),
                parentCommentId: replyTo
            });

            setComment("");
            setReplyTo(null);
            setReplyContent("");
            fetchComments(); // Refresh comments
        } catch (err: any) {
            setError(err.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (commentId: string) => {
        try {
            await api.post(`/comments/${commentId}/like`);
            fetchComments(); // Refresh comments to update like status
        } catch (err: any) {
            setError(err.message || 'Failed to like comment');
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await api.delete(`/comments/${commentId}`);
            fetchComments(); // Refresh comments
        } catch (err: any) {
            setError(err.message || 'Failed to delete comment');
        }
    };

    const isLiked = (comment: Comment) => {
        return comment.likes.includes(user?._id || '');
    };

    const canEdit = (comment: Comment) => {
        return user?._id === comment.author._id || user?.role === 'admin';
    };

    const canDelete = (comment: Comment) => {
        return user?._id === comment.author._id || user?.role === 'admin';
    };

    const handleReplyContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReplyContent(e.target.value);
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
        <div className={`${isReply ? 'ml-8 mt-3' : 'mb-6'}`}>
            <div className="flex gap-3">
                <Avatar src={comment.author.avatar} alt={comment.author.fullName} />
                <div className="flex-1">
                    <div className="bg-card p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{comment.author.fullName}</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(comment.createdAt), {
                                        addSuffix: true,
                                        locale: vi
                                    })}
                                </span>
                            </div>
                            {(canEdit(comment) || canDelete(comment)) && (
                                <div className="flex items-center gap-1">
                                    {canEdit(comment) && (
                                        <button className="text-muted-foreground hover:text-primary p-1">
                                            <Edit className="w-3 h-3" />
                                        </button>
                                    )}
                                    {canDelete(comment) && (
                                        <button
                                            className="text-muted-foreground hover:text-red-500 p-1"
                                            onClick={() => handleDelete(comment._id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-sm mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4 text-xs">
                            <button
                                className={`flex items-center gap-1 ${isLiked(comment) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                                    }`}
                                onClick={() => handleLike(comment._id)}
                            >
                                <Heart className={`w-3 h-3 ${isLiked(comment) ? 'fill-current' : ''}`} />
                                {comment.likeCount}
                            </button>
                            <button
                                className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                                onClick={() => setReplyTo(comment._id)}
                            >
                                <MessageCircle className="w-3 h-3" />
                                Phản hồi
                            </button>
                        </div>
                    </div>

                    {/* Reply form */}
                    {replyTo === comment._id && (
                        <div className="mt-3 flex items-center gap-2 bg-card p-3 rounded-lg">
                            <Avatar src={user?.avatar} alt={user?.fullName} />
                            <input
                                type="text"
                                placeholder="Viết phản hồi..."
                                className="flex-1 bg-transparent border-none outline-none text-sm"
                                value={replyContent}
                                onChange={handleReplyContentChange}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            />
                            <button
                                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/80 disabled:opacity-50"
                                onClick={async () => {
                                    if (!replyContent.trim()) return;

                                    try {
                                        setSubmitting(true);
                                        setError(null);

                                        await api.post(`/comments`, {
                                            postId,
                                            content: replyContent.trim(),
                                            parentCommentId: comment._id
                                        });

                                        setReplyTo(null);
                                        setReplyContent("");
                                        fetchComments(); // Refresh comments
                                    } catch (err: any) {
                                        setError(err.message || 'Failed to post reply');
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                                disabled={submitting || !replyContent.trim()}
                            >
                                Gửi
                            </button>
                            <button
                                className="text-muted-foreground hover:text-primary"
                                onClick={() => {
                                    setReplyTo(null);
                                    setReplyContent("");
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3">
                            {comment.replies.map((reply) => (
                                <CommentItem key={reply._id} comment={reply} isReply={true} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="mt-10">
            {/* Error message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Sort options */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Comments ({pagination?.total || 0})</h3>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                    className="bg-card border border-border rounded px-3 py-1 text-sm"
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="mostLiked">Most Liked</option>
                </select>
            </div>

            {/* Comment form */}
            {user && (
                <div className="flex items-center gap-2 bg-card p-4 rounded-lg mb-6">
                    <Avatar src={user.avatar} alt={user.fullName} />
                    <input
                        type="text"
                        placeholder="Share your thoughts..."
                        className="flex-1 bg-transparent border-none outline-none"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    <button
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={submitting || !comment.trim()}
                    >
                        <SendIcon className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Comments list */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading comments...</p>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <div>
                    {comments.map((comment) => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        className="px-3 py-1 bg-card border border-border rounded hover:bg-accent disabled:opacity-50"
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                        Page {page} of {pagination.pages}
                    </span>
                    <button
                        className="px-3 py-1 bg-card border border-border rounded hover:bg-accent disabled:opacity-50"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= pagination.pages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Comments;