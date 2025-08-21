import Image from "next/image";

const Loading = () => {
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <Image src="/Kit2.png" alt="loading" className="w-12" style={{
            animation: 'flip-around 1s linear infinite',
        }} />
    </div>
}

export default Loading