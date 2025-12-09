"use client";

import { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
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
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, SharedData } from "@/types";
import { TooltipTextCell } from "@/components/tooltip-cell";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dasbor", href: "/dashboard" },
  { title: "SSH", href: "/ssh" },
];

const moduleName = "SSH";
const moduleTitle = "Manajemen SSH";
const moduleSubTitle = "Kelola SSH dan datanya";

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
  indexUrl: string;
  createUrl: string;
}

export default function Index({ items, filters, indexUrl, createUrl }: Props) {
  const [query, setQuery]   = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "");
  const [perPage, setPerPage] = useState<number>(filters.per_page ? Number(filters.per_page) : 10);
  const [_, setPage] = useState(1);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const { auth } = usePage<SharedData>().props;
  const userRoles: string[] = auth.roles || [];

  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      router.get(indexUrl, { search: query, status, page: 1, per_page: perPage }, {
        preserveState: true,
        replace: true,
      });
    }, 300);
    return () => clearTimeout(id);
  }, [query, status, indexUrl]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.get(indexUrl, { search: query, status, page: newPage, per_page: perPage }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
    router.get(indexUrl, { search: query, status, page: 1, per_page: newPerPage }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleEdit = (item: any) => {
    router.visit(item.updateUrl);
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
              <Button onClick={() => router.visit(createUrl)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Button>
              {/* {isSuperadmin(userRoles) && (
              <Button onClick={() => router.visit(createUrl)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Button>
              )} */}
            </div>
          </CardHeader>

          <CardContent>
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari kode komponen atau nama barang/jasa..."
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
                Menampilkan {items.from ?? 0}-{items.to ?? 0} dari {items.total} item
              </p>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/80 hover:bg-muted/80 dark:bg-muted">
                    <TableHead
                      colSpan={2}
                      className="text-center border border-border font-semibold h-12 text-foreground"
                    >
                      Kode Barang / Jasa
                    </TableHead>

                    <TableHead
                      colSpan={2}
                      className="text-center border border-border font-semibold h-12 text-foreground"
                    >
                      Kode Rekening Belanja
                    </TableHead>

                    <TableHead
                      rowSpan={2}
                      className="text-center border border-border font-semibold text-foreground"
                    >
                      Nama Barang/Jasa
                    </TableHead>

                    <TableHead
                      rowSpan={2}
                      className="text-center border border-border font-semibold text-foreground"
                    >
                      Spesifikasi
                    </TableHead>

                    <TableHead
                      rowSpan={2}
                      className="text-center border border-border font-semibold text-foreground"
                    >
                      Satuan
                    </TableHead>

                    <TableHead
                      rowSpan={2}
                      className="text-center border border-border font-semibold text-foreground"
                    >
                      Harga
                    </TableHead>

                    {isSuperadmin(userRoles) && (
                      <TableHead
                        rowSpan={2}
                        className="text-center border border-border font-semibold text-foreground"
                      >
                        Aksi
                      </TableHead>
                    )}
                  </TableRow>

                  <TableRow className="bg-muted/80 hover:bg-muted/80 dark:bg-muted">
                    <TableHead className="text-center border border-border font-semibold h-12 text-foreground">
                      Kode
                    </TableHead>
                    <TableHead className="text-center border border-border font-semibold h-12 text-foreground">
                      Deskripsi
                    </TableHead>

                    <TableHead className="text-center border border-border font-semibold h-12 text-foreground">
                      Kode
                    </TableHead>
                    <TableHead className="text-center border border-border font-semibold h-12 text-foreground">
                      Deskripsi
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-muted-foreground border border-border"
                      >
                        Tidak ada data yang tersedia
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.data.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                      >
                        <TableCell className="border border-border font-medium">
                          {item.itemCode}
                        </TableCell>
                        <TableCell className="border border-border">
                          <TooltipTextCell
                            text={item.itemDescription}
                            maxLength={30}
                          />
                        </TableCell>
                        <TableCell className="border border-border font-medium">
                          {item.accountCode}
                        </TableCell>
                        <TableCell className="border border-border">
                          <TooltipTextCell
                            text={item.accountDescription}
                            maxLength={30}
                          />
                        </TableCell>
                        <TableCell className="border border-border font-medium">
                          <TooltipTextCell
                            text={item.name}
                            maxLength={35}
                          />
                        </TableCell>
                        <TableCell className="border border-border">
                          <TooltipTextCell
                            text={item.specification}
                            maxLength={40}
                          />
                        </TableCell>
                        <TableCell className="border border-border text-center">
                          {item.unitName}
                        </TableCell>
                        <TableCell className="border border-border text-right font-semibold">
                            item.price
                          {/* {formatCurrencySimple(item.price)} */}
                        </TableCell>
                        {isSuperadmin(userRoles) && (
                          <TableCell className="border border-border">
                            <div className="flex justify-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                    className="h-8 w-8 p-0"
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
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Hapus</TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        )}
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
