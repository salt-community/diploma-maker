import { SignIn } from '@clerk/clerk-react'
import './sing-in.css'

export default function SignInPage() {
  return (

    <div className='login-view'>
      <SignIn path="/sign-in" fallbackRedirectUrl="/home" signUpUrl={null}/>
      
    </div>
  )
}