import { SignupForm } from "@/components/signup-form"
import { ShieldCheck } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShieldCheck className="h-9 w-9 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Create Your Account</h1>
          <p className="text-sm text-muted-foreground text-balance">
            Start securing your passwords with end-to-end encryption
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
