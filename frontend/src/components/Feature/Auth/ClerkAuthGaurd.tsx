import { Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

export function ClerkAuthGuard({ children }) {

  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>

  )
} 