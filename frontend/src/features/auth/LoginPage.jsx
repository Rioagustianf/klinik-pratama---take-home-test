import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import bgImage from "@/assets/bg-image.jpeg";
import useLogin from "./hooks/useLogin";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

const BRAND_NAME = "KLINIK PRATAMA";
const BRAND_TAGLINE = "Sistem Informasi";
const BRAND_IMAGE_URL = bgImage;

const BrandPanel = () => {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="hidden lg:flex lg:w-[50%] relative items-center justify-center overflow-hidden bg-brand-600">
      {imgOk ? (
        <img
          src={BRAND_IMAGE_URL}
          alt=""
          aria-hidden="true"
          loading="eager"
          onError={() => setImgOk(false)}
          className="absolute inset-0 w-full h-full object-cover opacity-[0.82]"
        />
      ) : null}
      <div className="absolute inset-0 bg-linear-to-t from-brand-600/90 via-brand-600/40 to-transparent" />

      <div className="relative z-10 text-center w-full px-12">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          {BRAND_TAGLINE}
        </p>
        <h1 className="text-[64px] font-bold leading-none tracking-[-0.03em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          {BRAND_NAME}
        </h1>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  id,
  error,
  icon: Icon,
  type,
  placeholder,
  register,
  children,
}) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-4.5 h-4.5 text-ink-muted" />
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`pl-10 ${children ? "pr-10" : ""} ${error ? "border-danger-500 ring-1 ring-danger-500" : ""}`}
        {...register}
      />
      {children}
    </div>
    {error && <p className="text-xs font-medium text-danger-500">{error}</p>}
  </div>
);

const ErrorBanner = ({ message }) => (
  <div
    role="alert"
    className="flex items-center gap-2 p-3 bg-danger-100 border-l-4 border-danger-500 rounded-r text-danger-700 animate-login-rise"
  >
    <AlertTriangle className="w-5 h-5 text-danger-500 shrink-0" />
    <span className="text-sm font-normal leading-5">{message}</span>
  </div>
);

const LoginPage = () => {
  const { login, isPending, error: mutationError, reset } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data) => login(data);

  const serverErrorMessage = (() => {
    if (!mutationError) return null;
    return (
      mutationError.response?.data?.message ||
      (mutationError.response?.data?.errors
        ? Object.values(mutationError.response.data.errors).join(", ")
        : "Gagal terhubung ke server. Pastikan backend aktif.")
    );
  })();

  return (
    <div className="h-svh w-full flex bg-surface font-sans antialiased text-ink overflow-hidden">
      <BrandPanel />

      <main className="flex-1 flex items-center justify-center overflow-y-auto p-4 md:p-8">
        <Card className="w-full max-w-md animate-login-rise">
          <CardHeader className="p-6 md:p-8 pb-0 space-y-4">
            <div className="lg:hidden text-center">
              <h1 className="text-2xl font-semibold tracking-[-0.01em] text-brand-700">
                {BRAND_NAME}
              </h1>
            </div>

            <div className="flex justify-center md:justify-start">
              <div className="w-10 h-10 rounded-[10px] bg-brand-600/10 flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-brand-700" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <CardTitle className="text-2xl font-semibold leading-8 tracking-[-0.01em]">
                Masuk ke Akun Anda
              </CardTitle>
              <CardDescription className="text-sm font-normal leading-5 mt-2">
                Gunakan email dan kata sandi yang terdaftar
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8 pt-6 space-y-5">
            {serverErrorMessage && <ErrorBanner message={serverErrorMessage} />}

            <form
              onSubmit={handleSubmit(onSubmit)}
              onChange={() => reset()}
              className="flex flex-col gap-4"
            >
              <FormField
                label="Email"
                id="email"
                type="email"
                placeholder="nama@klinik.com"
                icon={Mail}
                error={errors.email?.message}
                register={register("email")}
              />

              <FormField
                label="Kata Sandi"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                register={register("password")}
              >
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-muted hover:text-brand-700 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </FormField>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-1"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Masuk
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LoginPage;
