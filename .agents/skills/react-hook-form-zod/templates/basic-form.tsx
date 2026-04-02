/**
 * Basic Form Example - Login/Signup Form
 *
 * Demonstrates:
 * - Simple form with email and password validation
 * - useForm hook with zodResolver
 * - Error display
 * - Type-safe form data with z.infer
 * - Accessible error messages
 */

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// 1. Define Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  rememberMe: z.boolean().optional(),
})

// 2. Infer TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>

export function BasicLoginForm() {
  // 3. Initialize form with zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // 4. Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Form data:", data)

      // Make API call
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const result = await response.json()
      console.log("Login successful:", result)

      // Reset form after successful submission
      reset()
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4">
      <h2 className="text-2xl font-bold">Login</h2>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`w-full rounded-md border px-3 py-2 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <span id="email-error" role="alert" className="mt-1 block text-sm text-red-600">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={`w-full rounded-md border px-3 py-2 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="••••••••"
        />
        {errors.password && (
          <span id="password-error" role="alert" className="mt-1 block text-sm text-red-600">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center">
        <input
          id="rememberMe"
          type="checkbox"
          {...register("rememberMe")}
          className="h-4 w-4 rounded"
        />
        <label htmlFor="rememberMe" className="ml-2 text-sm">
          Remember me
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      {/* Form Status */}
      <div className="text-sm text-gray-600">
        {isValid && !isSubmitting && <span className="text-green-600">Form is valid ✓</span>}
      </div>
    </form>
  )
}

/**
 * Signup Form Variant
 */
const signupSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignupFormData = z.infer<typeof signupSchema>

export function BasicSignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    console.log("Signup data:", data)
    // API call
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4">
      <h2 className="text-2xl font-bold">Sign Up</h2>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Full Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="w-full rounded-md border px-3 py-2"
          placeholder="John Doe"
        />
        {errors.name && (
          <span role="alert" className="mt-1 block text-sm text-red-600">
            {errors.name.message}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full rounded-md border px-3 py-2"
          placeholder="you@example.com"
        />
        {errors.email && (
          <span role="alert" className="mt-1 block text-sm text-red-600">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.password && (
          <span role="alert" className="mt-1 block text-sm text-red-600">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.confirmPassword && (
          <span role="alert" className="mt-1 block text-sm text-red-600">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  )
}
