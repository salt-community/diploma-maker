import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import DragAndDropFileParser from '../components/development/DragAndDropFileParser'

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <DragAndDropFileParser />
            <TanStackRouterDevtools />
            <ReactQueryDevtools />
        </>
    ),
})