'use client';
import React, { createContext, useContext, useState } from 'react';
import { Loader2 } from 'lucide-react';


const LoadingContext = createContext<{ loading: boolean, setLoading: (loading: boolean) => void }>({ loading: false, setLoading: () => { } });

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}

            {loading && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                    <img src="/Kit2.png" alt="loading" className="w-12" style={{
                        animation: 'flip-around 1s linear infinite',
                    }} />
                </div>
            )}
        </LoadingContext.Provider>
    );
};

export const useLoadingContext = () => useContext(LoadingContext);