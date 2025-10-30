import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Car } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const carFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 2),
  category: z.enum([
    "sedan",
    "suv",
    "hatchback",
    "luxury",
    "sports",
    "electric",
  ]),
  transmission: z.enum(["automatic", "manual"]),
  fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
  seatingCapacity: z.number().min(2).max(9),
  color: z.string().min(2, "Color is required"),
  pricePerDay: z.number().min(1, "Price must be greater than 0"),
  images: z.string().min(1, "At least one image URL is required"),
  features: z.string().min(1, "Features are required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location is required"),
  mileage: z.string().min(1, "Mileage is required"),
  isAvailable: z.boolean(),
});

type CarFormData = z.infer<typeof carFormSchema>;

interface CarFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car?: Car | null;
  onSave: (data: CarFormData) => Promise<void>;
}

export const CarFormDialog: React.FC<CarFormDialogProps> = ({
  open,
  onOpenChange,
  car,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: car
      ? {
          name: car.name,
          brand: car.brand,
          model: car.model,
          year: car.year,
          category: car.category,
          transmission: car.transmission,
          fuelType: car.fuelType,
          seatingCapacity: car.seatingCapacity,
          color: car.color,
          pricePerDay: car.pricePerDay,
          images: car.images.join(", "),
          features: car.features.join(", "),
          description: car.description,
          location: car.location,
          mileage: car.mileage,
          isAvailable: car.isAvailable,
        }
      : {
          isAvailable: true,
        },
  });

  const onSubmit = async (data: CarFormData) => {
    try {
      await onSave(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car ? "Edit Car" : "Add New Car"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Car Name</Label>
              <Input id="name" {...register("name")} className="mt-1" />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" {...register("brand")} className="mt-1" />
              {errors.brand && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" {...register("model")} className="mt-1" />
              {errors.model && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.model.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                {...register("year", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.year && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.year.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select id="category" {...register("category")} className="mt-1">
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="luxury">Luxury</option>
                <option value="sports">Sports</option>
                <option value="electric">Electric</option>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <Select
                id="transmission"
                {...register("transmission")}
                className="mt-1">
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </Select>
              {errors.transmission && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.transmission.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select id="fuelType" {...register("fuelType")} className="mt-1">
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </Select>
              {errors.fuelType && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.fuelType.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="seatingCapacity">Seating Capacity</Label>
              <Input
                id="seatingCapacity"
                type="number"
                {...register("seatingCapacity", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.seatingCapacity && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.seatingCapacity.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Input id="color" {...register("color")} className="mt-1" />
              {errors.color && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.color.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="pricePerDay">Price Per Day ($)</Label>
              <Input
                id="pricePerDay"
                type="number"
                {...register("pricePerDay", { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.pricePerDay && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.pricePerDay.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} className="mt-1" />
              {errors.location && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                placeholder="e.g., 25 MPG"
                {...register("mileage")}
                className="mt-1"
              />
              {errors.mileage && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.mileage.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="images">Image URLs (comma-separated)</Label>
            <Input
              id="images"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              {...register("images")}
              className="mt-1"
            />
            {errors.images && (
              <p className="text-xs text-red-600 mt-1">
                {errors.images.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input
              id="features"
              placeholder="AC, GPS, Bluetooth, Sunroof"
              {...register("features")}
              className="mt-1"
            />
            {errors.features && (
              <p className="text-xs text-red-600 mt-1">
                {errors.features.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              {...register("description")}
              className="mt-1"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailable"
              {...register("isAvailable")}
              className="h-4 w-4"
            />
            <Label htmlFor="isAvailable" className="cursor-pointer">
              Available for booking
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : car ? "Update Car" : "Add Car"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CarFormDialog;
