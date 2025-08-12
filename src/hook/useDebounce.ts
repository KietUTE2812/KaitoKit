import { useEffect, useState } from "react";

const useDebounce = (callback: () => void, delay: number) => {
    /**
     * @description Debounce the callback (Hàm được gọi sau một khoảng thời gian)
     * @param callback - The callback to debounce
     * @param delay - The delay in milliseconds
     * @returns The debounced callback
     */
    const [debouncedCallback, setDebouncedCallback] = useState(callback);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedCallback(callback), delay);
        return () => clearTimeout(handler);
    }, [callback, delay]);

    return debouncedCallback;
};

export default useDebounce;