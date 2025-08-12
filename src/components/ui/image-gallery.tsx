import React, { useState, useRef } from 'react';
import { Plus, X, Image as ImageIcon, Trash2, Eye, Link } from 'lucide-react';
import Modal from './modal';

interface ImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
  onInsertImage?: (imageUrl: string) => void; // Callback to insert image into content
}

export default function ImageGallery({ 
  images, 
  onChange, 
  maxImages = 10,
  maxSize = 5,
  onInsertImage
}: ImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File quá lớn. Kích thước tối đa: ${maxSize}MB`);
      return;
    }

    // Check max images limit
    if (images.length >= maxImages) {
      alert(`Tối đa ${maxImages} ảnh được phép upload`);
      return;
    }

    setIsUploading(true);
    try {
      // Convert to base64 for preview (in real app, upload to cloud storage)
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange([...images, result]);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Có lỗi xảy ra khi upload ảnh');
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const openPreview = (image: string) => {
    setPreviewImage(image);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center space-x-2">
              <button
                onClick={() => openPreview(image)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                title="Xem ảnh"
              >
                <Eye className="w-4 h-4" />
              </button>
              {onInsertImage && (
                <button
                  onClick={() => onInsertImage(image)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                  title="Chèn vào bài viết"
                >
                  <Link className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => removeImage(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="Xóa ảnh"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {/* Upload Button */}
        {images.length < maxImages && (
          <button
            onClick={handleClick}
            disabled={isUploading}
            className={`
              aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-200
              ${isUploading 
                ? 'border-muted bg-muted/10 cursor-not-allowed' 
                : 'border-border hover:border-primary hover:bg-accent/5 cursor-pointer'
              }
            `}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                <p className="text-xs text-muted">Uploading...</p>
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 text-muted mb-2" />
                <p className="text-xs text-muted text-center">Thêm ảnh</p>
              </>
            )}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="text-xs text-muted">
        <p>Đã upload {images.length}/{maxImages} ảnh</p>
        <p>Hỗ trợ: JPG, PNG, GIF (Tối đa {maxSize}MB mỗi ảnh)</p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Image Preview Modal */}
      <Modal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        title="Xem ảnh"
        size="lg"
      >
        {previewImage && (
          <div className="text-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-96 object-contain rounded-lg"
            />
          </div>
        )}
      </Modal>
    </div>
  );
} 