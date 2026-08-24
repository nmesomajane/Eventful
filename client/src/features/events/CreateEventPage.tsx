import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEventStore } from "../../store/eventStore";

const schema = z
  .object({
    title: z.string().min(3, "Title too short"),
    description: z.string().min(10, "Description too short"),
    category: z.string().optional(),
    location: z.string().min(3, "Location required"),
    coverImageUrl: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    startDate: z.string().min(1, "Start date required"),
    endDate: z.string().min(1, "End date required"),
    capacity: z.coerce.number().int().positive("Must be a positive number"),
    ticketPrice: z.coerce.number().nonnegative().default(0),
    status: z.enum(["draft", "published"]).default("draft"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type FormData = z.infer<typeof schema>;

// Reusable floating-label text input
function FloatingInput({
  id,
  label,
  register,
  error,
  type = "text",
  textarea = false,
}: {
  id: string;
  label: string;
  register: any;
  error?: string;
  type?: string;
  textarea?: boolean;
}) {
  const shared =
    "peer w-full rounded-lg border border-gray-300 bg-white px-3 pt-5 pb-2 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div>
      <div className="relative">
        {textarea ? (
          <textarea
            id={id}
            placeholder=" "
            rows={3}
            className={shared}
            {...register}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder=" "
            className={shared}
            {...register}
          />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-3 top-3.5 text-sm text-gray-400 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-600 [&:not(:placeholder-shown)]:top-1.5 [&:not(:placeholder-shown)]:text-xs"
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const createEvent = useEventStore((s) => s.createEvent);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { status: "draft" },
  });

  const onSubmit = async (data: FormData) => {
    console.log(
      "[CreateEventPage] submitting event:",
      data.title,
      "start:",
      data.startDate,
      "end:",
      data.endDate,
    );
    try {
      await createEvent(data);
      toast.success("Event created");
      navigate("/organizer/events");
    } catch (err: any) {
      console.log("[CreateEventPage] create failed:", err?.response?.data);
      toast.error(err?.response?.data?.error || "Failed to create event");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg px-4 pb-16">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FloatingInput
          id="title"
          label="Title"
          register={register("title")}
          error={errors.title?.message}
        />
        <FloatingInput
          id="description"
          label="Description"
          register={register("description")}
          error={errors.description?.message}
          textarea
        />
        <FloatingInput
          id="location"
          label="Location"
          register={register("location")}
          error={errors.location?.message}
        />
        <FloatingInput
          id="category"
          label="Category (optional)"
          register={register("category")}
        />

        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium mb-2"
          >
            Event Cover Image
          </label>

          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                console.log("Selected file:", file);
              }
            }}
            className="peer w-full rounded-lg border border-gray-300 bg-white py-5 pl-7 pr-3 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Dates — explicit labels since datetime-local doesn't play nicely with floating labels */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Start date
            </label>
            <input
              id="startDate"
              type="datetime-local"
              {...register("startDate")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.startDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              End date
            </label>
            <input
              id="endDate"
              type="datetime-local"
              {...register("endDate")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.endDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <FloatingInput
          id="capacity"
          label="Capacity"
          type="number"
          register={register("capacity")}
          error={errors.capacity?.message}
        />

        {/* Ticket price with currency prefix */}
        <div>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
              ₦
            </span>
            <input
              id="ticketPrice"
              type="number"
              step="0.01"
              placeholder=" "
              {...register("ticketPrice")}
              className="peer w-full rounded-lg border border-gray-300 bg-white py-5 pl-7 pr-3 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <label
              htmlFor="ticketPrice"
              className="pointer-events-none absolute left-7 top-3.5 text-sm text-gray-400 transition-all duration-200 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-600 [&:not(:placeholder-shown)]:top-1.5 [&:not(:placeholder-shown)]:text-xs"
            >
              Ticket price (0 = free)
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Visibility
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="draft">Save as draft</option>
            <option value="published">Publish now</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
