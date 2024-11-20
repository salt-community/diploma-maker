import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { SignInButton, UserButton } from '@clerk/clerk-react'

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <UserButton />
            <SignInButton />
            <TanStackRouterDevtools />
            <ReactQueryDevtools />
        </>
    ),
})