"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    User,
    Bell,
    Shield,
    Settings,
    Heart,
    BookOpen,
    LogOut,
    Edit,
    Camera,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Eye,
    EyeOff,
    Check,
    X,
    Menu
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import api from "@/api/apiInstance";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import Avatar from "@/components/ui/avatar";

type TabType = "basic" | "notifications" | "security" | "preferences" | "favorites" | "reading-history";

export default function Profile() {
    const [activeTab, setActiveTab] = useState<TabType>("basic");
    const [isOpen, setIsOpen] = useState(false);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const logout = useUserStore((state) => state.logout);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
    }, [user]);
    const tabs = [
        { id: "basic", label: "Thông tin cơ bản", icon: User },
        { id: "notifications", label: "Thông báo", icon: Bell },
        { id: "security", label: "Bảo mật", icon: Shield },
        { id: "preferences", label: "Tùy chọn", icon: Settings },
        { id: "favorites", label: "Yêu thích", icon: Heart },
        { id: "reading-history", label: "Lịch sử đọc", icon: BookOpen },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "basic":
                return <BasicInfoTab />;
            case "notifications":
                return <NotificationsTab />;
            case "security":
                return <SecurityTab />;
            case "preferences":
                return <PreferencesTab />;
            case "favorites":
                return <FavoritesTab />;
            case "reading-history":
                return <ReadingHistoryTab />;
            default:
                return <BasicInfoTab />;
        }
    };

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="bg-white mt-10 rounded-xl shadow-lg overflow-hidden">
                    {/* Responsive */}
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar */}
                        <div className="w-full hidden md:block md:w-80 bg-gray-50 border-r border-gray-200">
                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <div className="relative inline-block">
                                        <Avatar src={user?.avatar} alt={user?.fullName} size={16} />
                                        <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow">
                                            <Camera className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">{user?.fullName}</h2>
                                    <p className="text-gray-500 text-sm">{user?.email}</p>
                                </div>

                                <nav className="space-y-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id as TabType)}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium text-sm md:text-base">{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </nav>

                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    " onClick={() => {
                                        setIsLoading(true);
                                        setIsOpen(true);
                                        setIsLoading(false);
                                    }}
                                    disabled={isLoading}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Đăng xuất</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:hidden">
                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <div className="relative inline-block">
                                        <Avatar src={user?.avatar} alt={user?.fullName} size={10} />
                                        <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow">
                                            <Camera className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-800">{user?.fullName}</h2>
                                    <p className="text-gray-500 text-sm">{user?.email}</p>
                                </div>
                            </div>
                            <div className="pl-6">
                                {/* Menu mobile with dropdown */}
                                <div className="relative">
                                    <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-gray-100 transition-colors" onClick={() => setIsOpen((prev) => !prev)}>
                                        <Menu className="w-5 h-5" />
                                    </button>
                                    {isOpen && (
                                        <div className="absolute left-0 w-48 bg-gray-50 rounded-lg shadow-lg py-2 z-10 px-2">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon;
                                            return (
                                                <button key={tab.id} onClick={() => {
                                                    setActiveTab(tab.id as TabType);
                                                    setIsOpen(false);
                                                }} className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                    }`}>
                                                    <Icon className="w-5 h-5" />
                                                    <span className="font-medium text-sm">{tab.label}</span>
                                                </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-8">
                            <div className="max-w-2xl">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialog
                title="Xác nhận"
                description="Bạn có chắc chắn muốn đăng xuất không?"
                onConfirm={handleLogout}
                onCancel={() => setIsOpen(false)}
                isOpen={isOpen}
            />
        </div>
    );
}

// Tab Components
function BasicInfoTab() {
    const user = useUserStore((state) => state.user);
    const [fullName, setFullName] = useState(user?.fullName);
    const [email, setEmail] = useState(user?.email);
    const [username, setUsername] = useState(user?.username);
    const [bio, setBio] = useState(user?.bio);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setFullName(user?.fullName);
        setEmail(user?.email);
        setUsername(user?.username);
        setBio(user?.bio);
    }, [user]);
    const setUser = useUserStore((state) => state.setUser);
    const saveProfile = async () => {
        setIsLoading(true);
        api.put(`/users/${user?.id}`, {
            fullName,
            email,
            username,
            bio
        }).then(async (res: any) => {
            toast.success("Cập nhật thành công");
            await setUser({
                ...user,
                fullName: res.fullName,
                email: res.email,
                username: res.username,
                bio: res.bio
            });
        }).catch((err: any) => {
            toast.error(err);
        }).finally(() => {
            setIsLoading(false);
        });
    };
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Thông tin cơ bản</h1>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên tài khoản (Username)</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu</label>
                    <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                    " onClick={() => {
                        setFullName(user?.fullName);
                        setEmail(user?.email);
                        setUsername(user?.username);
                        setBio(user?.bio);
                    }}
                    disabled={fullName === user?.fullName && email === user?.email && username === user?.username && bio === user?.bio}
                    >
                        Hủy
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                    " onClick={() => {
                        saveProfile();
                    }}
                    disabled={fullName === user?.fullName && email === user?.email && username === user?.username && bio === user?.bio}
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}

function NotificationsTab() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sms: true,
        newsletter: true,
        comments: true,
        likes: false,
        follows: true
    });

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Cài đặt thông báo (Coming soon)</h1>

            <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông báo qua email</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Thông báo chung</p>
                                <p className="text-sm text-gray-500">Nhận thông báo về các hoạt động quan trọng</p>
                            </div>
                            <button
                                onClick={() => toggleNotification('email')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.email ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Bản tin hàng tuần</p>
                                <p className="text-sm text-gray-500">Nhận tóm tắt các bài viết mới</p>
                            </div>
                            <button
                                onClick={() => toggleNotification('newsletter')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.newsletter ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.newsletter ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tương tác xã hội</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Bình luận</p>
                                <p className="text-sm text-gray-500">Thông báo khi có người bình luận bài viết của bạn</p>
                            </div>
                            <button
                                onClick={() => toggleNotification('comments')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.comments ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.comments ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Lượt thích</p>
                                <p className="text-sm text-gray-500">Thông báo khi có người thích bài viết của bạn</p>
                            </div>
                            <button
                                onClick={() => toggleNotification('likes')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.likes ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.likes ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SecurityTab() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Bảo mật tài khoản</h1>

            <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Đổi mật khẩu</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập mật khẩu mới"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>

                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Cập nhật mật khẩu
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Xác thực hai yếu tố (Coming soon)</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-700">Bảo mật tài khoản</p>
                            <p className="text-sm text-gray-500">Thêm lớp bảo mật cho tài khoản của bạn</p>
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Bật 2FA
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Phiên đăng nhập (Coming soon)</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div>
                                <p className="font-medium text-gray-700">Chrome - Windows</p>
                                <p className="text-sm text-gray-500">192.168.1.1 • Hoạt động hiện tại</p>
                            </div>
                            <span className="text-green-600 text-sm font-medium">Hiện tại</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div>
                                <p className="font-medium text-gray-700">Safari - iPhone</p>
                                <p className="text-sm text-gray-500">192.168.1.2 • 2 giờ trước</p>
                            </div>
                            <button className="text-red-600 text-sm font-medium hover:text-red-700">
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PreferencesTab() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tùy chọn</h1>

            <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Giao diện</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Chủ đề</label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>Sáng</option>
                                <option>Tối</option>
                                <option>Tự động</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>Tiếng Việt</option>
                                <option>English (Coming soon)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quyền riêng tư (Coming soon)</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Hiển thị hồ sơ công khai</p>
                                <p className="text-sm text-gray-500">Cho phép người khác xem thông tin cơ bản của bạn</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Hiển thị email</p>
                                <p className="text-sm text-gray-500">Cho phép người khác xem email của bạn</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FavoritesTab() {
    const favorites = [
        { id: 1, title: "Hướng dẫn React cho người mới bắt đầu", author: "Nguyễn Văn B", date: "2024-01-15" },
        { id: 2, title: "TypeScript vs JavaScript: Nên chọn gì?", author: "Trần Thị C", date: "2024-01-10" },
        { id: 3, title: "Best Practices cho Next.js", author: "Lê Văn D", date: "2024-01-05" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Bài viết yêu thích</h1>

            <div className="space-y-4">
                {favorites.map((favorite) => (
                    <div key={favorite.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{favorite.title}</h3>
                                <p className="text-gray-600 mb-2">Tác giả: {favorite.author}</p>
                                <p className="text-sm text-gray-500">Đã lưu vào: {favorite.date}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                    <BookOpen className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReadingHistoryTab() {
    const history = [
        { id: 1, title: "Hướng dẫn React cho người mới bắt đầu", author: "Nguyễn Văn B", date: "2024-01-15", time: "2 giờ trước" },
        { id: 2, title: "TypeScript vs JavaScript: Nên chọn gì?", author: "Trần Thị C", date: "2024-01-10", time: "1 ngày trước" },
        { id: 3, title: "Best Practices cho Next.js", author: "Lê Văn D", date: "2024-01-05", time: "3 ngày trước" },
        { id: 4, title: "CSS Grid Layout Complete Guide", author: "Phạm Văn E", date: "2024-01-01", time: "1 tuần trước" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử đọc</h1>

            <div className="space-y-4">
                {history.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-gray-600 mb-2">Tác giả: {item.author}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>Ngày đọc: {item.date}</span>
                                    <span>•</span>
                                    <span>{item.time}</span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                    <BookOpen className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Xem thêm
                </button>
            </div>
        </div>
    );
}