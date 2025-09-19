import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/use-auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 flex flex-col justify-center"
          >
            <div className="flex flex-col gap-6 mt-5 mb-5">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold">Welcome Back!</h1>
                <p className="text-muted-foreground text-balance mt-2">
                  Sign in to your account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-6 mb-8"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block min-h-[400px]">
            <img
              src="../../login.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-8">
              <div className="text-white text-center">
                <h2 className="text-4xl font-extrabold mb-4">
                  Integrated Business System
                </h2>
                <p className="text-lg mb-6">
                  Your entire operation, streamlined and centralized system.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
