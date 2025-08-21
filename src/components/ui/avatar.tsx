import Image from "next/image";

const Avatar = ({ src, alt, size = 10 }: { src: string; alt: string; size?: number }) => {
    const randomAvatar = () => "/tile_1.png";

    return (
        <div className={`relative w-${size} h-${size} bg-primary rounded-full overflow-hidden`}>
            <Image
                src={src || randomAvatar()}
                alt={alt || "avatar"}
                fill
                className="object-cover"
            />
        </div>
    );
};

export default Avatar;
