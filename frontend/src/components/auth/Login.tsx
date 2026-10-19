"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from '../../Context/AuthContext.jsx';
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
})
const backendUrl = import.meta.env.VITE_BASE_URL;
type LoginFormValues = z.infer<typeof loginSchema>

export default function Login({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { login } = useAuth();
  const [resMessage, setResMessage] = React.useState('');
  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login email:", data.email, data.password);
    try {
      await login(data.email, data.password);
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong"
      setResMessage(message)
    }
  }

  const GOOGLE_LOGIN_URL = `${backendUrl}/api/auth/google`;

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <div className={cn(" flex flex-col gap-6", className)} {...props}>
      <Card className=" max-w-[450px]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl ">Login account</CardTitle>
          <CardDescription>
            Enter your email and password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>

              {/* EMAIL */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <FieldDescription className="text-red-500">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {/* PASSWORD */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="***********"
                  {...register("password")}
                />
                {errors.password && (
                  <FieldDescription className="text-red-500">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              <FieldDescription>
                {resMessage}
              </FieldDescription>
              {/* SUBMIT */}
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    
      <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-3 w-full h-11
                 bg-white text-gray-800 border border-gray-300 rounded-md
                 font-medium hover:bg-gray-100 active:bg-gray-200
                 transition-colors duration-200"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        className="w-5 h-5"
      />
      <span>Continue with Google</span>
    </button>

      <FieldDescription className="px-6 max-w-[450px] text-center">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
