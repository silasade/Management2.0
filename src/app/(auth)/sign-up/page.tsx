"use client";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input as AntdInput } from "antd"; // clearer name
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateToast } from "@/app/_global_components/generateToast";
import { formSchema } from "./_local_components/formSchema";
import GoogleSignInButton from "@/app/_global_components/GoogleSignIn";
import Link from "next/link";
import { ColorRing } from "react-loader-spinner";
import { useState } from "react";

export default function Home() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const signup = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsPending(true);
      const res = await fetch("/api/auth/sign-up", {
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error ?? "Login failed");
      }
      generateToast("success", "Sign up successful! verify your email");
    } catch (error) {
      generateToast("error", (error as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(signup)}
        className="w-full flex flex-col gap-[18px]"
      >
        <div className="w-full flex flex-row gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-8px h-fit w-full">
                <FormLabel className="text-[16px] font-[400] text-white">
                  First name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-[8px] border-none! outline-none! pl-[20px] pr-[10px] h-[55px] bg-[#fafafa] text-[20px]! text-[#e0b88f]!"
                  />
                </FormControl>
                <FormMessage className="text-red font-[300] text-[12px]">
                  {form.formState.errors.firstName?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-[8px] h-fit w-full">
                <FormLabel className="text-[16px] font-[400] text-white">
                  Last name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="rounded-[8px] border-none! outline-none! text-[20px]! pl-[20px] pr-[10px] h-[55px] bg-[#fafafa] text-[#e0b88f]!"
                  />
                </FormControl>
                <FormMessage className="text-red font-[300] text-[12px]">
                  {form.formState.errors.lastName?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-[8px] h-fit">
              <FormLabel className="text-[16px] font-[400] text-white">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="rounded-[8px] border-none! outline-none! text-[20px]! pl-[20px] pr-[10px] h-[55px] bg-[#fafafa] text-[#e0b88f]!"
                />
              </FormControl>
              <FormMessage className="text-red font-[300] text-[12px]">
                {form.formState.errors.email?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-[8px] h-fit">
              <FormLabel className="text-[16px] font-[400] text-white">
                Password
              </FormLabel>
              <FormControl>
                <AntdInput.Password
                  placeholder="Enter password"
                  {...field}
                  className="rounded-[8px] border-none! outline-none! text-[20px]! pl-[20px] pr-[10px] h-[55px] bg-[#fafafa] text-[#e0b88f]!"
                />
              </FormControl>
              <FormMessage className="text-red font-[300] text-[12px]">
                {form.formState.errors.password?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <Button
          className="h-[45px] text-[14px] bg-[#996f4a] cursor-pointer hover:bg-[#c2a285] flex flex-row items-center gap-2"
          type="submit"
        >
          {isPending && (
            <ColorRing
              visible={true}
              height="20"
              width="20"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          )}
          Sign Up
        </Button>
        <GoogleSignInButton />
        <span className="text-[12px] font-[500] text-white text-center">
          Already have an account?{" "}
          <Link href={"/"} className="text-[#e0b88f] hover:text-[#f9dfc2]">
            Login
          </Link>
        </span>
      </form>
    </Form>
  );
}
