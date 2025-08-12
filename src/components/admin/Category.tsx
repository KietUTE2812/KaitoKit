"use client";

import { useEffect, useState } from "react";
import api from "@/api/apiInstance";
import { 
    Plus, 
    Edit, 
    Trash2, 
    Search, 
    Filter,
    MoreVertical,
    Calendar,
    Hash,
    FileText,
    X,
    Check,
    AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    postCount?: number;
    createdAt: string;
    updatedAt: string;
}

interface CategoryFormData {
    name: string;
    slug: string;
    description: string;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        slug: "",
        description: ""
    });
    const [formLoading, setFormLoading] = useState(false);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get("/categories");
            setCategories(response || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Không thể tải danh sách danh mục");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .trim();
    };

    // Handle form input changes
    const handleInputChange = (field: keyof CategoryFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            ...(field === 'name' && { slug: generateSlug(value) })
        }));
    };

    // Open create modal
    const openCreateModal = () => {
        setModalMode('create');
        setSelectedCategory(null);
        setFormData({ name: "", slug: "", description: "" });
        setShowModal(true);
    };

    // Open edit modal
    const openEditModal = (category: Category) => {
        setModalMode('edit');
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || ""
        });
        setShowModal(true);
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error("Tên danh mục không được để trống");
            return;
        }

        try {
            setFormLoading(true);
            
            if (modalMode === 'create') {
                await api.post("/categories", formData);
                toast.success("Tạo danh mục thành công!");
            } else {
                await api.put(`/categories/${selectedCategory?._id}`, formData);
                toast.success("Cập nhật danh mục thành công!");
            }
            
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error(modalMode === 'create' ? "Không thể tạo danh mục" : "Không thể cập nhật danh mục");
        } finally {
            setFormLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!selectedCategory) return;
        
        try {
            setDeleteLoading(true);
            await api.delete(`/categories/${selectedCategory._id}`);
            toast.success("Xóa danh mục thành công!");
            setShowDeleteModal(false);
            setSelectedCategory(null);
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Không thể xóa danh mục");
        } finally {
            setDeleteLoading(false);
        }
    };

    // Open delete modal
    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
                            <p className="text-gray-600 mt-1">Quản lý các danh mục bài viết của bạn</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm danh mục
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm danh mục..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Filter className="w-5 h-5" />
                            <span className="text-sm">
                                Hiển thị {filteredCategories.length} / {categories.length} danh mục
                            </span>
                        </div>
                    </div>
                </div>

                {/* Categories List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Đang tải...</span>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? "Không tìm thấy danh mục" : "Chưa có danh mục nào"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Hãy tạo danh mục đầu tiên của bạn"}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={openCreateModal}
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tạo danh mục đầu tiên
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-4 h-4" />
                                                Danh mục
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 font-medium text-gray-900">Slug</th>
                                        <th className="text-left py-4 px-6 font-medium text-gray-900">Mô tả</th>
                                        <th className="text-left py-4 px-6 font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Số bài viết
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 font-medium text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Ngày tạo
                                            </div>
                                        </th>
                                        <th className="text-center py-4 px-6 font-medium text-gray-900">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredCategories.map((category) => (
                                        <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{category.name}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                                                    {category.slug}
                                                </code>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-gray-600 max-w-xs truncate">
                                                    {category.description || "Không có mô tả"}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {category.postCount || 0} bài viết
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 text-sm">
                                                {formatDate(category.createdAt)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(category)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(category)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {modalMode === 'create' ? 'Tạo danh mục mới' : 'Chỉnh sửa danh mục'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên danh mục *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập tên danh mục"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => handleInputChange('slug', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Slug sẽ được tự động tạo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Mô tả ngắn về danh mục"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {formLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            {modalMode === 'create' ? 'Tạo danh mục' : 'Cập nhật'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedCategory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa danh mục</h3>
                                    <p className="text-gray-600 mt-1">
                                        Bạn có chắc chắn muốn xóa danh mục "{selectedCategory.name}" không?
                                    </p>
                                </div>
                            </div>
                            
                            {selectedCategory.postCount && selectedCategory.postCount > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                    <p className="text-yellow-800 text-sm">
                                        ⚠️ Danh mục này có {selectedCategory.postCount} bài viết. 
                                        Việc xóa danh mục có thể ảnh hưởng đến các bài viết này.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {deleteLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Đang xóa...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Xóa danh mục
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;