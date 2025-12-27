"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, BookOpen, ChevronDown, Settings } from "lucide-react";
import { useSessionSync } from "@/lib/SessionContext";
import { imageUrl } from "@/lib/config";

interface ProfileNavbarProps {
    username?: string;
    name?: string;
    avatarUrl?: string;
}

export default function ProfileNavbar({ username: propUsername, name: propName, avatarUrl }: ProfileNavbarProps) {
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [loggedInName, setLoggedInName] = useState<string | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { isSessionSynced } = useSessionSync();

    useEffect(() => {
        const updateUserInfo = () => {
            const storedUsername = localStorage.getItem("webnovelUsername");
            const storedName = localStorage.getItem("webnovelName");
            
            if (storedUsername) {
                setLoggedInUser(storedUsername);
            } else {
                setLoggedInUser(null);
            }

            if (storedName) {
                setLoggedInName(storedName);
            } else {
                setLoggedInName(null);
            }
        };

        updateUserInfo();
        
        window.addEventListener("profileUpdated", updateUserInfo);
        return () => window.removeEventListener("profileUpdated", updateUserInfo);
    }, [isSessionSynced]);

    // Left side identity (profile being viewed); right side account (logged-in user)
    const profileName = propName || propUsername || loggedInName || loggedInUser || "Profile";
    const profileInitial = profileName.charAt(0).toUpperCase();
    const profileHref = propUsername ? `/${propUsername}` : loggedInUser ? `/${loggedInUser}` : "/";

    const accountUsername = loggedInUser;

    const handleLogout = () => {
        try {
            localStorage.removeItem("authToken");
            localStorage.removeItem("webnovelUsername");
        } catch (e) {}

        const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
        const proto = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : "";

        if (APP_DOMAIN) {
            window.location.href = `${proto}//${APP_DOMAIN}${port}/auth/logout`;
        } else {
            window.location.href = "/auth/logout";
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex justify-between items-center">
                    {/* Profile identity */}
                    <Link href={profileHref} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 shadow-lg ring-2 ring-white/70 overflow-hidden flex items-center justify-center text-white font-black text-base group-hover:scale-110 transition-transform relative">
                            {avatarUrl ? (
                                <Image src={imageUrl(avatarUrl) || ""} alt={`${profileName || "User"} avatar`} fill className="object-cover" />
                            ) : (
                                <span>{profileInitial}</span>
                            )}
                        </div>
                        <span className="text-lg sm:text-xl font-black tracking-tight text-gray-900">
                            {profileName}
                        </span>
                    </Link>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        {accountUsername ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                        {accountUsername.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold">{accountUsername}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
                                                const proto = window.location.protocol;
                                                const port = window.location.port ? `:${window.location.port}` : "";

                                                if (APP_DOMAIN) {
                                                    window.location.href = `${proto}//${APP_DOMAIN}${port}/me`;
                                                } else {
                                                    window.location.href = "/me";
                                                }
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-purple-50 transition-colors w-full text-left bg-gradient-to-r from-purple-50/50 to-amber-50/50 border-b border-gray-100"
                                        >
                                            <div className="p-2 rounded-lg bg-linear-to-br from-purple-600 to-amber-500 text-white">
                                                <Settings className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">Profile Settings</p>
                                                <p className="text-xs text-gray-500">Edit your info</p>
                                            </div>
                                        </button>
                                        <Link 
                                            href="/dashboard"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <BookOpen className="w-4 h-4" /> Dashboard
                                        </Link>
                                        <div className="h-px bg-gray-100 my-2"></div>
                                        <button 
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                href="/login"
                                className="px-6 py-2 rounded-full font-bold text-sm bg-purple-600 text-white hover:bg-purple-700 shadow-md transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
