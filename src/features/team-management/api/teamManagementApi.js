import { idApi } from "@/services/idApiClient";

export async function fetchTeamMembers({
  page = 1,
  search = "",
  status = "",
} = {}) {
  const { data } = await idApi.get("/admin/team-members", {
    params: {
      page,
      search,
      status,
    },
  });

  return data;
}

export async function fetchTeamMemberStats() {
  const { data } = await idApi.get("/admin/team-members/stats");

  return data;
}

export async function fetchRoles() {
  const { data } = await idApi.get("/admin/roles");

  return data;
}

export async function createRole(payload) {
  const { data } = await idApi.post("/admin/roles", payload);

  return data;
}

export async function updateRole(id, payload) {
  const { data } = await idApi.put(`/admin/roles/${id}`, payload);

  return data;
}

export async function fetchTeamMember(id) {
  const { data } = await idApi.get(`/admin/team-members/${id}`);

  return data;
}

export async function updateTeamMember(id, payload) {
  const { data } = await idApi.put(`/admin/team-members/${id}`, payload);

  return data;
}

export async function createTeamMember(payload) {
  const { data } = await idApi.post("/admin/team-members", payload);

  return data;
}

export async function updateTeamMemberStatus(id, isActive) {
  return updateTeamMember(id, { is_active: isActive });
}
