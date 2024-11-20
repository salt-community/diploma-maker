import { PageLayout } from "@/components/layout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <PageLayout>
        <Outlet />
      </PageLayout>
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  ),
});
