"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu, Users, HelpCircle, Image as ImageIcon,
    LayoutDashboard, List, Settings,
    PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Item = { href: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> };

const items: Item[] = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/questions", label: "Questions", icon: HelpCircle },
    { href: "/admin/avatars", label: "Avatars", icon: ImageIcon },
    { href: "/admin/categories", label: "Categories", icon: List },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

const K_WIDTH = "qm.sidebar.width";
const K_COLLAPSED = "qm.sidebar.collapsed";

const MIN_W = 180;
const MAX_W = 420;
const RAIL_W = 72;
const FULL_W = 256;

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [width, setWidth] = useState(FULL_W);
    const [mobileOpen, setMobileOpen] = useState(false);
    const resizingRef = useRef(false);

    // Load saved state
    useEffect(() => {
        const savedW = Number(localStorage.getItem(K_WIDTH));
        const savedC = localStorage.getItem(K_COLLAPSED);
        if (!Number.isNaN(savedW) && savedW >= MIN_W && savedW <= MAX_W) setWidth(savedW);
        if (savedC === "1") setCollapsed(true);
    }, []);

    // Sync CSS var
    useEffect(() => {
        const w = collapsed ? RAIL_W : width;
        document.documentElement.style.setProperty("--sbw", `${w}px`);
    }, [collapsed, width]);

    // Persist
    useEffect(() => {
        localStorage.setItem(K_COLLAPSED, collapsed ? "1" : "0");
    }, [collapsed]);
    useEffect(() => {
        if (!collapsed) localStorage.setItem(K_WIDTH, String(width));
    }, [width, collapsed]);

    // Global resize handlers
    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            if (!resizingRef.current || collapsed) return;
            const next = Math.min(MAX_W, Math.max(MIN_W, e.clientX));
            setWidth(next);
        };
        const onUp = () => {
            resizingRef.current = false;
            document.body.style.userSelect = "";
        };
        window.addEventListener("pointermove", onMove, true);
        window.addEventListener("pointerup", onUp, true);
        window.addEventListener("pointercancel", onUp, true);
        return () => {
            window.removeEventListener("pointermove", onMove, true);
            window.removeEventListener("pointerup", onUp, true);
            window.removeEventListener("pointercancel", onUp, true);
        };
    }, [collapsed]);

    const startResize = useCallback(() => {
        if (collapsed) return;
        resizingRef.current = true;
        document.body.style.userSelect = "none";
    }, [collapsed]);

    const toggleCollapsed = useCallback(() => setCollapsed(c => !c), []);

    const isActive = useCallback((href: string) => {
        return pathname === href || pathname.startsWith(href + "/");
    }, [pathname]);

    const Brand = useMemo(() => (
        <Link href="/admin" className="text-lg font-extrabold tracking-tight text-gray-900">
            Quiz<span className="text-indigo-600">Master</span> • Admin
        </Link>
    ), []);

    return (
        <>
            {/* Mobile bar */}
            <div className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
                <div className="h-14 px-4 flex items-center justify-between">
                    {Brand}
                    <button
                        aria-label="Toggle navigation"
                        className="p-2 rounded-lg border border-gray-200"
                        onClick={() => setMobileOpen(v => !v)}
                    >
                        <Menu size={18} />
                    </button>
                </div>
                {mobileOpen && (
                    <nav className="px-2 pb-2 grid gap-1 bg-white">
                        {items.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive(href) ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>

            {/* Desktop sidebar */}
            <aside
                className={`hidden md:flex md:fixed md:inset-y-0 md:left-0 sidebar ${collapsed ? "collapsed" : ""}`}
                aria-label="Sidebar"
                style={{ width: collapsed ? RAIL_W : width, pointerEvents: "auto" }}
            >
                <div className="relative flex h-full w-full flex-col border-r border-gray-200 bg-white/80 backdrop-blur">
                    {/* Header */}
                    <div className="h-16 px-3 flex items-center justify-between border-b border-gray-200">
                        {!collapsed ? <div className="pl-2">{Brand}</div> : <div className="pl-2 text-sm font-bold">QM</div>}
                        <button
                            onClick={toggleCollapsed}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100"
                        >
                            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="p-3 space-y-1">
                        {items.map(({ href, label, icon: Icon }) => {
                            const active = isActive(href);
                            const base = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition";
                            const cls = active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
                            return (
                                <Link key={href} href={href} className={`${base} ${cls}`}>
                                    <Icon size={18} className={active ? "text-indigo-600" : "text-gray-500"} />
                                    {!collapsed && <span className="truncate">{label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto p-4 text-[11px] text-gray-500">
                        © {new Date().getFullYear()} QuizMaster Admin
                    </div>

                    {/* Resizer */}
                    {!collapsed && (
                        <div
                            role="separator"
                            aria-orientation="vertical"
                            className="resizer"
                            title="Drag to resize"
                            onPointerDown={startResize}
                        />
                    )}
                </div>
            </aside>
        </>
    );
}
