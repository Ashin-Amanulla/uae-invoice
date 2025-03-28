import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import Button from "../ui/Button";
import FormField from "../ui/FormField";
import { toast } from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [serverError, setServerError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "demo@example.com",
      password: "password",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        setServerError(result.message || "Login failed");
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">UAE Chemical Invoice App</h1>
          <p className="text-gray-500">
            Enter your details to login to your account
          </p>
        </div>

        {serverError && (
          <div className="rounded-md bg-red-100 p-4 text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            register={register}
            required
            error={errors.email?.message}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="********"
            register={register}
            required
            error={errors.password?.message}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            For demo use email: <strong>demo@example.com</strong> and password:{" "}
            <strong>password</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
