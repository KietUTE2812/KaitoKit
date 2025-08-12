import { useEffect } from "react";

export const useOutsideClick = (ref: React.RefObject<HTMLElement | null>, callback: () => void, dependencies: any[]) => {
  /**
   * @param ref - The ref of the element to check if the click is outside of (Nơi mà bạn muốn kiểm tra xem click có nằm ngoài element đó không)
   * @param callback - The callback to call when the click is outside of the element (Hàm callback sẽ được gọi khi click nằm ngoài element)
   * @param dependencies - The dependencies to watch for changes (Các dependencies để watch cho sự thay đổi của ref)
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, callback, ...dependencies]);
};