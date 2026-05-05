import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-center mb-6">
        <span className="text-white text-2xl font-black tracking-tight">PrimeDrive</span>
        <p className="text-zinc-500 text-sm mt-1">Anmelden um Fahrten zu verwalten</p>
      </div>
      <SignIn />
    </div>
  )
}
