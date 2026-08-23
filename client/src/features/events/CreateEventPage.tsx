import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEventStore } from "../../store/eventStore";

const schema = z.object({
  title: z.string().min(3, "Title too short"),
  description: z.string().min(10, "Description too short"),
  category: z.string().optional(),
  location: z.string().min(3, "Location required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  capacity: z.coerce.number().int().positive("Must be a positive number"),
  ticketPrice: z.coerce.number().nonnegative().default(0),
  status: z.enum(["draft", "published"]).default("draft"),
});

type FormData = z.infer<typeof schema>;

export default function CreateEventPage() {
  const navigate = useNavigate();
  const createEvent = useEventStore((s) => s.createEvent);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { status: "draft" } });

  const onSubmit = async (data: FormData) => {
    console.log("[CreateEventPage] submitting event:", data.title);
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
    <div className="mx-auto mt-10 max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-semibold">Create Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("title")} placeholder="Title" className="w-full rounded border p-2" />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

        <textarea {...register("description")} placeholder="Description" className="w-full rounded border p-2" />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}

        <input {...register("location")} placeholder="Location" className="w-full rounded border p-2" />
        {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}

        <input {...register("category")} placeholder="Category (optional)" className="w-full rounded border p-2" />

        <div className="flex gap-3">
          <input type="datetime-local" {...register("startDate")} className="w-full rounded border p-2" />
          <input type="datetime-local" {...register("endDate")} className="w-full rounded border p-2" />
        </div>
        {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
        {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}

        <input type="number" {...register("capacity")} placeholder="Capacity" className="w-full rounded border p-2" />
        {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}

        <input type="number" step="0.01" {...register("ticketPrice")} placeholder="Ticket price (0 = free)" className="w-full rounded border p-2" />

        <select {...register("status")} className="w-full rounded border p-2">
          <option value="draft">Save as draft</option>
          <option value="published">Publish now</option>
        </select>

        <button type="submit" disabled={isSubmitting} className="w-full rounded bg-blue-600 p-2 text-white disabled:opacity-50">
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}