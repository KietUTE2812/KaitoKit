'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit, Trash2, Eye, Calendar, User, Tag, FileText, BarChart3 } from "lucide-react";
import useLoading from "@/components/GlobalLoading/useLoading";
import toast from "react-hot-toast";
import MarkdownEditor from "@/components/ui/markdown-editor";
import api from "@/api/apiInstance";

interface Post {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    status: 'published' | 'draft' | 'archived';
    author: {
        id: string;
        name: string;
        email: string;
    };
    category?: string;
    tags?: string[];
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    views?: number;
    likes?: number;
    comments?: number;
}

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const setLoading = useLoading();

    useEffect(() => {
        if (!id) return;
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await api.get(`/posts/${id}`);
            setPost(res.post);
            setEditedContent(res.post.content);
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể tải thông tin bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!post) return;
        setLoading(true);
        try {
            await api.put(`/posts/${id}`, {
                ...post,
                content: editedContent
            });
            setPost({ ...post, content: editedContent });
            setIsEditing(false);
            toast.success('Cập nhật bài viết thành công');
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể cập nhật bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditedContent(post?.content || '');
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!post) return;
        if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
        
        setLoading(true);
        try {
            await api.delete(`/posts/${id}`);
            toast.success('Xóa bài viết thành công');
            router.push('/admin');
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể xóa bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: Post['status']) => {
        if (!post) return;
        setLoading(true);
        try {
            await api.put(`/posts/${id}`, {
                ...post,
                status: newStatus
            });
            setPost({ ...post, status: newStatus });
            toast.success('Cập nhật trạng thái thành công');
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể cập nhật trạng thái');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: Post['status']) => {
        switch (status) {
            case 'published': return 'bg-green-500';
            case 'draft': return 'bg-yellow-500';
            case 'archived': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: Post['status']) => {
        switch (status) {
            case 'published': return 'Đã xuất bản';
            case 'draft': return 'Bản nháp';
            case 'archived': return 'Đã lưu trữ';
            default: return 'Không xác định';
        }
    };

    if (!post) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg">
            {/* Header */}
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-text">{post.title}</h1>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-muted">
                                    <span className="flex items-center">
                                        <User className="w-4 h-4 mr-1" />
                                        {post.author.name}
                                    </span>
                                    <span className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(post.status)}`}>
                                        {getStatusText(post.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Xóa
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Lưu
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-card border border-border rounded-lg p-6">
                            {isEditing ? (
                                <div>
                                    <h2 className="text-lg font-semibold text-text mb-4">Chỉnh sửa nội dung</h2>
                                    <MarkdownEditor
                                        content={editedContent}
                                        onChange={setEditedContent}
                                        placeholder="Nhập nội dung bài viết..."
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-lg font-semibold text-text mb-4">Nội dung bài viết</h2>
                                    <div className="prose prose-invert max-w-none">
                                        <MarkdownEditor
                                            content={post.content}
                                            onChange={() => {}}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Stats */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-text mb-4">Thống kê</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted">Lượt xem</span>
                                        <span className="font-semibold text-text">{post.views || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted">Lượt thích</span>
                                        <span className="font-semibold text-text">{post.likes || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted">Bình luận</span>
                                        <span className="font-semibold text-text">{post.comments || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Control */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-text mb-4">Trạng thái</h3>
                                <div className="space-y-2">
                                    {(['published', 'draft', 'archived'] as const).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(status)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                                post.status === status
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-accent/20'
                                            }`}
                                        >
                                            {getStatusText(status)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Meta Information */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-text mb-4">Thông tin</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-muted">Tạo lúc:</span>
                                        <p className="text-text">{new Date(post.createdAt).toLocaleString('vi-VN')}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted">Cập nhật:</span>
                                        <p className="text-text">{new Date(post.updatedAt).toLocaleString('vi-VN')}</p>
                                    </div>
                                    {post.publishedAt && (
                                        <div>
                                            <span className="text-muted">Xuất bản:</span>
                                            <p className="text-text">{new Date(post.publishedAt).toLocaleString('vi-VN')}</p>
                                        </div>
                                    )}
                                    {post.category && (
                                        <div>
                                            <span className="text-muted">Danh mục:</span>
                                            <p className="text-text">{post.category}</p>
                                        </div>
                                    )}
                                    {post.tags && post.tags.length > 0 && (
                                        <div>
                                            <span className="text-muted">Tags:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {post.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-accent/20 text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;