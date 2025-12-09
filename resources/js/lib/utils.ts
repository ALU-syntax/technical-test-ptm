import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function normalizePath(input: string) {
    const noQuery = (input ?? "").split("?")[0] ?? "";
    return noQuery.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function canRead(permissions: string[], url: string) {
    // mengikuti Blade: @can('read ' . $mm->url)
    const perm = `read ${normalizePath(url)}`;
    return permissions.includes(perm);
}

export function toHref(url: string) {
    const p = normalizePath(url);
    return p ? `/${p}` : "/";
}

