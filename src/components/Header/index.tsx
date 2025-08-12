'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { LogOut, Shield, User } from 'lucide-react';
import Avatar from '../ui/avatar';
import Dropdown from '../ui/dropdown';

export default function Header() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const logout = useUserStore((state) => state.logout);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
    }, [user]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log('Searching for:', searchQuery);
    };

    return (
        <header className="bg-primary shadow-sm border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2">
                            {/* Logo */}
                            <div className="bg-white rounded-lg flex items-center justify-center" onClick={() => router.push('/')}>
                                <Image className='rounded-lg object-contain m-0.5' src="/tile_1.png" alt="Logo" width={30} height={30} />
                            </div>
                            <span className="text-xl font-bold text-white">Kaito Kit</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            href="/"
                            className="text-white hover:text-accent transition-colors duration-200 font-medium"
                        >
                            Trang chủ
                        </Link>
                        <Link
                            href="/blog"
                            className="text-white hover:text-accent transition-colors duration-200 font-medium"
                        >
                            Bài viết
                        </Link>
                        <Link
                            href="/about"
                            className="text-white hover:text-accent transition-colors duration-200 font-medium"
                        >
                            Giới thiệu
                        </Link>
                        <Link
                            href="/contact"
                            className="text-white hover:text-accent transition-colors duration-200 font-medium"
                        >
                            Liên hệ
                        </Link>
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center space-x-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 px-4 py-2 pl-10 pr-4 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-accent focus:outline-none focus:text-accent"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Account */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <button className="text-white hover:text-accent transition-colors duration-200 font-medium text-ellipsis whitespace-nowrap max-w-20 overflow-hidden" onClick={() => router.push('/profile')}>
                                {user.fullName}
                            </button>
                        ) : (
                            <button className="text-white hover:text-accent transition-colors duration-200 font-medium" onClick={() => router.push('/login')}>
                                Đăng nhập
                            </button>
                        )}
                        <div className="relative inline-block">
                            <Dropdown trigger={<Avatar src={user?.avatar} alt={user?.fullName} size={10} />} position="center">

                                {/* Divider */}

                                <Link href="/profile" className="flex justify-between px-3 py-2 text-primary hover:text-accent rounded-md transition-colors duration-200 font-medium flex items-center gap-2">
                                    <span>Thông tin</span>
                                    <User className="w-4 h-4" />
                                </Link>
                                {user?.role === 'admin' && (
                                    <>
                                        <div className="h-px w-full bg-primary" />
                                        <Link href="/admin" className="flex justify-between px-3 py-2 text-primary hover:text-accent rounded-md transition-colors duration-200 font-medium flex items-center gap-2">
                                            <span>Admin</span>
                                            <Shield className="w-4 h-4" />
                                        </Link>
                                    </>
                                )}
                                {user && (
                                    <>
                                        <div className="h-px w-full bg-primary" />
                                        <Link href="/profile" className="flex justify-between px-3 py-2 text-primary hover:text-accent rounded-md transition-colors duration-200 font-medium flex items-center gap-2" onClick={() => {
                                            logout();
                                            router.push('/login');
                                        }}>
                                            <span>Đăng xuất</span>
                                            <LogOut className="w-4 h-4" />
                                        </Link>
                                    </>
                                )}
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/20">
                            <Link
                                href=""
                                className="block px-3 py-2 text-white hover:text-accent transition-colors duration-200 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Trang chủ
                            </Link>
                            <Link
                                href="/blog"
                                className="block px-3 py-2 text-white hover:text-accent transition-colors duration-200 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Bài viết
                            </Link>
                            <Link
                                href="/about"
                                className="block px-3 py-2 text-white hover:text-accent transition-colors duration-200 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Giới thiệu
                            </Link>
                            <Link
                                href="/contact"
                                className="block px-3 py-2 text-white hover:text-accent transition-colors duration-200 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Liên hệ
                            </Link>

                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="px-3 py-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm bài viết..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}