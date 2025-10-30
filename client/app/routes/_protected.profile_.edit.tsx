import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Form,
  Input,
} from "@heroui/react";
import { useUser } from "./_protected";
import { useState, type FormEvent } from "react";
import z from "zod";
import api from "~/api";
import { useNavigate } from "react-router";

const userEditSchema = z.object({
  firstName: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().max(30, "First name must be <30 characters").nullable()
  ),
  lastName: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().max(30, "Last name must be <30 characters").nullable()
  ),
  phoneNumber: z.preprocess(
    (val) => (val === "" ? null : val),
    z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number must be at most 10 digits")
      .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format")
      .nullable()
  ),
});

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formErrors, setErrors] = useState<Record<string, string | string[]>>(
    {}
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const validation = userEditSchema.safeParse(data);
    if (!validation.success) {
      const flattenedErrors = z.flattenError(validation.error);
      setErrors(flattenedErrors.fieldErrors);
      return;
    }

    console.log("Validated data:", validation.data);

    // Expected body for API
    const body = {
      first_name: validation.data.firstName,
      last_name: validation.data.lastName,
      phone_number: validation.data.phoneNumber,
    };

    // Make API call to update user profile here
    try {
      await api.put("/auth/me", body);
    } catch (error) {
      console.error("Failed to update profile:", error);
      return;
    }

    navigate("/profile");

    console.log("Form submitted with data:", data);
  };

  return (
    <main className="min-h-screen w-full bg-neutral-100">
      <div className="max-w-2xl mx-auto pt-12 flex flex-col gap-4 px-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/profile">Profile</BreadcrumbItem>
          <BreadcrumbItem>Edit</BreadcrumbItem>
        </Breadcrumbs>
        <h1 className="text-3xl font-medium">Edit Profile</h1>

        <Form onSubmit={onSubmit} validationErrors={formErrors}>
          <div className="flex flex-col gap-2 md:gap-4 w-full">
            <div className="w-full flex flex-row gap-2 md:gap-4">
              <Input
                name="firstName"
                size="sm"
                label="First Name"
                radius="none"
                variant="bordered"
                fullWidth
                defaultValue={user.first_name ?? undefined}
              />
              <Input
                name="lastName"
                label="Last Name"
                size="sm"
                radius="none"
                variant="bordered"
                fullWidth
                defaultValue={user.last_name ?? undefined}
              />
            </div>

            <Input
              name="phoneNumber"
              label="Phone Number"
              size="sm"
              radius="none"
              variant="bordered"
              fullWidth
              defaultValue={user.phone_number ?? undefined}
              description="Buyers may use this number to contact you about your listings."
            />

            <Input
              label="Email"
              variant="bordered"
              size="sm"
              fullWidth
              radius="none"
              defaultValue={user.email}
              description="Email cannot be changed. If you need to update your email, please contact support."
              isDisabled
            />

            <Button
              type="submit"
              variant="solid"
              radius="none"
              color="primary"
              className="mt-4"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </div>
    </main>
  );
}
