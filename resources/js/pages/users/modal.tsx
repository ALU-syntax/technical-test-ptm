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
import { GenericCombobox, Option } from "@/components/combobox";

interface Props<T = any> {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: T | null;
  submitUrl: string;
  roles: any[]
  organizations: any[]
}

const moduleName = "User";

export function FormModal({ isOpen, onClose, mode, initialData, submitUrl, roles }: Props) {
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<{
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role_id: string;
    organization_id: string;
  }>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    organization_id: ""
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setData({
        name: initialData.name,
        email: initialData.email,
        password: initialData.password,
        password_confirmation: initialData.password_confirmation,
        role_id: initialData.role_id,
        organization_id: initialData.organization_id,
      });
    } else if (mode === "create") {
      reset();
    }
  }, [mode, initialData, isOpen, reset, setData]);

  const roleOptions: Option<null>[] = roles.map(r => ({
    value: String(r.id),
    label: r.name,
    meta: null,
  }));

//   const organizationOptions: Option<null>[] = organizations.map(r => ({
//     value: String(r.id),
//     label: r.name,
//     meta: null,
//   }));

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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              className={errors.password_confirmation ? "border-red-500" : ""}
            />
            {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role_id">Role</Label>
            <GenericCombobox
              options={roleOptions}
              value={data.role_id}
              onChange={v => {
                setData("role_id", v);
              }}
              placeholder={roles.length === 0 ? "Tidak ada role tersedia" : "Role"}
              disabled={roles.length === 0}
            />
            {errors.role_id && <p className="text-sm text-red-500">{errors.role_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization_id">Organization</Label>
            <GenericCombobox
              options={[]}
              value={data.organization_id}
              onChange={v => {
                setData("organization_id", v);
              }}
            //   placeholder={organizations.length === 0 ? "Tidak ada SKPD tersedia" : "SKPD"}
            //   disabled={organizations.length === 0}
            />
            {errors.organization_id && <p className="text-sm text-red-500">{errors.organization_id}</p>}
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
