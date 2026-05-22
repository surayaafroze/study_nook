"use client";

import { authClient } from "@/lib/auth-client";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";
import { GrGoogle } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
 console.log("SUBMIT FIRED");
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
      image: user.image,
    });

    console.log({ data, error });
    // console.log(user);

    if (data) {
      router.push("/login");
    }
  };

  return (
    <div className="pb-8">
      <Card className="border mx-auto w-125 py-10 mt-5">
        <div className="text-center">
          <FiBookOpen className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-zinc-50">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            Join StudyNook to book and list rooms
          </p>
        </div>

        <Form  onSubmit={onSubmit} className="flex w-96 mx-auto flex-col gap-4">
          <TextField isRequired name="name">
            <Label>Name</Label>
            <Input placeholder="Enter your name" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
              ) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input placeholder="Email address" />
            <FieldError />
          </TextField>

          <TextField isRequired name="image">
            <Label>Image URL</Label>
            <Input placeholder="Image URL" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <Input placeholder="Password" />
            <FieldError />
          </TextField>

          <Button className="w-full bg-indigo-600 text-white" type="submit">
            Sign Up
          </Button>

         
        </Form>

         <Button
            variant="outline"
            className="w-full flex justify-center gap-2"
          >
           <FcGoogle></FcGoogle>
            Continue with Google
          </Button>

          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-sm text-indigo-600 hover:underline"
            >
              Already have an account? Login
            </Link>
          </div>
      </Card>
    </div>
  );
}