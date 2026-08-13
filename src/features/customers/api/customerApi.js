import { idApi } from "@/services/idApiClient";

export async function fetchCustomers({
  page = 1,
  search = "",
  status = "",
} = {}) {
  const { data } = await idApi.get("/admin/customers", {
    params: {
      page,
      search,
      status,
    },
  });

  return data;
}

export async function fetchCustomerStats() {
  const { data } = await idApi.get("/admin/customers/stats");

  return data;
}

export async function fetchCustomerDetail(id) {
  const { data } = await idApi.get(`/admin/customers/${id}`);

  return data;
}

export async function toggleCustomerStatus(id, isActive) {
  const { data } = await idApi.put(`/admin/customers/${id}`, {
    is_active: isActive,
  });

  return data;
}
