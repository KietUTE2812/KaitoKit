"use client";
import { useUserStore } from "@/store/useUserStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    role: string;
}

const LoginSuccess = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const user: User = JSON.parse(searchParams.get("user") || "{}");
    const router = useRouter();
    useEffect(() => {
        if (token && user) {
            localStorage.setItem("token", token);
            useUserStore.setState({ user: user });
            if (user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/profile");
            }
        }
    }, [token, user]);

    return <div>Login Success</div>;
}

export default LoginSuccess;