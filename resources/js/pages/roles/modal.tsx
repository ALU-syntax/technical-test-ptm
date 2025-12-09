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

interface Props<T = any> {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "edit";
    initialData?: T | null;
    submitUrl: string;
    organizations: any[]
}

const moduleName = "Roles";

export function FormModal({ isOpen, onClose, mode, initialData, submitUrl }: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<{
        name: string;
        status: boolean;
    }>({
        name: "",
        status: true,
    });

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setData({
                name: initialData.name,
                status: initialData.status,
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
                        <Label htmlFor="role_id">Status</Label>
                        <Select value={data.status ? "1" : "0"}
                        onValueChange={(value) => setData("status", value === "1")}>
                            <SelectTrigger >
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="1">Aktif</SelectItem>
                                    <SelectItem value="0">Tidak Aktif</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
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
