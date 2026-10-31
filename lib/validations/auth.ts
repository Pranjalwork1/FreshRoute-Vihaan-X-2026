import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    termsConsent: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms of service and privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const onboardingSchema = z.object({
  roles: z.array(z.string()).min(1, "Please select at least one role"),
  businessName: z.string().optional(),
  village: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  produceCategories: z.array(z.string()).optional(),
  operatingLocations: z.string().optional(),
  vehicleTypes: z.string().optional(),
});

