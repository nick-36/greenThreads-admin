"use client";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserValidationSignUp,
  UserValidationProfileUpdate,
} from "@/lib/validation/userValidation";
import * as z from "zod";
import Image from "next/image";
import { cn, isBase64Image } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSignUp, useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera } from "lucide-react";
import OTPScreen from "./OTPScreen";
import { Icons } from "../ui/icons";
import { useToast } from "../ui/use-toast";

interface AccountProfileProps {
  ctaText: string;
  showPasswordField?: boolean;
  isSignUpFlow?: boolean;
}

type UserFormData = z.infer<typeof UserValidationSignUp>;

const AccountProfile = ({
  ctaText,
  showPasswordField = false,
  isSignUpFlow = false,
}: AccountProfileProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    resolver: zodResolver(
      showPasswordField ? UserValidationSignUp : UserValidationProfileUpdate
    ),
    defaultValues: useMemo(() => {
      return {
        profileImg: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
      };
    }, [user]),
    mode: "onBlur",
  });

  useEffect(() => {
    if (user) {
      form?.reset({
        profileImg: user?.hasImage ? user?.imageUrl : "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        username: user?.username || "",
        email: user?.primaryEmailAddress?.emailAddress || "",
        phoneNumber: (user?.unsafeMetadata?.phoneNumber as string) ?? "",
        password: "",
      });
    }
  }, [user?.id]);

  const onFormSubmit = async (values: UserFormData) => {
    setIsLoading(true);

    if (isSignUpFlow) {
      if (!isLoaded) return;

      try {
        await signUp.create({
          emailAddress: values.email,
          password: values.password,
          firstName: values?.firstName,
          lastName: values?.lastName,
          username: values?.username,
          unsafeMetadata: {
            phoneNumber: values?.phoneNumber,
            role: "SELLER",
          },
        });

        // send the email.
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setPendingVerification(true);
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
      }
    } else {
      if (!isLoaded) {
        return;
      }
      if (values?.profileImg) {
        const blob = values.profileImg;

        const hasImageChanged = isBase64Image(blob);
        if (hasImageChanged) {
          user?.setProfileImage({
            file: blob,
          });
        }
      }

      try {
        await user?.update({
          firstName: values?.firstName,
          lastName: values?.lastName,
          username: values?.username,
          unsafeMetadata: {
            phoneNumber: values?.phoneNumber,
            role: user?.unsafeMetadata?.role,
          },
        });

        toast({
          title: "User Update Successfully",
          duration: 2000,
        });
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
      }
    }
    setIsLoading(false);
  };

  const onPressVerify = async (otp: string) => {
    setIsLoading(true);

    if (!isLoaded) {
      return;
    }
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: otp,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-900 p-4">
            <code className="text-white">{JSON.stringify(otp, null, 2)}</code>
          </pre>
        ),
        duration: 3000,
      });
    }
    setIsLoading(false);
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  if (pendingVerification) {
    return (
      <div className="p-6 flex justify-center">
        <div className="flex flex-col space-y-6 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Enter the OTP received in your email
          </h2>
          <OTPScreen onPressVerify={onPressVerify} isLoading={isLoading} />
        </div>
      </div>
    );
  }
  return (
    <>
      {isSignUpFlow && (
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Start Your Journey Here,
          </h1>
          <p className="text-sm text-muted-foreground">
            It only takes a minute to sign up!
          </p>
        </div>
      )}
      <Card className="w-full border-none shadow-none">
        <CardContent className="p-0">
          <Form {...form}>
            <form
              onSubmit={form?.handleSubmit(onFormSubmit)}
              className={cn("grid w-full items-start gap-6 md:pt-0")}
            >
              {!isSignUpFlow && (
                <FormField
                  control={form.control}
                  name="profileImg"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center gap-4 mt-2">
                      <FormLabel className="relative">
                        {field.value ? (
                          <Image
                            src={field.value}
                            alt="profile photo"
                            width={96}
                            height={96}
                            priority
                            className="rounded-full border-2 border-white aspect-square object-cover"
                          />
                        ) : (
                          <Image
                            src={"/assets/male_avatar.svg"}
                            alt="profile photo"
                            width={96}
                            height={96}
                            priority
                            className="rounded-full border-2 border-white aspect-square object-cover"
                          />
                        )}
                        <Button
                          type="button"
                          className="h-8 w-8 rounded-full absolute bottom-0 right-0"
                          size="icon"
                          onClick={() => inputRef?.current?.click()}
                        >
                          <Camera
                            size={16}
                            strokeWidth={1}
                            absoluteStrokeWidth
                          />
                        </Button>
                      </FormLabel>
                      <FormControl className="flex-1 hidden text-base-semibold text-gray-200">
                        <Input
                          ref={inputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e: any) => handleImage(e, field.onChange)}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div
                className={cn(
                  "grid w-full md:grid-cols-2 items-start gap-6 overflow-auto md:px-10 pt-4 p-4"
                )}
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-light-2">First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your First name"
                          className="placeholder:text-gray-300 placeholder:font-light"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-light-2">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your last name"
                          className="placeholder:text-gray-300 placeholder:font-light"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-light-2">User Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Username (e.g., john_doe)"
                          className="placeholder:text-gray-300 placeholder:font-light"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="m-0" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Mobile number (e.g., +123456789)"
                          className="placeholder:text-gray-300 placeholder:font-light"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length > 10) return;
                            field.onChange(val);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Email (e.g.,name@example.com)"
                          className="placeholder:text-gray-300 placeholder:font-light"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {showPasswordField && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            placeholder="******"
                            type="password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            className="placeholder:text-gray-300 placeholder:font-light"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="m-0" />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <div className="w-full grid place-items-center pb-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  // className="grid gap-2 md:min-w-80"
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {ctaText}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default AccountProfile;
