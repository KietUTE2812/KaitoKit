'use client';
import { useLoadingContext } from './LoadingContext';

const useLoading = () => {
    const { setLoading } = useLoadingContext();
    return setLoading;
};

export default useLoading;
