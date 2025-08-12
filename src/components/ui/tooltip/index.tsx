export default function Tooltip({ children, content, position = "top" }: { children: React.ReactNode, content: string, position?: "top" | "bottom" | "left" | "right" }) {
    return (
        <div className="relative group">
            {children}
            <div className={`absolute ${position === "top" ? "bottom-full" : position === "bottom" ? "top-full" : position === "left" ? "right-full" : "left-full"} mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity w-max`}>
                {content}
            </div>
        </div>
    );
}