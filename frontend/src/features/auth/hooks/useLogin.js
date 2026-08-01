import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "../api/authApi";

const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      login(data.user, data.token);
      navigate("/dashboard", { replace: true });
    },
  });

  return {
    ...mutation,
    login: mutation.mutate,
  };
};

export default useLogin;
