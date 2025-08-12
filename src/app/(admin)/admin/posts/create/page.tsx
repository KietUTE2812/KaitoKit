'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { ArrowLeft, Save, Eye, Upload, X, Plus, Tag, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/api/apiInstance';
import Modal from '@/components/ui/modal';
import MarkdownPreview from '@/components/ui/markdown-preview';
import ImageUpload from '@/components/ui/image-upload';
import ImageGallery from '@/components/ui/image-gallery';
import MarkdownEditor from '@/components/ui/markdown-editor';

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  images: string[]; // Array of additional images
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
}

const categories = [
  'technology', 'programming', 'web-development', 'mobile-development',
  'design', 'business', 'lifestyle', 'tutorial', 'news', 'review'
];

// Sample SEO-optimized data for React Hooks article
const sampleData = {
  title: 'React Hooks Best Practices: Hướng dẫn chi tiết cho Developer 2024',
  slug: 'react-hooks-best-practices-huong-dan-chi-tiet-cho-developer-2024',
  content: '# React Hooks Best Practices: Hướng dẫn chi tiết cho Developer 2024\n\nReact Hooks đã cách mạng hóa cách chúng ta viết React components từ khi được giới thiệu vào năm 2018. Trong bài viết này, chúng ta sẽ khám phá những best practices quan trọng nhất để sử dụng Hooks hiệu quả.\n\n## 1. Hiểu rõ Rules of Hooks\n\n### Không bao giờ gọi Hooks trong:\n- Vòng lặp\n- Điều kiện\n- Nested functions\n- Event handlers\n\n```javascript\n// ❌ Sai\nif (condition) {\n  useEffect(() => {\n    // logic\n  });\n}\n\n// ✅ Đúng\nuseEffect(() => {\n  if (condition) {\n    // logic\n  }\n});\n```\n\n## 2. Sử dụng Custom Hooks hiệu quả\n\nCustom Hooks giúp tái sử dụng logic và làm code dễ đọc hơn:\n\n```javascript\n// useLocalStorage.js\nimport { useState, useEffect } from \'react\';\n\nfunction useLocalStorage(key, initialValue) {\n  const [storedValue, setStoredValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      console.error(error);\n      return initialValue;\n    }\n  });\n\n  const setValue = (value) => {\n    try {\n      setStoredValue(value);\n      window.localStorage.setItem(key, JSON.stringify(value));\n    } catch (error) {\n      console.error(error);\n    }\n  };\n\n  return [storedValue, setValue];\n}\n\nexport default useLocalStorage;\n```\n\n## 3. Tối ưu Performance với useMemo và useCallback\n\n### useMemo cho expensive calculations:\n```javascript\nconst expensiveValue = useMemo(() => {\n  return computeExpensiveValue(a, b);\n}, [a, b]);\n```\n\n### useCallback cho function references:\n```javascript\nconst memoizedCallback = useCallback(() => {\n  doSomething(a, b);\n}, [a, b]);\n```\n\n## 4. Quản lý State hiệu quả\n\n### Sử dụng useReducer cho complex state:\n```javascript\nconst initialState = { count: 0 };\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case \'increment\':\n      return { count: state.count + 1 };\n    case \'decrement\':\n      return { count: state.count - 1 };\n    default:\n      throw new Error();\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(reducer, initialState);\n  \n  return (\n    <div>\n      Count: {state.count}\n      <button onClick={() => dispatch({ type: \'increment\' })}>+</button>\n      <button onClick={() => dispatch({ type: \'decrement\' })}>-</button>\n    </div>\n  );\n}\n```\n\n## 5. Cleanup trong useEffect\n\nLuôn cleanup side effects để tránh memory leaks:\n\n```javascript\nuseEffect(() => {\n  const subscription = someAPI.subscribe();\n  \n  return () => {\n    subscription.unsubscribe();\n  };\n}, []);\n```\n\n## 6. Sử dụng Context API với useContext\n\n```javascript\nconst ThemeContext = createContext();\n\nfunction App() {\n  const [theme, setTheme] = useState(\'light\');\n  \n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      <MainContent />\n    </ThemeContext.Provider>\n  );\n}\n\nfunction ThemedButton() {\n  const { theme, setTheme } = useContext(ThemeContext);\n  \n  return (\n    <button onClick={() => setTheme(theme === \'light\' ? \'dark\' : \'light\')}>\n      Current theme: {theme}\n    </button>\n  );\n}\n```\n\n## 7. Error Boundaries với Hooks\n\n```javascript\nfunction ErrorBoundary({ children }) {\n  const [hasError, setHasError] = useState(false);\n  \n  useEffect(() => {\n    const handleError = (error) => {\n      setHasError(true);\n      console.error(\'Error caught by boundary:\', error);\n    };\n    \n    window.addEventListener(\'error\', handleError);\n    return () => window.removeEventListener(\'error\', handleError);\n  }, []);\n  \n  if (hasError) {\n    return <h1>Something went wrong.</h1>;\n  }\n  \n  return children;\n}\n```\n\n## 8. Testing Hooks\n\nSử dụng @testing-library/react-hooks để test custom hooks:\n\n```javascript\nimport { renderHook, act } from \'@testing-library/react-hooks\';\nimport useCounter from \'./useCounter\';\n\ntest(\'should increment counter\', () => {\n  const { result } = renderHook(() => useCounter());\n  \n  act(() => {\n    result.current.increment();\n  });\n  \n  expect(result.current.count).toBe(1);\n});\n```\n\n## 9. Common Mistakes cần tránh\n\n### 1. Không cleanup subscriptions\n```javascript\n// ❌ Sai\nuseEffect(() => {\n  const subscription = api.subscribe();\n  // Không cleanup\n}, []);\n\n// ✅ Đúng\nuseEffect(() => {\n  const subscription = api.subscribe();\n  return () => subscription.unsubscribe();\n}, []);\n```\n\n### 2. Dependency array không đầy đủ\n```javascript\n// ❌ Sai\nuseEffect(() => {\n  fetchData(userId);\n}, []); // Thiếu userId\n\n// ✅ Đúng\nuseEffect(() => {\n  fetchData(userId);\n}, [userId]);\n```\n\n### 3. Tạo objects/arrays mới trong render\n```javascript\n// ❌ Sai\nfunction Component({ items }) {\n  const sortedItems = items.sort(); // Tạo mới mỗi render\n  \n  return <div>{sortedItems.map(item => <Item key={item.id} />)}</div>;\n}\n\n// ✅ Đúng\nfunction Component({ items }) {\n  const sortedItems = useMemo(() => items.sort(), [items]);\n  \n  return <div>{sortedItems.map(item => <Item key={item.id} />)}</div>;\n}\n```\n\n## 10. Performance Tips\n\n1. **Sử dụng React DevTools Profiler** để identify performance bottlenecks\n2. **Lazy load components** với React.lazy()\n3. **Memoize expensive calculations** với useMemo\n4. **Avoid inline objects/arrays** trong JSX\n5. **Use React.memo()** cho components không cần re-render\n\n## Kết luận\n\nReact Hooks cung cấp một cách mạnh mẽ và linh hoạt để quản lý state và side effects trong functional components. Bằng cách tuân thủ những best practices này, bạn sẽ viết được code React sạch hơn, hiệu quả hơn và dễ maintain hơn.\n\nHãy nhớ rằng practice makes perfect - càng sử dụng Hooks nhiều, bạn càng hiểu rõ cách tối ưu chúng cho từng use case cụ thể.',
  excerpt: 'Khám phá những best practices quan trọng nhất để sử dụng React Hooks hiệu quả trong năm 2024. Hướng dẫn chi tiết từ cơ bản đến nâng cao cho developer.',
  featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  tags: ['react', 'hooks', 'javascript', 'frontend', 'web-development', 'best-practices', 'performance', 'tutorial'],
  category: 'programming',
  status: 'draft' as const,
  isFeatured: true,
  seoTitle: 'React Hooks Best Practices 2024: Hướng dẫn chi tiết cho Developer',
  seoDescription: 'Khám phá những best practices quan trọng nhất để sử dụng React Hooks hiệu quả. Hướng dẫn từ cơ bản đến nâng cao cho developer năm 2024.'
};

export default function CreatePost() {
  const router = useRouter();
  const user = useUserStore((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: sampleData.title,
    slug: sampleData.slug,
    content: sampleData.content,
    excerpt: sampleData.excerpt,
    featuredImage: sampleData.featuredImage,
    images: [], // Initialize empty images array
    tags: sampleData.tags,
    category: sampleData.category,
    status: sampleData.status,
    isFeatured: sampleData.isFeatured,
    seoTitle: sampleData.seoTitle,
    seoDescription: sampleData.seoDescription
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<PostFormData>>({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang admin');
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PostFormData> = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề là bắt buộc';
    if (!formData.content.trim()) newErrors.content = 'Nội dung là bắt buộc';
    if (!formData.category) newErrors.category = 'Danh mục là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim().toLowerCase()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const insertImageToContent = (imageUrl: string, altText: string = '') => {
    const imageMarkdown = `![${altText}](${imageUrl})`;
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = formData.content;
      const newContent = currentContent.substring(0, start) + imageMarkdown + currentContent.substring(end);
      
      handleInputChange('content', newContent);
      
      // Set cursor position after the inserted image
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
      }, 0);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsLoading(true);
    try {
      const postData = { ...formData, status, author: user?._id };
      await api.post('/posts', postData);
      toast.success(status === 'published' ? 'Xuất bản thành công!' : 'Lưu nháp thành công!');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-bg">
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="p-2 text-muted hover:text-text">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-text">Tạo bài viết mới</h1>
              <p className="text-sm text-muted">Viết và xuất bản bài viết mới</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={isLoading}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent/5 disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Lưu nháp
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent/5 transition-colors"
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Xem trước
            </button>
            <button
              onClick={() => handleSubmit('published')}
              disabled={isLoading}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Xuất bản
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex w-3/4 p-10">
          <div className="max-w-6xl mx-auto space-y-6 w-full">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text text-lg ${
                  errors.title ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="bai-viet-moi"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text ${
                  errors.category ? 'border-red-500' : 'border-border'
                }`}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="flex items-center bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Nhập tag và nhấn Enter..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text"
                />
                <button onClick={handleAddTag} className="px-4 py-2 bg-accent/10 text-accent rounded-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Tóm tắt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Tóm tắt ngắn gọn về bài viết..."
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Ảnh đại diện</label>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => handleInputChange('featuredImage', url)}
                placeholder="Upload ảnh đại diện cho bài viết..."
                maxSize={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Thư viện ảnh</label>
              <ImageGallery
                images={formData.images}
                onChange={(images) => handleInputChange('images', images)}
                maxImages={10}
                maxSize={5}
                onInsertImage={insertImageToContent}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <MarkdownEditor
                content={formData.content}
                onChange={(content) => handleInputChange('content', content)}
                placeholder="Viết nội dung bài viết của bạn..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text ${
                  errors.content ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">SEO Title</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                placeholder="Tiêu đề SEO tối ưu..."
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">SEO Description</label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                placeholder="Mô tả SEO tối ưu..."
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-text">
                Bài viết nổi bật
              </label>
            </div>
          </div>
        </div>

        <div className="w-1/4 p-10 border-l border-border bg-card">
          <div className="space-y-6 w-full">
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Xem trước</h3>
              <div className="bg-bg border border-border rounded-lg p-4">
                <h4 className="font-medium text-text mb-2">
                  {formData.title || 'Tiêu đề bài viết'}
                </h4>
                <p className="text-sm text-muted mb-3">
                  {formData.excerpt || 'Tóm tắt bài viết...'}
                </p>
                <div className="text-xs text-muted">
                  <span className="mr-4">Tác giả: {user?.fullName}</span>
                  <span>Ngày: {new Date().toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Thống kê</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Ký tự:</span>
                  <span className="text-text">{formData.content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Từ:</span>
                  <span className="text-text">{formData.content.split(' ').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Tags:</span>
                  <span className="text-text">{formData.tags.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Ảnh đại diện:</span>
                  <span className="text-text">{formData.featuredImage ? 'Có' : 'Chưa có'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Thư viện ảnh:</span>
                  <span className="text-text">{formData.images.length} ảnh</span>
                </div>
              </div>
            </div>
          </div>
                 </div>
       </div>

       {/* Preview Modal */}
       <Modal
         isOpen={showPreview}
         onClose={() => setShowPreview(false)}
         title="Xem trước bài viết"
         size="full"
       >
         <div className="space-y-6">
                       {/* Article Header */}
            <div className="border-b border-border pb-6">
              <h1 className="text-3xl font-bold text-text mb-4">{formData.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-muted mb-4">
                <span>Tác giả: {user?.fullName}</span>
                <span>•</span>
                <span>Ngày: {new Date().toLocaleDateString('vi-VN')}</span>
                <span>•</span>
                <span>Danh mục: {formData.category}</span>
              </div>
              {formData.excerpt && (
                <p className="text-lg text-muted italic mb-4">{formData.excerpt}</p>
              )}
              {formData.featuredImage && (
                <div className="mt-4">
                  <img
                    src={formData.featuredImage}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

           {/* Article Content */}
           <div className="min-h-[500px]">
             <MarkdownPreview content={formData.content} />
           </div>

           {/* Article Footer */}
           <div className="border-t border-border pt-6">
             <div className="flex flex-wrap gap-2">
               {formData.tags.map((tag) => (
                 <span
                   key={tag}
                   className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                 >
                   #{tag}
                 </span>
               ))}
             </div>
           </div>
         </div>
       </Modal>
     </div>
   );
 }
