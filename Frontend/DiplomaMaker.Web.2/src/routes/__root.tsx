import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <p>Root</p>
            <Outlet />
            <TanStackRouterDevtools />
            <ReactQueryDevtools />
        </>
    ),
})