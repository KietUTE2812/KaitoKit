"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/api/apiInstance";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post("/auth/forgot-password", { email });
            setIsSubmitted(true);
            toast.success("Email đã được gửi thành công!");
        } catch (err: any) {
            console.log(err);
            toast.error(err || "Gửi email thất bại!");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="w-full max-w-md">
                    {/* Success Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Email đã được gửi!</h1>
                        <p className="text-gray-600 mb-6">
                            Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>.
                            Vui lòng kiểm tra hộp thư của bạn.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                            >
                                Gửi lại email
                            </button>

                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center w-full text-blue-600 hover:text-blue-500 transition-colors duration-200"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h1>
                    <p className="text-gray-600">Nhập email để nhận link đặt lại mật khẩu</p>
                </div>

                {/* Forgot Password Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập email của bạn"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Đang gửi...
                                </div>
                            ) : (
                                "Gửi link đặt lại mật khẩu"
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        Không nhận được email? Kiểm tra thư mục spam hoặc{" "}
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-blue-600 hover:text-blue-500"
                        >
                            thử lại
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
} 