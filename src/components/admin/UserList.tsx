'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Eye, Search, User, Mail, Calendar, Shield, MoreVertical, Plus, Users, FileText, MessageSquare } from 'lucide-react';
import api from '@/api/apiInstance';
import useLoading from '@/components/GlobalLoading/useLoading';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'author' | 'user';
    status: 'active' | 'inactive' | 'banned';
    avatar?: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    postsCount?: number;
    commentsCount?: number;
}

interface UserListProps {
    onUserSelect?: (user: User) => void;
    showActions?: boolean;
}

const UserList: React.FC<UserListProps> = ({ onUserSelect, showActions = true }) => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<User['status'] | 'all'>('all');
    const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'email' | 'postsCount'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const setLoading = useLoading();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterAndSortUsers();
    }, [users, searchQuery, roleFilter, statusFilter, sortBy, sortOrder]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users');
            setUsers(res.users);
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortUsers = () => {
        let filtered = users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });

        // Sort users
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'createdAt':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'email':
                    aValue = a.email.toLowerCase();
                    bValue = b.email.toLowerCase();
                    break;
                case 'postsCount':
                    aValue = a.postsCount || 0;
                    bValue = b.postsCount || 0;
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

        setFilteredUsers(filtered);
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

        setLoading(true);
        try {
            await api.delete(`/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            toast.success('Xóa người dùng thành công');
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể xóa người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId: string, newStatus: User['status']) => {
        setLoading(true);
        try {
            await api.put(`/users/${userId}`, { status: newStatus });
            setUsers(users.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ));
            toast.success('Cập nhật trạng thái thành công');
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể cập nhật trạng thái');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: User['role']) => {
        setLoading(true);
        try {
            await api.put(`/users/${userId}`, { role: newRole });
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
            toast.success('Cập nhật vai trò thành công');
        } catch (err: any) {
            console.log(err);
            toast.error('Không thể cập nhật vai trò');
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role: User['role']) => {
        switch (role) {
            case 'admin': return 'bg-red-500';
            case 'author': return 'bg-blue-500';
            case 'user': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getRoleText = (role: User['role']) => {
        switch (role) {
            case 'admin': return 'Quản trị viên';
            case 'author': return 'Tác giả';
            case 'user': return 'Người dùng';
            default: return 'Không xác định';
        }
    };

    const getStatusColor = (status: User['status']) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'inactive': return 'bg-yellow-500';
            case 'banned': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: User['status']) => {
        switch (status) {
            case 'active': return 'Hoạt động';
            case 'inactive': return 'Không hoạt động';
            case 'banned': return 'Bị cấm';
            default: return 'Không xác định';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text">Quản lý người dùng</h2>
                    <p className="text-muted">Tổng cộng {filteredUsers.length} người dùng</p>
                </div>
                <button
                    onClick={() => router.push('/admin/users/create')}
                    className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm người dùng
                </button>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm người dùng..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as User['role'] | 'all')}
                        className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">Tất cả vai trò</option>
                        <option value="admin">Quản trị viên</option>
                        <option value="author">Tác giả</option>
                        <option value="user">Người dùng</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as User['status'] | 'all')}
                        className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                        <option value="banned">Bị cấm</option>
                    </select>

                    {/* Sort By */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="createdAt">Ngày tạo</option>
                        <option value="name">Tên</option>
                        <option value="email">Email</option>
                        <option value="postsCount">Số bài viết</option>
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

            {/* Users List */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-accent/10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    Thống kê
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                    Ngày tham gia
                                </th>
                                {showActions && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-accent/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                {user.avatar ? (
                                                    <Image
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        width={500}
                                                        height={500}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-muted" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-text truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-muted truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                                            className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(user.role)} border-none focus:outline-none focus:ring-2 focus:ring-primary`}
                                        >
                                            <option value="admin">Quản trị viên</option>
                                            <option value="author">Tác giả</option>
                                            <option value="user">Người dùng</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.status}
                                            onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                                            className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(user.status)} border-none focus:outline-none focus:ring-2 focus:ring-primary`}
                                        >
                                            <option value="active">Hoạt động</option>
                                            <option value="inactive">Không hoạt động</option>
                                            <option value="banned">Bị cấm</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-muted space-y-1">
                                            <div className="flex items-center">
                                                <FileText className="w-3 h-3 mr-1" />
                                                {user.postsCount || 0} bài viết
                                            </div>
                                            <div className="flex items-center">
                                                <MessageSquare className="w-3 h-3 mr-1" />
                                                {user.commentsCount || 0} bình luận
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-muted">
                                            <div>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</div>
                                            <div className="text-xs">
                                                {new Date(user.createdAt).toLocaleTimeString('vi-VN')}
                                            </div>
                                        </div>
                                    </td>
                                    {showActions && (
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => router.push(`/admin/users/${user.id}`)}
                                                    className="p-2 text-muted hover:text-text hover:bg-accent/20 rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                                                    className="p-2 text-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
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

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-muted">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Không có người dùng nào</p>
                            <p className="text-sm">Thêm người dùng đầu tiên</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList; 