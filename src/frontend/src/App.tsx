import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ResourceType } from "./backend.d";
import { BottomNav } from "./components/BottomNav";
import { Header } from "./components/Header";
import { JayaAI } from "./components/JayaAI";
import { CropPricesPage } from "./pages/CropPricesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ResourceBookingPage } from "./pages/ResourceBookingPage";
import { WeatherPage } from "./pages/WeatherPage";

// Root layout
const rootRoute = createRootRoute({
  component: () => {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
        <Toaster position="top-center" richColors />
      </div>
    );
  },
});

// Login layout (no header/nav)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// App layout (with header + bottom nav)
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: () => (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
      <JayaAI />
    </div>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: DashboardPage,
});

const tractorsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/tractors",
  component: () => <ResourceBookingPage type={ResourceType.tractor} />,
});

const laboursRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/labours",
  component: () => <ResourceBookingPage type={ResourceType.labour} />,
});

const dronesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/drones",
  component: () => <ResourceBookingPage type={ResourceType.drone} />,
});

const myBookingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/my-bookings",
  component: MyBookingsPage,
});

const cropPricesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/crop-prices",
  component: CropPricesPage,
});

const weatherRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/weather",
  component: WeatherPage,
});

const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    tractorsRoute,
    laboursRoute,
    dronesRoute,
    myBookingsRoute,
    cropPricesRoute,
    weatherRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
