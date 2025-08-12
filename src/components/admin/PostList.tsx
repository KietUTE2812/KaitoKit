'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Eye, Search, Filter, Calendar, User, Tag, MoreVertical, Plus, FileText } from 'lucide-react';
import api from '@/api/apiInstance';
import useLoading from '@/components/GlobalLoading/useLoading';
import toast from 'react-hot-toast';

interface Post {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    slug: string;
    status: 'published' | 'draft' | 'archived';
    author: {
        id: string;
        name: string;
        email: string;
    };
    category?: {
        _id: string;
        name: string;
        slug: string;
    };
    tags?: string[];
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    views?: number;
    likes?: number;
    comments?: number;
    featuredImage?: string;
}

interface PostListProps {
    onPostSelect?: (post: Post) => void;
    showActions?: boolean;
}


const PostList: React.FC<PostListProps> = ({ onPostSelect, showActions = true }) => {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<Post['status'] | 'all'>('all');
    const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title' | 'views'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const setLoading = useLoading();

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        filterAndSortPosts();
    }, [posts, searchQuery, statusFilter, sortBy, sortOrder]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/posts');
            console.log(res);
            setPosts(res.posts);
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortPosts = () => {
        let filtered = posts.length > 0 ? posts?.filter((post: Post) => {
            const matchesSearch = post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                post?.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                post?.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || post?.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        }) : [];

        // Sort posts
        filtered?.sort((a: Post, b: Post) => {
            let aValue: any, bValue: any;
            
            switch (sortBy) {
                case 'createdAt':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                case 'updatedAt':
                    aValue = new Date(a.updatedAt);
                    bValue = new Date(b.updatedAt);
                    break;
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'views':
                    aValue = a.views || 0;
                    bValue = b.views || 0;
                    break;
                default:
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredPosts(filtered);
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
        
        setLoading(true);
        try {
            await api.delete(`/posts/${postId}`);
            setPosts(posts?.filter((post: Post) => post.id !== postId));
            setFilteredPosts(filteredPosts?.filter((post: Post) => post.id !== postId));
            toast.success('Xóa bài viết thành công');
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể xóa bài viết');
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

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text">Quản lý bài viết</h2>
                    <p className="text-muted">Tổng cộng {filteredPosts.length} bài viết</p>
                </div>
                <button
                    onClick={() => router.push('/admin/posts/create')}
                    className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo bài viết mới
                </button>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm bài viết..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Post['status'] | 'all')}
                        className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="published">Đã xuất bản</option>
                        <option value="draft">Bản nháp</option>
                        <option value="archived">Đã lưu trữ</option>
                    </select>

                    {/* Sort By */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="createdAt">Ngày tạo</option>
                        <option value="updatedAt">Ngày cập nhật</option>
                        <option value="title">Tiêu đề</option>
                        <option value="views">Lượt xem</option>
                    </select>

                    {/* Sort Order */}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="desc">Giảm dần</option>
                        <option value="asc">Tăng dần</option>
                    </select>
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-accent/10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    Bài viết
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    Tác giả
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    Thống kê
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                {showActions && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-accent/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            {post?.featuredImage && (
                                                <img
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-text truncate">
                                                    {post?.title}
                                                </p>
                                                <p className="text-sm text-muted truncate">
                                                    {truncateText(post?.excerpt || post?.content, 100)}
                                                </p>
                                                {post?.category && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-muted mt-1">
                                                        {post?.category?.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 text-muted mr-2" />
                                            <span className="text-sm text-text">{post?.author?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(post.status)}`}>
                                            {getStatusText(post?.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-muted space-y-1">
                                            <div className="flex items-center">
                                                <Eye className="w-3 h-3 mr-1" />
                                                {post?.views || 0} lượt xem
                                            </div>
                                            <div className="flex items-center">
                                                <Tag className="w-3 h-3 mr-1" />
                                                {post?.likes || 0} lượt thích
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-muted">
                                            <div>{new Date(post?.createdAt).toLocaleDateString('vi-VN')}</div>
                                            <div className="text-xs">
                                                {new Date(post?.createdAt).toLocaleTimeString('vi-VN')}
                                            </div>
                                        </div>
                                    </td>
                                    {showActions && (
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => router.push(`/admin/posts/${post.slug}`)}      
                                                    className="p-2 text-muted hover:text-text hover:bg-accent/20 rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/admin/posts/${post.slug}/edit`)}
                                                    className="p-2 text-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-muted">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Không có bài viết nào</p>
                            <p className="text-sm">Tạo bài viết đầu tiên của bạn</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostList; 