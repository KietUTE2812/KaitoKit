import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Mock data for featured posts
  const featuredPosts = [
    {
      id: 1,
      title: "Bắt đầu với Next.js 14",
      excerpt: "Hướng dẫn chi tiết cách tạo ứng dụng web hiện đại với Next.js 14 và các tính năng mới nhất.",
      category: "Công nghệ",
      readTime: "5 phút",
      date: "2024-01-15",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "Tips để code sạch hơn",
      excerpt: "Những nguyên tắc và thực hành tốt để viết code dễ đọc, dễ bảo trì và mở rộng.",
      category: "Lập trình",
      readTime: "8 phút",
      date: "2024-01-12",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "React Hooks trong thực tế",
      excerpt: "Cách sử dụng React Hooks hiệu quả trong các dự án thực tế với các ví dụ cụ thể.",
      category: "React",
      readTime: "6 phút",
      date: "2024-01-10",
      image: "/api/placeholder/400/250"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row items-center justify-between gap-5">
          <div className="text-center flex flex-col items-center justify-center w-2/3">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chia sẻ kiến thức
              <br />
              <span className="text-accent">Kết nối cộng đồng</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              Blog chia sẻ những kiến thức, kinh nghiệm và câu chuyện thú vị về công nghệ,
              cuộc sống và những điều tôi học được trên hành trình của mình.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Khám phá bài viết
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-200"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
          <div className="flex justify-center items-center w-1/3">
            <Image className='rounded-lg object-cover bg-transparent' src="/tile_3.png" alt="Logo" width={500} height={500} />
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Bài viết nổi bật
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Những bài viết được chọn lọc với nội dung chất lượng và hữu ích nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">B</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-muted">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3 hover:text-primary transition-colors duration-200">
                    <Link href={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">
                      {new Date(post.date).toLocaleDateString('vi-VN')}
                    </span>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-primary hover:text-secondary font-medium transition-colors duration-200"
                    >
                      Đọc thêm →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
            >
              Xem tất cả bài viết
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
                Về tôi
              </h2>
              <p className="text-lg text-muted mb-6">
                Tôi là một developer đam mê công nghệ và thích chia sẻ kiến thức.
                Blog này được tạo ra với mục đích chia sẻ những gì tôi học được,
                những kinh nghiệm thực tế và những câu chuyện thú vị trong quá trình làm việc.
              </p>
              <p className="text-lg text-muted mb-8">
                Hy vọng những bài viết ở đây sẽ hữu ích cho bạn và giúp bạn
                phát triển kỹ năng lập trình của mình.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
              >
                Tìm hiểu thêm về tôi
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <div className="w-60 h-60 bg-primary rounded-full flex items-center justify-center">
                  <Image className='rounded-full object-cover bg-transparent w-full h-full' src="/tile_7.png" alt="Logo" width={500} height={500} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
