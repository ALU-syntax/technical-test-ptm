import * as React from "react";
import { Link, usePage } from "@inertiajs/react";
import { dashboard } from "@/routes";

import { NavFooter } from "@/components/nav-footer";
import { NavUser } from "@/components/nav-user";
import { NavMain } from '@/components/nav-main';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { type NavItem } from '@/types';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ChevronDown, LayoutGrid, BookOpen, Folder } from "lucide-react";
import AppLogo from "./app-logo";

type SubMenu = {
    name: string;
    url: string; // "users" atau "/users"
};

type MenuItem = {
    name: string;
    url: string; // "master/users" atau "/master/users"
    icon?: string; // opsional (kalau kamu masih simpan "fa-xxx", boleh diabaikan)
    subMenus?: SubMenu[];
};

type MenusByCategory = Record<string, MenuItem[]>;

type PageProps = {
    auth: {
        permissions?: string[];
    };
    menus?: MenusByCategory;
};

function normalizePath(input: string) {
    const noQuery = (input ?? "").split("?")[0] ?? "";
    return noQuery.replace(/^\/+/, "").replace(/\/+$/, "");
}

function toHref(url: string) {
    const p = normalizePath(url);
    return p ? `/${p}` : "/";
}

function isActive(currentUrl: string, targetUrl: string) {
    const cur = normalizePath(currentUrl);
    const target = normalizePath(targetUrl);
    if (!target) return false;
    // mirip str_contains(request()->path(), $mm->url)
    return cur.includes(target);
}

function canRead(permissions: string[], url: string) {
    // mengikuti Blade: @can('read ' . $mm->url)
    const perm = `read ${normalizePath(url)}`;
    return permissions.includes(perm);
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

export function AppSidebar() {
    const page = usePage<PageProps>();
    const currentUrl = page.url; // "/dashboard?x=y"
    const permissions = page.props.auth?.permissions ?? [];
    const menus = page.props.menus ?? {};

    const visibleMenus = React.useMemo(() => {
        const out: MenusByCategory = {};

        for (const [category, items] of Object.entries(menus)) {
            // mirip logic Blade: showCategory hanya muncul kalau ada minimal 1 menu yang lolos permission
            const allowed = items
                .filter((m) => canRead(permissions, m.url))
                .map((m) => ({
                    ...m,
                    subMenus: (m.subMenus ?? []).filter((sm) => canRead(permissions, sm.url)),
                }))
                // kalau punya submenu, pastikan ada isi setelah difilter permission
                .filter((m) => (m.subMenus?.length ? m.subMenus.length > 0 : true));

            if (allowed.length) out[category] = allowed;
        }

        return out;
    }, [menus, permissions]);

    // Object.entries(visibleMenus).forEach(function([category, items]){
    //     console.log(category);
    //     console.log(items);
    // });

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* HEADER / LOGO */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent>
                <NavMain items={mainNavItems} />
                {/* <SidebarMenu>
          Dashboard (static)
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(currentUrl, "dashboard")}>
              <Link href={dashboard()} prefetch>
                <LayoutGrid className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}

                {/* Dynamic categories + menus */}
                {Object.entries(visibleMenus).map(([category, items]) => (
                    <div key={category} className="mt-3">
                        {/* Category title */}
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                            {category}
                        </div>

                        <SidebarMenu className="px-2 py-0">
                            {items.map((m) => {
                                const hasChildren = (m.sub_menus?.length ?? 0) > 0;

                                const openByDefault =
                                    isActive(currentUrl, m.url) ||
                                    (m.sub_menus ?? []).some((sm) => isActive(currentUrl, sm.url));

                                if (!hasChildren) {
                                    return (
                                        <SidebarMenuItem key={m.url}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive(currentUrl, m.url)}
                                            >
                                                <Link href={toHref(m.url)}>
                                                    {/* kalau kamu mau icon lucide dari DB, nanti kita mapping di sini */}
                                                    <LayoutGrid className="h-4 w-4" />
                                                    <span>{m.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                }

                                return (
                                    <Collapsible key={m.url} defaultOpen={openByDefault}>
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton isActive={openByDefault}>
                                                    <LayoutGrid className="h-4 w-4" />
                                                    <span className="flex-1">{m.name}</span>
                                                    <ChevronDown className="h-4 w-4 opacity-70" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent>
                                                <div className="ml-3 mt-1 border-l pl-3">
                                                    <SidebarMenu>
                                                        {(m.sub_menus ?? []).map((sm) => (
                                                            <SidebarMenuItem key={sm.url}>
                                                                <SidebarMenuButton
                                                                    asChild
                                                                    size="sm"
                                                                    isActive={isActive(currentUrl, sm.url)}
                                                                >
                                                                    <Link href={toHref(sm.url)}>
                                                                        <span>{sm.name}</span>
                                                                    </Link>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                        ))}
                                                    </SidebarMenu>
                                                </div>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            })}
                        </SidebarMenu>
                    </div>
                ))}
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter>
                {/* footer bawaan tetap */}
                <NavFooter
                    items={[
                        {
                            title: "Repository",
                            href: "https://github.com/laravel/react-starter-kit",
                            icon: Folder,
                        },
                        {
                            title: "Documentation",
                            href: "https://laravel.com/docs/starter-kits#react",
                            icon: BookOpen,
                        },
                    ]}
                    className="mt-auto"
                />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
