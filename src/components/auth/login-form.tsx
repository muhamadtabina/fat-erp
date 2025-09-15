import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { useAlert } from "@/contexts/AlertContext";
import { useState } from "react";
import { userLogin } from "@/lib/api/auth/AuthApi";
import { type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showAlert } = useAlert();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userLogin({ email, password });

      if (response.status === 200) {
        const responseBody = await response.json();

        if (responseBody.data && responseBody.data.access_token) {
          // Gunakan Auth Context untuk menyimpan token di memory
          const userData = {
            id: responseBody.data.user?.id || "1",
            email: responseBody.data.user?.email || email,
            name: responseBody.data.user?.name || "User",
          };

          login(responseBody.data.access_token, userData);
          await navigate("/dashboard");
        } else {
          await showAlert("error", "Invalid response format");
        }
      } else {
        const responseBody = await response.json();
        await showAlert("error", responseBody.message || "Login failed");
      }
    } catch (error) {
      await showAlert(
        "error",
        "An unexpected error occurred. Please try again."
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-6 mb-8"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing In..." : "Sign In"}
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
