"use client";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input as Antdinput } from "antd";
import { z } from "zod";
import { formSchema } from "./_local_components/formSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { generateToast } from "../../_global_components/generateToast";
import { Button } from "@/components/ui/button";
import GoogleSignInButton from "../../_global_components/GoogleSignIn";
import { useRouter } from "next/navigation";
import s from "./page.module.scss";
import Link from "next/link";
import { ColorRing } from "react-loader-spinner";
import { useUpdatePassword } from "@/lib/actions/user";
export default function ResetPage() {
  const router = useRouter();
  const { mutate, isPending } = useUpdatePassword();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
  });
  const resetPassword = (values: z.infer<typeof formSchema>) => {
    mutate(values.confirmPassword);
  };

  return (
    <div className="flex flex-col gap-[36px]">
      {/* <h3 className="font-[600] text-[36px] text-white">Log in</h3> */}
      <Form {...form}>
        <form className={s.wrapper} onSubmit={form.handleSubmit(resetPassword)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-[8px] h-fit">
                <FormLabel className="text-[16px] font-[400] text-white">
                  New password
                </FormLabel>
                <FormControl>
                  <Antdinput.Password
                    placeholder="input password"
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-[8px] h-fit">
                <FormLabel className="text-[16px] font-[400] text-white">
                  Confirm password
                </FormLabel>
                <FormControl>
                  <Antdinput.Password
                    placeholder="input password"
                    {...field}
                    className="rounded-[8px] border-none! outline-none! text-[20px]! pl-[20px] pr-[10px] h-[55px] bg-[#fafafa] text-[#e0b88f]!"
                  />
                  
                </FormControl>
                <FormMessage className="text-red font-[300] text-[12px]">
                    {form.formState.errors.confirmPassword?.message}
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
            Update password
          </Button>
        </form>
      </Form>
    </div>
  );
}
