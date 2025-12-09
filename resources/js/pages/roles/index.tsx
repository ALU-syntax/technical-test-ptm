"use client";

import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FormModal } from "./modal";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Roles", href: "/roles" },
];

const moduleName = "Roles";
const moduleTitle = "Manajemen Roles";
const moduleSubTitle = "Kelola Role dan datanya";

interface PaginationData<T = any> {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  data: T[];
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

interface Props {
  items: PaginationData;
  filters: { search?: string; status?: string, per_page?: string };
  createUrl: string;
  roles: any[];
  organizations: any[];
}

export default function Index({ items, filters, createUrl, roles, organizations }: Props) {
  const [query, setQuery]   = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen]     = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [perPage, setPerPage] = useState<number>(filters.per_page ? Number(filters.per_page) : 10);
  const [_, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      router.get(createUrl, { search: query, status, page: 1, per_page: perPage }, {
        preserveState: true,
        replace: true,
      });
    }, 300);
    return () => clearTimeout(id);
  }, [query, status, createUrl]);

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedItem) return;
    router.delete(selectedItem.destroyUrl, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedItem(null);
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.get(createUrl, { search: query, status, page: newPage, per_page: perPage }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
    router.get(createUrl, { search: query, status, page: 1, per_page: newPerPage }, {
      preserveState: true,
      replace: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={moduleName} />

      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">{moduleTitle}</CardTitle>
                <CardDescription>{moduleSubTitle}</CardDescription>
              </div>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari data..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={String(perPage)}
                onValueChange={(v) => handlePerPageChange(Number(v))}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Per Halaman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="25">25 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Menampilkan {items.from ?? 0}-{items.to ?? 0} dari {items.total} item · {items.per_page} / halaman
              </p>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        Tidak ada data yang tersedia
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="font-medium">{item.status == "1" ? "Aktif" : "Tidak Aktif"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(item)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Ubah</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(item)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Hapus</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {items.last_page > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  Halaman {items.current_page} dari {items.last_page}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(items.current_page - 1)}
                    disabled={items.current_page === 1}
                    className="w-full sm:w-auto"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Sebelumnya
                  </Button>

                  <div className="flex gap-1 overflow-x-auto max-w-full sm:overflow-visible px-1">
                    {Array.from({ length: Math.min(5, items.last_page) }, (_, i) => {
                      const pageNum = Math.max(1, items.current_page - 2) + i;
                      if (pageNum <= items.last_page) {
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === items.current_page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="min-w-[40px] px-2"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(items.current_page + 1)}
                    disabled={items.current_page === items.last_page}
                    className="w-full sm:w-auto"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        mode="create"
        submitUrl={createUrl}
        organizations={organizations}
      />

      <FormModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false); setSelectedItem(null);
        }}
        mode="edit"
        initialData={selectedItem}
        submitUrl={selectedItem?.updateUrl || ""}
        organizations={organizations}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={() => {
          confirmDelete()
        }}
      />
    </AppLayout>
  );
}
