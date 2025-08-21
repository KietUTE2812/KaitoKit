'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, X, Eye, Calendar, User, Tag, FileText, Image as ImageIcon } from "lucide-react";
import useLoading from "@/components/GlobalLoading/useLoading";
import toast from "react-hot-toast";
import MarkdownEditor from "@/components/ui/markdown-editor";
import api from "@/api/apiInstance";

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    postCount?: number;
    createdAt: string;
    updatedAt: string;
}

interface Post {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    status: 'published' | 'draft' | 'archived';
    author: {
        id: string;
        fullName: string;
        email: string;
    };
    slug: string;
    category?: string;
    tags?: string[];
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    views?: number;
    likes?: number;
    comments?: number;
    featuredImage?: string;
}

const EditPost = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        status: 'draft' as Post['status'],
        category: '',
        tags: [] as string[],
        featuredImage: ''
    });
    const [tagInput, setTagInput] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const setLoading = useLoading();
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        if (!id) return;
        fetchPost();
        fetchCategories();
    }, [id]);

    const fetchPost = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await api.get(`/posts/${id}`);
            console.log(res);
            const postData = res.post;
            setPost(postData);
            setFormData({
                title: postData.title || '',
                content: postData.content || '',
                excerpt: postData.excerpt || '',
                status: postData.status || 'draft',
                category: postData.category || '',
                tags: postData.tags || [],
                featuredImage: postData.featuredImage || ''
            });
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể tải thông tin bài viết');
            router.push('/admin');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            console.log(res);
            setCategories(res || []);
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể tải danh sách danh mục');
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUploadFeaturedImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            const res = await api.post('/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData(prev => ({
                ...prev,
                featuredImage: res.url
            }));
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSave = async (publish: boolean = false) => {
        if (!post) return;

        const finalStatus = publish ? 'published' : formData.status;
        const finalData = {
            ...formData,
            status: finalStatus,
            publishedAt: publish ? new Date().toISOString() : post.publishedAt
        };

        setLoading(true);
        try {
            await api.put(`/posts/${id}`, finalData);
            toast.success(publish ? 'Xuất bản bài viết thành công' : 'Cập nhật bài viết thành công');
            router.push(`/admin/posts/${id}`);
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể cập nhật bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (!post) {
        return null;
    }

    return (
        <div className="min-h-screen bg-bg">
            {/* Header */}
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleCancel}
                                className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-text">Chỉnh sửa bài viết</h1>
                                <p className="text-muted">Cập nhật thông tin bài viết</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsPreview(!isPreview)}
                                className="flex items-center px-4 py-2 bg-accent/20 text-text rounded-lg hover:bg-accent/30 transition-colors"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                {isPreview ? 'Chỉnh sửa' : 'Xem trước'}
                            </button>
                            <button
                                onClick={() => handleSave(false)}
                                className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Lưu nháp
                            </button>
                            <button
                                onClick={() => handleSave(true)}
                                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Xuất bản
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {/* Title */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <label className="block text-sm font-medium text-text mb-2">
                                    Tiêu đề bài viết
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Nhập tiêu đề bài viết..."
                                />
                            </div>

                            {/* Excerpt */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <label className="block text-sm font-medium text-text mb-2">
                                    Tóm tắt bài viết
                                </label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    placeholder="Nhập tóm tắt bài viết..."
                                />
                            </div>

                            {/* Content */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <label className="block text-sm font-medium text-text mb-4">
                                    Nội dung bài viết
                                </label>
                                {isPreview ? (
                                    <div className="prose prose-invert max-w-none">
                                        <MarkdownEditor
                                            content={formData.content}
                                            onChange={() => { }}
                                        />
                                    </div>
                                ) : (
                                    <MarkdownEditor
                                        content={formData.content}
                                        onChange={(content) => handleInputChange('content', content)}
                                        placeholder="Nhập nội dung bài viết..."
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Status */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-text mb-4">Trạng thái</h3>
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="draft">Bản nháp</option>
                                    <option value="published">Đã xuất bản</option>
                                    <option value="archived">Đã lưu trữ</option>
                                </select>
                            </div>

                            {/* Category */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-text mb-4">Danh mục</h3>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-text mb-4">Tags</h3>
                                <div className="space-y-3">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Nhập tag..."
                                        />
                                        <button
                                            onClick={handleAddTag}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="flex items-center px-3 py-1 bg-accent/20 text-sm rounded-full"
                                            >
                                                {tag}
                                                <button
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-2 hover:text-red-500"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-text mb-4">Ảnh đại diện</h3>
                                <div className="space-y-3">
                                    <input
                                        type="file"
                                        onChange={handleUploadFeaturedImage}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <span className="text-muted">Hoặc nhập URL ảnh đại diện</span>
                                    <input type="text" value={formData.featuredImage} onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    {formData.featuredImage && (
                                        <div className="relative">
                                            <img
                                                src={formData.featuredImage}
                                                alt="Featured"
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Meta Information */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-text mb-4">Thông tin</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-muted">Tác giả:</span>
                                        <p className="text-text">{post.author.fullName}</p>
                                    </div>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPost;
