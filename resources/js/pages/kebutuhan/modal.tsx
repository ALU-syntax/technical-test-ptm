"use client";

import type React from "react";
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GenericCombobox, Option } from "@/components/combobox";

interface Props<T = any> {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "edit";
    initialData?: T | null;
    submitUrl: string;
    listCategoryKebutuhan: any[];
}

export function FormModal({ isOpen, onClose, mode, initialData, submitUrl, listCategoryKebutuhan }: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<{
        name: string;
        category_kebutuhan: string;
    }>({
        name: "",
        category_kebutuhan: "",
    });

    const categoryKebutuhanOptions: Option<null>[] = listCategoryKebutuhan.map(r => ({
        value: String(r.id),
        label: r.name,
        meta: null,
    }));

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setData({
                name: initialData.name,
                category_kebutuhan: initialData.category_kebutuhan
            });
        } else if (mode === "create") {
            reset();
        }
    }, [mode, initialData, isOpen, reset, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "create") {
            post(submitUrl, {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else if (mode === "edit" && initialData) {
            put(submitUrl, {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const handleClose = () => {
        onClose();
        reset();
        clearErrors();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Tambah Baru" : "Edit Data"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Tambahkan record baru ke sistem Anda."
                            : "Perbarui informasi di bawah ini."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryKebutuhan">Category Kebutuhan</Label>
                        <GenericCombobox
                            options={categoryKebutuhanOptions}
                            value={data.category_kebutuhan}
                            onChange={v => {
                                setData("category_kebutuhan", v);
                            }}
                            placeholder={categoryKebutuhanOptions.length === 0 ? "Tidak ada Category tersedia" : "Category"}
                            disabled={categoryKebutuhanOptions.length === 0}
                        />
                        {errors.category_kebutuhan && <p className="text-sm text-red-500">{errors.category_kebutuhan}</p>}
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {mode === "create" ? "Simpan" : "Perbarui"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
