const Avatar = ({ src, alt, size = 10 }: { src: string, alt: string, size?: number }) => {
    const randomAvatar = () => {
        return "/tile_1.png";
    }
    return (
        <div className={`w-${size} h-${size} bg-primary rounded-full flex items-center justify-center`}>
            <img className='rounded-full object-cover bg-transparent w-full h-full' src={src || randomAvatar()} alt={alt} />
        </div>
    )
}

export default Avatar;