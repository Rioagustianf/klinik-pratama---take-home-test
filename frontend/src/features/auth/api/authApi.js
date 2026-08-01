import api from "@/lib/axios";

export const authApi = {
  login: (credentials) =>
    api.post("/login", credentials).then((res) => res.data),
};
