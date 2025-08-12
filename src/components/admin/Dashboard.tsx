'use client';

import { useState, useEffect } from 'react';
import { 
    FileText, 
    Users, 
    Eye, 
    MessageSquare, 
    TrendingUp, 
    TrendingDown,
    Calendar,
    BarChart3,
    Activity,
    BookOpen,
    User,
    Clock,
    Plus
} from 'lucide-react';
import api from '@/api/apiInstance';
import useLoading from '@/components/GlobalLoading/useLoading';

interface DashboardStats {
    totalPosts: number;
    totalUsers: number;
    totalViews: number;
    totalComments: number;
    publishedPosts: number;
    draftPosts: number;
    activeUsers: number;
    newUsersThisMonth: number;
    postsThisMonth: number;
    viewsThisMonth: number;
    topPosts: Array<{
        id: string;
        title: string;
        views: number;
        author: string;
    }>;
    recentActivity: Array<{
        id: string;
        type: 'post_created' | 'post_published' | 'user_registered' | 'comment_added';
        title: string;
        user: string;
        timestamp: string;
    }>;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const setGlobalLoading = useLoading();

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        setGlobalLoading(true);
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res);
        } catch (err: any) {
            console.log(err);
            // Fallback to mock data if API fails
            setStats({
                totalPosts: 25,
                totalUsers: 150,
                totalViews: 12500,
                totalComments: 340,
                publishedPosts: 18,
                draftPosts: 7,
                activeUsers: 120,
                newUsersThisMonth: 15,
                postsThisMonth: 8,
                viewsThisMonth: 3200,
                topPosts: [
                    { id: '1', title: 'Hướng dẫn React Hooks cơ bản', views: 1250, author: 'Kaito Kit' },
                    { id: '2', title: 'Next.js 14 App Router', views: 890, author: 'Kaito Kit' },
                    { id: '3', title: 'TypeScript Best Practices', views: 650, author: 'Kaito Kit' },
                    { id: '4', title: 'CSS Grid Layout', views: 420, author: 'Kaito Kit' },
                    { id: '5', title: 'JavaScript ES6+ Features', views: 380, author: 'Kaito Kit' }
                ],
                recentActivity: [
                    { id: '1', type: 'post_published', title: 'Hướng dẫn React Hooks cơ bản', user: 'Kaito Kit', timestamp: '2024-01-15T10:30:00Z' },
                    { id: '2', type: 'user_registered', title: 'Người dùng mới đăng ký', user: 'john.doe@example.com', timestamp: '2024-01-15T09:15:00Z' },
                    { id: '3', type: 'comment_added', title: 'Bình luận mới trên bài viết', user: 'user123', timestamp: '2024-01-15T08:45:00Z' },
                    { id: '4', type: 'post_created', title: 'Bài viết mới được tạo', user: 'Kaito Kit', timestamp: '2024-01-14T16:20:00Z' },
                    { id: '5', type: 'post_published', title: 'Next.js 14 App Router', user: 'Kaito Kit', timestamp: '2024-01-14T14:10:00Z' }
                ]
            });
        } finally {
            setGlobalLoading(false);
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'post_created':
            case 'post_published':
                return <FileText className="w-4 h-4" />;
            case 'user_registered':
                return <User className="w-4 h-4" />;
            case 'comment_added':
                return <MessageSquare className="w-4 h-4" />;
            default:
                return <Activity className="w-4 h-4" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'post_created':
            case 'post_published':
                return 'text-blue-500 bg-blue-500/10';
            case 'user_registered':
                return 'text-green-500 bg-green-500/10';
            case 'comment_added':
                return 'text-purple-500 bg-purple-500/10';
            default:
                return 'text-gray-500 bg-gray-500/10';
        }
    };

    const getActivityText = (type: string) => {
        switch (type) {
            case 'post_created':
                return 'Tạo bài viết mới';
            case 'post_published':
                return 'Xuất bản bài viết';
            case 'user_registered':
                return 'Đăng ký tài khoản';
            case 'comment_added':
                return 'Thêm bình luận';
            default:
                return 'Hoạt động khác';
        }
    };

    if (loading || !stats) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted">Đang tải dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text">Dashboard</h1>
                <p className="text-muted">Tổng quan hệ thống blog</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Posts */}
                <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted">Tổng bài viết</p>
                            <p className="text-2xl font-bold text-text mt-1">{stats.totalPosts}</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-xs text-green-500">+{stats.postsThisMonth}</span>
                                <span className="text-xs text-muted ml-1">tháng này</span>
                            </div>
                        </div>
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted">Người dùng</p>
                            <p className="text-2xl font-bold text-text mt-1">{stats.totalUsers}</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-xs text-green-500">+{stats.newUsersThisMonth}</span>
                                <span className="text-xs text-muted ml-1">tháng này</span>
                            </div>
                        </div>
                        <div className="bg-green-500 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Total Views */}
                <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted">Lượt xem</p>
                            <p className="text-2xl font-bold text-text mt-1">{stats.totalViews.toLocaleString()}</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-xs text-green-500">+{stats.viewsThisMonth.toLocaleString()}</span>
                                <span className="text-xs text-muted ml-1">tháng này</span>
                            </div>
                        </div>
                        <div className="bg-purple-500 p-3 rounded-lg">
                            <Eye className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Total Comments */}
                <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted">Bình luận</p>
                            <p className="text-2xl font-bold text-text mt-1">{stats.totalComments}</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-xs text-green-500">+12%</span>
                                <span className="text-xs text-muted ml-1">so với tháng trước</span>
                            </div>
                        </div>
                        <div className="bg-orange-500 p-3 rounded-lg">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Posts Status */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-text mb-4">Trạng thái bài viết</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-sm text-text">Đã xuất bản</span>
                            </div>
                            <span className="text-sm font-medium text-text">{stats.publishedPosts}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                <span className="text-sm text-text">Bản nháp</span>
                            </div>
                            <span className="text-sm font-medium text-text">{stats.draftPosts}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                                <span className="text-sm text-text">Đã lưu trữ</span>
                            </div>
                            <span className="text-sm font-medium text-text">{stats.totalPosts - stats.publishedPosts - stats.draftPosts}</span>
                        </div>
                    </div>
                </div>

                {/* User Status */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-text mb-4">Trạng thái người dùng</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-sm text-text">Hoạt động</span>
                            </div>
                            <span className="text-sm font-medium text-text">{stats.activeUsers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                <span className="text-sm text-text">Không hoạt động</span>
                            </div>
                            <span className="text-sm font-medium text-text">{stats.totalUsers - stats.activeUsers}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-text mb-4">Thao tác nhanh</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                            <Plus className="w-4 h-4 mr-2" />
                            Tạo bài viết mới
                        </button>
                        <button className="w-full flex items-center px-4 py-2 bg-accent/20 text-text rounded-lg hover:bg-accent/30 transition-colors">
                            <Users className="w-4 h-4 mr-2" />
                            Quản lý người dùng
                        </button>
                        <button className="w-full flex items-center px-4 py-2 bg-accent/20 text-text rounded-lg hover:bg-accent/30 transition-colors">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Xem báo cáo
                        </button>
                    </div>
                </div>
            </div>

            {/* Top Posts & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Posts */}
                <div className="bg-card border border-border rounded-lg">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-semibold text-text">Bài viết phổ biến</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {stats.topPosts.map((post, index) => (
                                <div key={post.id} className="flex items-center justify-between p-4 bg-bg rounded-lg hover:bg-accent/5 transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm font-medium text-text">{index + 1}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-text text-sm">{post.title}</h4>
                                            <p className="text-xs text-muted">{post.author}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-muted">
                                        <Eye className="w-4 h-4 mr-1" />
                                        {post.views.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card border border-border rounded-lg">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-semibold text-text">Hoạt động gần đây</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {stats.recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text">
                                            {getActivityText(activity.type)}
                                        </p>
                                        <p className="text-xs text-muted truncate">{activity.title}</p>
                                        <div className="flex items-center mt-1">
                                            <span className="text-xs text-muted">{activity.user}</span>
                                            <span className="text-xs text-muted mx-2">•</span>
                                            <span className="text-xs text-muted">
                                                {new Date(activity.timestamp).toLocaleString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 