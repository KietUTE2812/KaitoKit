import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <div className="flex flex-row w-1/3 md:w-1/6 items-center justify-center gap-4 p-4 bg-primary rounded-full animate-[bounce_1s_ease-in-out_infinite]">
                <Image src="/tile_7.png" alt="404" className="rounded-full" width={500} height={500} />
            </div>
            <div className="flex flex-col items-center justify-center gap-4 text-center md:text-left">
                <h1 className="text-4xl font-bold">404 - Không tìm thấy trang</h1>
                <p className="text-lg">Trang bạn đang tìm kiếm không tồn tại.</p>
                <Link href="/" className="text-blue-500 hover:text-blue-700">Quay lại trang chủ</Link>
            </div>
        </div>
    )
}