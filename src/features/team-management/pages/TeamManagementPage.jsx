import { useState, useEffect } from "react";
import {
  UserPlus,
  Pencil,
  UserX,
  UserCheck,
  RefreshCw,
} from "lucide-react";

import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";
import StatCard from "@/shared/components/StatCard";
import SearchInput from "@/shared/components/SearchInput";
import Pagination from "@/shared/components/Pagination";
import FilterDropdown from "@/shared/components/FilterDropdown";
import KebabButton from "@/features/team-management/components/KebabButton";

import {
  getInitials,
  getAvatarColor,
  getRoleMeta,
  getStatusBadgeVariant,
  getStatusLabel,
  formatDateAdded,
} from "@/features/team-management/helpers/teamManagementHelpers";

import {
  fetchTeamMembers,
  fetchTeamMemberStats,
  createTeamMember,
  updateTeamMember,
  updateTeamMemberStatus,
} from "@/features/team-management/api/teamManagementApi";

import AddMemberModal from "@/features/team-management/components/AddMemberModal";
import EditMemberModal from "@/features/team-management/components/EditMemberModal";
import ConfirmActionModal from "@/features/team-management/components/ConfirmActionModal";

const PAGE_SIZE = 15;

const STATUS_OPTIONS = [
  { id: "", menuLabel: "All statuses", buttonLabel: "All statuses" },
  { id: "active", menuLabel: "Active", buttonLabel: "Active" },
  { id: "inactive", menuLabel: "Inactive", buttonLabel: "Inactive" },
];

function getMemberName(member) {
  return (
    [member.first_name, member.last_name].filter(Boolean).join(" ") ||
    member.name ||
    member.custom_username ||
    member.username ||
    "N/A"
  );
}

function normalizeMembers(members) {
  return members.map((member) => ({
    id: member.id,
    first_name: member.first_name ?? "",
    last_name: member.last_name ?? "",
    name: getMemberName(member),
    email: member.email,
    avatar: member.avatar,
    role: member.roles?.[0] ?? "member",
    status: member.is_active ? "active" : "inactive",
    dateAdded: member.created_at,
    phone_country_code: member.phone_country_code ?? "",
    phone_number: member.phone_number ?? "",
  }));
}

export default function TeamManagementPage() {
  // Data + list state
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, per_page: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    total_members: 0,
    total_active: 0,
    total_admins: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);
  const [confirmState, setConfirmState] = useState({
    action: null,
    member: null,
  });
  const [confirmSubmitting, setConfirmSubmitting] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  async function loadStats(silent = false) {
    if (!silent) setStatsLoading(true);
    try {
      const { data } = await fetchTeamMemberStats();
      setStats({
        total_members: data?.total_members ?? 0,
        total_active: data?.total_active ?? 0,
        total_admins: data?.total_admins ?? 0,
      });
    } catch {
      // Ignore errors on silent refresh; initial load already reports failures.
    } finally {
      setStatsLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  async function loadMembers(
    pageNumber = page,
    query = appliedSearch,
    status = statusFilter,
  ) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchTeamMembers({
        page: pageNumber,
        search: query,
        status,
      });
      setMembers(normalizeMembers(data.data ?? []));
      setMeta({
        total: data.meta?.total ?? 0,
        last_page: data.meta?.last_page ?? 1,
        per_page: data.meta?.per_page ?? 0,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ?? err.message ?? "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers(page, appliedSearch, statusFilter);
  }, [page, appliedSearch, statusFilter]);

  const resetPage = () => setPage(1);

  const totalCount = meta.total;
  const pageCount = Math.max(1, meta.last_page);
  const loadingSkeletonCount = meta.per_page || PAGE_SIZE;

  // ---- Handlers ----------------------------------------------------------
  async function handleAddMember(form) {
    setAddSubmitting(true);
    setAddError(null);
    try {
      await createTeamMember({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_country_code: form.phone_country_code || null,
        phone_number: form.phone_number || null,
        roles: [form.role],
      });
      setAddOpen(false);
      loadMembers(page, appliedSearch, statusFilter);
      loadStats(true);
    } catch (err) {
      setAddError(
        err.response?.data?.message ?? err.message ?? "Failed to add member",
      );
    } finally {
      setAddSubmitting(false);
    }
  }

  async function handleSaveMember(member, form) {
    setEditSubmitting(true);
    setEditError(null);
    try {
      await updateTeamMember(member.id, {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_country_code: form.phone_country_code || null,
        phone_number: form.phone_number || null,
        roles: [form.role],
      });
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? {
                ...m,
                first_name: form.first_name,
                last_name: form.last_name,
                name: `${form.first_name} ${form.last_name}`.trim(),
                email: form.email,
                phone_country_code: form.phone_country_code,
                phone_number: form.phone_number,
                role: form.role,
              }
            : m,
        ),
      );
      setEditMember(null);
      loadStats(true);
    } catch (err) {
      setEditError(
        err.response?.data?.message ??
          err.message ??
          "Failed to update member",
      );
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleConfirmAction(member, action) {
    const isActive = action === "activate";
    setConfirmSubmitting(true);
    setConfirmError(null);
    try {
      await updateTeamMemberStatus(member.id, isActive);
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? { ...m, status: isActive ? "active" : "inactive" }
            : m,
        ),
      );
      setConfirmState({ action: null, member: null });
      loadStats(true);
    } catch (err) {
      setConfirmError(
        err.response?.data?.message ??
          err.message ??
          "Failed to update member status",
      );
    } finally {
      setConfirmSubmitting(false);
    }
  }

  return (
    <Layout activeNavItem="Team Management">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
          {/* ------------------------------------------------------------- */}
          {/* Header                                                       */}
          {/* ------------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Team Management
            </h1>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 transition-colors w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Stat cards                                                   */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Total Members"
              value={
                statsLoading ? (
                  <span className="h-7 w-20 bg-gray-200 rounded animate-pulse block" />
                ) : (
                  stats.total_members.toLocaleString()
                )
              }
            />
            <StatCard
              label="Active"
              value={
                statsLoading ? (
                  <span className="h-7 w-20 bg-gray-200 rounded animate-pulse block" />
                ) : (
                  stats.total_active.toLocaleString()
                )
              }
            />
            <StatCard
              label="Admins"
              value={
                statsLoading ? (
                  <span className="h-7 w-20 bg-gray-200 rounded animate-pulse block" />
                ) : (
                  stats.total_admins.toLocaleString()
                )
              }
            />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Search + filter bar                                          */}
          {/* ------------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="w-full sm:max-w-xs">
              <SearchInput
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
                placeholder="Search by name or email"
              />
            </div>
            <FilterDropdown
              options={STATUS_OPTIONS}
              selected={statusFilter}
              onSelect={(value) => {
                setStatusFilter(value);
                resetPage();
              }}
            />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Members table                                                */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-400">
                    <th className="px-5 py-3.5 font-medium">Member</th>
                    <th className="px-5 py-3.5 font-medium">Role</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium">Date Added</th>
                    <th className="px-5 py-3.5 font-medium w-12" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: loadingSkeletonCount }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-200 rounded-full shrink-0" />
                            <div className="space-y-1">
                              <div className="h-4 w-28 bg-gray-200 rounded" />
                              <div className="h-3 w-36 bg-gray-200 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="h-5 w-20 bg-gray-200 rounded-full" />
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="h-5 w-16 bg-gray-200 rounded-full" />
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="h-4 w-4 bg-gray-200 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center">
                        <p className="text-sm text-gray-500 mb-3">{error}</p>
                        <button
                          type="button"
                          onClick={() =>
                            loadMembers(page, appliedSearch, statusFilter)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                        >
                          <RefreshCw size={16} />
                          Retry
                        </button>
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center">
                        <p className="text-sm text-gray-500 mb-3">
                          No members match your search or filters.
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            loadMembers(page, appliedSearch, statusFilter)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 text-white text-sm font-medium transition-colors cursor-pointer"
                        >
                          <RefreshCw size={16} />
                          Retry
                        </button>
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => {
                      const roleMeta = getRoleMeta(member.role);
                      return (
                        <tr
                          key={member.id}
                          className="border-b border-slate-50 last:border-0"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3 min-w-0">
                              {member.avatar ? (
                                <img
                                  src={member.avatar}
                                  alt=""
                                  className="w-9 h-9 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <span
                                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${getAvatarColor(
                                    member.name,
                                  )}`}
                                >
                                  {getInitials(member.name)}
                                </span>
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-slate-800 truncate">
                                  {member.name}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge variant={roleMeta.badgeVariant}>
                              {roleMeta.label}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge
                              variant={getStatusBadgeVariant(member.status)}
                            >
                              {getStatusLabel(member.status)}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                            {formatDateAdded(member.dateAdded)}
                          </td>
                          <td className="px-5 py-3.5">
                            <KebabButton
                              items={[
                                {
                                  label: "Edit Member",
                                  icon: <Pencil className="w-4 h-4" />,
                                  onClick: () => {
                                    setEditMember(member);
                                    setEditError(null);
                                  },
                                },
                                member.status === "active"
                                  ? {
                                      label: "Deactivate Member",
                                      icon: <UserX className="w-4 h-4" />,
                                      danger: true,
                                      onClick: () => {
                                        setConfirmState({
                                          action: "deactivate",
                                          member,
                                        });
                                        setConfirmError(null);
                                      },
                                    }
                                  : {
                                      label: "Activate Member",
                                      icon: <UserCheck className="w-4 h-4" />,
                                      onClick: () => {
                                        setConfirmState({
                                          action: "activate",
                                          member,
                                        });
                                        setConfirmError(null);
                                      },
                                    },
                              ]}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Footer pagination                                            */}
          {/* ------------------------------------------------------------- */}
          <Pagination
            showing={members.length}
            total={totalCount}
            page={page}
            pageCount={pageCount}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(pageCount, p + 1))}
          />

          {/* ------------------------------------------------------------- */}
          {/* Modals                                                       */}
          {/* ------------------------------------------------------------- */}
          <AddMemberModal
            open={addOpen}
            onClose={() => {
              setAddOpen(false);
              setAddError(null);
            }}
            onSubmit={handleAddMember}
            submitting={addSubmitting}
            error={addError}
          />

          <EditMemberModal
            key={editMember?.id ?? "none"}
            open={!!editMember}
            member={editMember}
            onClose={() => {
              setEditMember(null);
              setEditError(null);
            }}
            onSubmit={handleSaveMember}
            submitting={editSubmitting}
            error={editError}
          />

          <ConfirmActionModal
            open={!!confirmState.action}
            action={confirmState.action}
            member={confirmState.member}
            onClose={() => {
              setConfirmState({ action: null, member: null });
              setConfirmError(null);
            }}
            onConfirm={handleConfirmAction}
            submitting={confirmSubmitting}
            error={confirmError}
          />
        </div>
      </div>
    </Layout>
  );
}
