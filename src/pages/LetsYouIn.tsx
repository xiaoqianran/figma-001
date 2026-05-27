import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'



export default function LetsYouIn() {
  const navigate = useNavigate()

  const handleSocial = (_provider: string) => {
    // In real app: OAuth flow
    setTimeout(() => navigate('/app'), 600)
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-10 flex flex-col">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="w-11 h-11 -ml-2"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </Button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-10">
          <div className="text-tertiary text-sm tracking-[3px] mb-2">WELCOME BACK</div>
          <h1 className="font-display text-[42px] leading-none tracking-[-2px] font-semibold">Let's you in</h1>
        </div>

        <div className="space-y-3">
          <Button
            variant="secondary"
            size="xl"
            fullWidth
            className="justify-start pl-6 gap-4"
            onClick={() => handleSocial('facebook')}
          >
            <div className="w-6 h-6 flex-shrink-0 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-xs font-bold">
              f
            </div>
            <span>Continue with Facebook</span>
          </Button>

          <Button
            variant="secondary"
            size="xl"
            fullWidth
            className="justify-start pl-6 gap-4"
            onClick={() => handleSocial('google')}
          >
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.28v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span>Continue with Google</span>
          </Button>

          <Button
            variant="secondary"
            size="xl"
            fullWidth
            className="justify-start pl-6 gap-4"
            onClick={() => handleSocial('apple')}
          >
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-[22px] leading-none">
              
            </div>
            <span>Continue with Apple</span>
          </Button>
        </div>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs uppercase tracking-[2px] text-tertiary">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <Button
          onClick={() => navigate('/signin')}
          className="w-full h-[58px] text-base"
        >
          Sign in with password
        </Button>

        <div className="text-center mt-8 text-sm">
          <span className="text-tertiary">Don’t have an account? </span>
          <button onClick={() => navigate('/signup')} className="text-[#3B82F6] font-medium hover:underline">Sign up</button>
        </div>
      </div>
    </div>
  )
}
