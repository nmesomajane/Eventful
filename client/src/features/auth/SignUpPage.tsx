import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import RoleSelector from "./components/RoleSelector";
import type { Role } from "../../types/auth.types";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
  role: z.enum(["organizer", "attendee"]),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "attendee" as Role },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await signup(data);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold">Create your account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="role"
          control={control}
          render={({ field }) => <RoleSelector value={field.value} onChange={field.onChange} />}
        />

        <input {...register("name")} placeholder="Full name" className="w-full rounded border p-2" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

        <input {...register("email")} placeholder="Email" className="w-full rounded border p-2" />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full rounded border p-2"
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-blue-600 p-2 text-white disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}