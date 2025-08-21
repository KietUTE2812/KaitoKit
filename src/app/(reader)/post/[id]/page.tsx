'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Eye, Facebook, Heart, Linkedin, MessageCircle, Share, Tag, ThumbsUp, Twitter, User } from 'lucide-react';
import { ThumbsDown } from 'lucide-react';
import api from '@/api/apiInstance';
import useLoading from '@/components/GlobalLoading/useLoading';
import MarkdownPreview from '@/components/ui/markdown-preview';
import Comments from '@/components/Comments';
import Image from 'next/image';
import Avatar from '@/components/ui/avatar';
import Link from 'next/link';

interface Author {
    id: string;
    name?: string;
    fullName?: string;
    email?: string;
    avatar?: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface PostDetail {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    slug: string;
    status: 'published' | 'draft' | 'archived';
    author: Author;
    category?: Category | string;
    tags?: string[];
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    views?: number;
    likes?: number;
    dislikes?: number;
    featuredImage?: string;
}

export default function ReaderPostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [post, setPost] = useState<PostDetail | null>(null);
    const setLoading = useLoading();

    useEffect(() => {
        if (!id) return;
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/posts/${id}`);
                setPost(res?.post || null);
            } catch (err) {
                setPost(null);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, setLoading]);

    if (!post) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="text-center text-muted">Đang tải bài viết...</div>
            </div>
        );
    }

    const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
        const url = window.location.href;
        if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?url=${url}`, '_blank');
        } else if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}`, '_blank');
        }
    }

    const authorName = post.author?.name || post.author?.fullName || 'Ẩn danh';
    const categoryName = typeof post.category === 'string' ? post.category : post.category?.name;

    const handleLike = () => {
        console.log('like');
    }

    const handleDislike = () => {
        console.log('dislike');
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Share Sticky */}
            <div className="fixed top-[20%] left-[calc(50%-325px-14vw)] lg:block hidden w-24 h-full bg-transparent">
                <div className="p-4 flex flex-col items-center gap-3">
                    {/* Like and dislike
                    <div className="flex flex-col items-center gap-2">
                        <button className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40" onClick={() => handleLike()}>
                            <ThumbsUp className="w-5 h-5 text-blue-500" />
                            <span className="text-sm text-muted">{post.likes || 0}</span>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/40" onClick={() => handleDislike()}>
                            <ThumbsDown className="w-5 h-5 text-blue-500" />
                            <span className="text-sm text-muted">{post.dislikes || 0}</span>
                        </button>
                    </div> */}
                    <div className="w-16 h-16 relative">
                        <Image src={post.author?.avatar || '/Kit2.png'} alt={post.author?.name || ''} fill className="rounded-full object-cover" />
                    </div>
                    <div className="text-sm text-muted text-wrap line-clamp-2">{post.author?.fullName || 'Ẩn danh'}</div>
                    <div className="flex flex-col items-center gap-2">
                        <Link href={`#comment`} className="w-5 h-5 text-blue-500 cursor-pointer"><MessageCircle className="w-5 h-5 text-blue-500 cursor-pointer" /></Link>
                        <div className="w-px h-4 bg-border" />
                        <Facebook className="w-5 h-5 text-blue-500 cursor-pointer" onClick={() => handleShare('facebook')} />
                        <Twitter className="w-5 h-5 text-blue-500 cursor-pointer" onClick={() => handleShare('twitter')} />
                        <Linkedin className="w-5 h-5 text-blue-500 cursor-pointer" onClick={() => handleShare('linkedin')} />
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-card border-b border-border">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-2 hover:bg-accent/20 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-text">{post.title}</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted">
                        <span className="flex items-center"><User className="w-4 h-4 mr-1" />{authorName}</span>
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span className="flex items-center"><Eye className="w-4 h-4 mr-1" />{post.views || 0} lượt xem</span>
                        {categoryName && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent/20">{categoryName}</span>
                        )}
                        {/* Divider */}
                        <div className="w-px h-4 bg-border" />
                        {/* Social Share */}
                        <div className="flex items-center gap-2">
                            <Facebook className="w-5 h-5 text-blue-500 cursor-pointer" onClick={() => handleShare('facebook')} />
                            <Twitter className="w-5 h-5 text-blue-500 cursor-pointer" onClick={() => handleShare('twitter')} />
                            <Linkedin className="w-5 h-5 text-blue-500 cursor-pointer" onClick={() => handleShare('linkedin')} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {post.featuredImage && (
                    <div className="mb-8">
                        <Image src={post.featuredImage} alt={post.title} className="w-full max-h-[300px] rounded-xl border border-border object-cover" width={500} height={500} />
                    </div>
                )}

                <MarkdownPreview content={post.content} />

                {post.tags && post.tags.length > 0 && (
                    <div className="mt-10">
                        <div className="text-sm font-semibold text-text mb-2">Tags</div>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center px-3 py-1 bg-accent/20 rounded-full text-sm text-muted">
                                    <Tag className="w-3.5 h-3.5 mr-1" />{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Comment */}
            <section id="comment" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-xl font-bold text-text mb-2">Bình luận</div>
                <Comments postId={post.id} />
            </section>
        </div>
    );
}


