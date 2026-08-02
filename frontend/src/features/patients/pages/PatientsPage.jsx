import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getNavItems } from "@/features/dashboard/config/roles";
import DashboardLayout from "@/features/dashboard/components/DashboardLayout";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { patientsApi } from "../api/patientsApi";
import { PatientTable } from "../components/PatientTable";
import { PatientFormModal } from "../components/PatientFormModal";
import { PatientDetailModal } from "../components/PatientDetailModal";
import { PatientDeleteDialog } from "../components/PatientDeleteDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const PatientsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const params = { page, limit, search };

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["patients", params],
    queryFn: () => patientsApi.getPatients(params),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const { data: patients = [], pagination = {} } = data?.data ?? {};

  const createMutation = useMutation({
    mutationFn: patientsApi.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: payload }) =>
      patientsApi.updatePatient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: patientsApi.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      closeDelete();
    },
  });

  const closeForm = () => {
    setSelected(null);
    setFormOpen(false);
  };

  const closeDetail = () => {
    setSelected(null);
    setDetailOpen(false);
  };

  const closeDelete = () => {
    setSelected(null);
    setDeleteOpen(false);
  };

  const handleOpenCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const handleEdit = (patient) => {
    setSelected(patient);
    setFormOpen(true);
  };

  const handleDetail = (patient) => {
    setSelected(patient);
    setDetailOpen(true);
  };

  const handleDelete = (patient) => {
    setSelected(patient);
    setDeleteOpen(true);
  };

  const handleFormSave = async (payload) => {
    if (selected) {
      await updateMutation.mutateAsync({ id: selected.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleConfirmDelete = async () => {
    if (selected) await deleteMutation.mutateAsync(selected.id);
  };

  const isBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = getNavItems(user?.role);

  const getPageNumbers = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [1];
    if (current > 3) pages.push("ellipsis-1");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (current < total - 2) pages.push("ellipsis-2");
    if (!pages.includes(total)) pages.push(total);

    return pages;
  };

  const pageContent = (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          onClick={handleOpenCreate}
          className="h-10 bg-brand-600 rounded-md hover:bg-brand-700 hover:text-white"
        >
          <Plus className="mr-2 size-4" />
          Tambah Pasien
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(DEFAULT_PAGE);
            }}
            placeholder="Cari Nama / NIK / No. RM..."
            className="h-11 w-full rounded-[10px] border border-line bg-white pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="page-size" className="text-sm text-ink-muted">
            Tampilkan
          </label>
          <select
            id="page-size"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(DEFAULT_PAGE);
            }}
            className="h-11 rounded-[10px] border border-line bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-[10px] border border-danger-200 bg-danger-100 p-3 text-sm text-on-error-container"
        >
          Gagal memuat data pasien. Pastikan backend sudah berjalan lalu coba
          lagi.
        </div>
      )}

      <PatientTable
        patients={patients}
        isLoading={isLoading}
        onDetail={handleDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {pagination.totalPages > 0 && (
        <div className="sm:flex-row text-sm text-ink-muted">
          <span>
            Menampilkan{" "}
            <strong className="font-semibold text-ink">
              {pagination.total}
            </strong>{" "}
            pasien • halaman {pagination.page} dari {pagination.totalPages}
          </span>
          <div className="mt-5">
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      pagination.hasPrev && setPage(pagination.page - 1)
                    }
                    className={
                      !pagination.hasPrev || isFetching
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    text="Sebelumnya"
                  />
                </PaginationItem>

                {getPageNumbers(pagination.page, pagination.totalPages).map(
                  (pageNum, idx) => (
                    <PaginationItem key={idx}>
                      {pageNum === "ellipsis-1" || pageNum === "ellipsis-2" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={pagination.page === pageNum}
                          className="cursor-pointer rounded-2xl"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      pagination.hasNext && setPage(pagination.page + 1)
                    }
                    className={
                      !pagination.hasNext || isFetching
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    text="Berikutnya"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      <PatientFormModal
        isOpen={formOpen}
        onClose={closeForm}
        patient={selected}
        onSave={handleFormSave}
        isLoading={isBusy}
      />

      <PatientDetailModal
        isOpen={detailOpen}
        onClose={closeDetail}
        patient={selected}
      />

      <PatientDeleteDialog
        isOpen={deleteOpen}
        onClose={closeDelete}
        patient={selected}
        onDelete={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );

  return (
    <DashboardLayout onLogout={handleLogout} navItems={navItems}>
      {pageContent}
    </DashboardLayout>
  );
};

export default PatientsPage;
