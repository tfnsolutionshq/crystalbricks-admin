import { useMemo, useState } from "react";
import { UserPlus, Pencil, UserX, UserCheck, Trash2 } from "lucide-react";

import Layout from "@/shared/components/Layout";
import Badge from "@/shared/components/Badge";
import FilterPill from "@/shared/components/FilterPill";
import SearchInput from "@/shared/components/SearchInput";
import Pagination from "@/shared/components/Pagination";
import KebabButton from "@/shared/components/KebabButton";

import {
  teamMembers,
  TEAM_ROLES,
  teamPagination,
} from "@/features/team-management/mocks/teamManagementMockData";

import {
  getInitials,
  getAvatarColor,
  getRoleMeta,
  getStatusBadgeVariant,
  getStatusLabel,
  formatDateAdded,
  filterMembers,
} from "@/features/team-management/helpers/teamManagementHelpers";

import AddMemberModal from "@/features/team-management/components/AddMemberModal";
import EditRoleModal from "@/features/team-management/components/EditRoleModal";
import ConfirmActionModal from "@/features/team-management/components/ConfirmActionModal";

export default function TeamManagementPage() {
  // Data + list state
  const [members, setMembers] = useState(teamMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(teamPagination.page);

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [confirmState, setConfirmState] = useState({
    action: null,
    member: null,
  });

  const filtered = useMemo(
    () =>
      filterMembers(members, {
        search,
        role: roleFilter,
        status: statusFilter,
      }),
    [members, search, roleFilter, statusFilter],
  );

  // ---- Handlers ----------------------------------------------------------
  function handleAddMember(form) {
    const newMember = {
      id: `TM-${String(members.length + 1).padStart(3, "0")}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      status: "active",
      dateAdded: new Date().toISOString().slice(0, 10),
    };
    setMembers((prev) => [newMember, ...prev]);
    setAddOpen(false);
  }

  function handleSaveRole(member, newRole) {
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m)),
    );
    setEditMember(null);
  }

  function handleConfirmAction(member, action) {
    if (action === "remove") {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    } else {
      const nextStatus = action === "activate" ? "active" : "inactive";
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, status: nextStatus } : m,
        ),
      );
    }
    setConfirmState({ action: null, member: null });
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
          {/* Search + filter bar                                          */}
          {/* ------------------------------------------------------------- */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full sm:max-w-xs"
            />
            <div className="flex flex-wrap items-center gap-3">
              <FilterPill
                label="Role"
                value={
                  roleFilter === "all" ? "All" : getRoleMeta(roleFilter).label
                }
                onClick={() => {
                  const roles = ["all", ...TEAM_ROLES.map((r) => r.value)];
                  const next =
                    roles[(roles.indexOf(roleFilter) + 1) % roles.length];
                  setRoleFilter(next);
                }}
              />
              <FilterPill
                label="Status"
                value={
                  statusFilter === "all" ? "All" : getStatusLabel(statusFilter)
                }
                onClick={() => {
                  const options = ["all", "active", "inactive"];
                  const next =
                    options[
                      (options.indexOf(statusFilter) + 1) % options.length
                    ];
                  setStatusFilter(next);
                }}
              />
            </div>
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
                  {filtered.map((member) => {
                    const roleMeta = getRoleMeta(member.role);
                    const isActive = member.status === "active";
                    return (
                      <tr
                        key={member.id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${getAvatarColor(
                                member.name,
                              )}`}
                            >
                              {getInitials(member.name)}
                            </span>
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
                          <Badge variant={getStatusBadgeVariant(member.status)}>
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
                                label: "Edit Role",
                                icon: <Pencil className="w-4 h-4" />,
                                onClick: () => setEditMember(member),
                              },
                              isActive
                                ? {
                                    label: "Deactivate",
                                    icon: <UserX className="w-4 h-4" />,
                                    danger: true,
                                    onClick: () =>
                                      setConfirmState({
                                        action: "deactivate",
                                        member,
                                      }),
                                  }
                                : {
                                    label: "Activate",
                                    icon: <UserCheck className="w-4 h-4" />,
                                    onClick: () =>
                                      setConfirmState({
                                        action: "activate",
                                        member,
                                      }),
                                  },
                              {
                                label: "Remove",
                                icon: <Trash2 className="w-4 h-4" />,
                                danger: true,
                                onClick: () =>
                                  setConfirmState({ action: "remove", member }),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-slate-400"
                      >
                        No members match your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Footer pagination                                            */}
          {/* ------------------------------------------------------------- */}
          <Pagination
            showing={teamPagination.showing}
            total={teamPagination.total}
            page={page}
            pages={teamPagination.pages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(teamPagination.pages, p + 1))}
          />

          {/* ------------------------------------------------------------- */}
          {/* Modals                                                       */}
          {/* ------------------------------------------------------------- */}
          <AddMemberModal
            open={addOpen}
            onClose={() => setAddOpen(false)}
            onSubmit={handleAddMember}
          />

          <EditRoleModal
            open={!!editMember}
            member={editMember}
            onClose={() => setEditMember(null)}
            onSubmit={handleSaveRole}
          />

          <ConfirmActionModal
            open={!!confirmState.action}
            action={confirmState.action}
            member={confirmState.member}
            onClose={() => setConfirmState({ action: null, member: null })}
            onConfirm={handleConfirmAction}
          />
        </div>
      </div>
    </Layout>
  );
}
