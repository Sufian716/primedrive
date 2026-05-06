import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center mb-6">
        <span className="text-foreground text-2xl font-black tracking-tight">PrimeDrive</span>
        <p className="text-muted-foreground text-sm mt-1">Anmelden um Fahrten zu buchen</p>
      </div>
      <SignIn />
    </div>
  )
}
