'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Eye, Search, Tag, User } from 'lucide-react';
import api from '@/api/apiInstance';
import useLoading from '@/components/GlobalLoading/useLoading';
import Image from 'next/image';

interface Author {
    id: string;
    name?: string;
    fullName?: string;
    email?: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface PostItem {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    slug: string;
    status: 'published' | 'draft' | 'archived';
    author: Author;
    category?: Category;
    tags?: string[];
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    views?: number;
    likes?: number;
    featuredImage?: string;
}

export default function ReaderPostListPage() {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [query, setQuery] = useState('');
    const setLoading = useLoading();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await api.get('/posts?limit=50');
                const list: PostItem[] = res?.posts || [];
                // Only show published posts for readers
                setPosts(list.filter(p => p.status === 'published'));
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [setLoading]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return posts;
        return posts.filter(p =>
            p.title?.toLowerCase().includes(q) ||
            p.excerpt?.toLowerCase().includes(q) ||
            p.content?.toLowerCase().includes(q) ||
            (p.author?.name || p.author?.fullName || '')?.toLowerCase().includes(q)
        );
    }, [posts, query]);

    return (
        <div className="min-h-screen bg-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-text">Bài viết</h1>
                    <p className="text-muted">Khám phá các bài viết mới nhất</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm kiếm bài viết..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center text-muted py-20">Không có bài viết nào</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(post => (
                            <Link key={post.id} href={`/post/${post.slug}`} className="group">
                                <article className="h-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                    {post.featuredImage && (
                                        <div className="relative w-full h-44 overflow-hidden">
                                            <Image
                                                src={post.featuredImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                                                width={500}
                                                height={500}
                                            />
                                        </div>
                                    )}
                                    <div className="p-4 space-y-3">
                                        <h2 className="text-lg font-semibold text-text line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h2>
                                        {post.excerpt && (
                                            <p className="text-sm text-muted line-clamp-3">{post.excerpt}</p>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-muted">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" />{post.author?.name || post.author?.fullName || 'Ẩn danh'}</span>
                                                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <span className="flex items-center"><Eye className="w-3.5 h-3.5 mr-1" />{post.views || 0}</span>
                                        </div>
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {post.tags.slice(0, 3).map((t, i) => (
                                                    <span key={i} className="inline-flex items-center px-2 py-0.5 text-[11px] rounded-full bg-accent/20 text-muted">
                                                        <Tag className="w-3 h-3 mr-1" />{t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


