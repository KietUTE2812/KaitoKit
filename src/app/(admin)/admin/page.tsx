'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  TrendingUp,
  Activity,
  BookOpen,
  MessageSquare,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import Avatar from '@/components/ui/avatar';
import useLoading from '@/components/GlobalLoading/useLoading';
import PostList from '@/components/admin/PostList';
import Dashboard from '@/components/admin/Dashboard';
import Category from '@/components/admin/Category';

interface Post {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  publishDate: string;
  views: number;
  category: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'author' | 'user';
  joinDate: string;
  status: 'active' | 'inactive';
}

export default function Admin() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const setLoading = useLoading();


  // Mock data
  useEffect(() => {
    setPosts([
      {
        id: '1',
        title: 'Hướng dẫn React Hooks cơ bản',
        status: 'published',
        author: 'Kaito Kit',
        publishDate: '2024-01-15',
        views: 1250,
        category: 'React'
      },
      {
        id: '2',
        title: 'Next.js 14 App Router',
        status: 'draft',
        author: 'Kaito Kit',
        publishDate: '2024-01-20',
        views: 0,
        category: 'Next.js'
      },
      {
        id: '3',
        title: 'TypeScript Best Practices',
        status: 'published',
        author: 'Kaito Kit',
        publishDate: '2024-01-10',
        views: 890,
        category: 'TypeScript'
      }
    ]);

    setUsers([
      {
        id: '1',
        name: 'Kaito Kit',
        email: 'kaito@example.com',
        role: 'admin',
        joinDate: '2024-01-01',
        status: 'active'
      },
      {
        id: '2',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'author',
        joinDate: '2024-01-05',
        status: 'active'
      }
    ]);
  }, []);

  useEffect(() => {
    setLoading(true);
    (useUserStore.persist as any).rehydrate().then(() => {
      setHydrated(true);
      setLoading(false);
    });
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (user?.role !== 'admin' && hydrated) {
      toast.error('Bạn không có quyền truy cập trang admin');
      router.push('/');
    }
  }, [user, hydrated]);

  const stats = [
    {
      title: 'Tổng bài viết',
      value: posts.length,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Lượt xem',
      value: posts.reduce((sum, post) => sum + post.views, 0),
      icon: Eye,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Người dùng',
      value: users.length,
      icon: Users,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Bình luận',
      value: 156,
      icon: MessageSquare,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
    toast.success('Đăng xuất thành công');
  };

  const renderDashboard = () => (
    <Dashboard />
  );

  const renderPosts = () => (
    <PostList showActions={true} />
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Quản lý người dùng</h2>
          <p className="text-muted">Quản lý tài khoản người dùng và phân quyền</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Ngày tham gia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-accent/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-text">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'author' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Quản trị viên' :
                       user.role === 'author' ? 'Tác giả' : 'Người dùng'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-muted hover:text-primary transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-muted hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text">Cài đặt</h2>
        <p className="text-muted">Quản lý cài đặt hệ thống và tài khoản</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Cài đặt chung</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Tên trang web</label>
              <input
                type="text"
                defaultValue="Kaito Kit"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-bg text-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Mô tả</label>
              <textarea
                rows={3}
                defaultValue="Blog chia sẻ kiến thức, kinh nghiệm và những câu chuyện thú vị về công nghệ, cuộc sống."
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-bg text-text"
              />
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Lưu thay đổi
            </button>
          </div>
        </div>

        {/* User Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Cài đặt tài khoản</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Tên hiển thị</label>
              <input
                type="text"
                defaultValue={user?.fullName || ''}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-bg text-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email || ''}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-bg text-text"
              />
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategory = () => (
    <Category />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'posts':
        return renderPosts();
      case 'users':
        return renderUsers();
      case 'settings':
        return renderSettings();
      case 'category':
        return renderCategory();
      default:
        return renderDashboard();
    }
  };

  if (!user || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg flex flex-row w-full">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Avatar src={user?.avatar} alt={user?.fullName} size={10} />
            <span className="text-xl font-bold text-text">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-muted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'posts', label: 'Bài viết', icon: FileText },
              { id: 'category', label: 'Danh mục', icon: BookOpen },
              { id: 'users', label: 'Người dùng', icon: Users },
              { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
              { id: 'settings', label: 'Cài đặt', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-text hover:bg-accent/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-text hover:bg-accent/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-screen overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10 h-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-muted hover:text-text transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-text">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'posts' && 'Quản lý bài viết'}
                  {activeTab === 'category' && 'Quản lý danh mục'}
                  {activeTab === 'users' && 'Quản lý người dùng'}
                  {activeTab === 'analytics' && 'Thống kê'}
                  {activeTab === 'settings' && 'Cài đặt'}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar src={user?.avatar} alt={user?.fullName} size={10} />
                <span className="text-sm font-medium text-text">{user.fullName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 h-fit rounded-tl-2xl border-t border-border ">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}