export default function ConfirmDialog({
    title = "Xác nhận",
    description = "Bạn có chắc chắn muốn thực hiện hành động này không?",
    onConfirm = () => {},
    onCancel = () => {},
    isOpen = false
}: {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
    }) {
    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${isOpen ? "block" : "hidden"}`}>
            <div className="bg-white p-4 rounded-lg w-full max-w-md">
                <h1 className="text-lg font-bold">{title}</h1>
                <p className="text-sm text-gray-500 mb-4">{description}</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md">Hủy</button>
                    <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded-md">Xác nhận</button>
                </div>
            </div>
        </div>
    );
}