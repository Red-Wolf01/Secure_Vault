import { LoginForm } from "@/components/login-form"
import { ShieldCheck } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">SecureVault</h1>
          </div>
          <p className="text-muted-foreground">Your passwords, encrypted and secure</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
