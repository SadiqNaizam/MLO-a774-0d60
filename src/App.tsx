import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // shadcn sonner for non-blocking notifications
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import newly generated pages
import HomePage from "./pages/HomePage";
import RestaurantListingPage from "./pages/RestaurantListingPage";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import CartCheckoutPage from "./pages/CartCheckoutPage";
import OrderTrackingProfilePage from "./pages/OrderTrackingProfilePage";

import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster /> {/* For shadcn Toasts (usually user-initiated blocking actions) */}
      <Sonner /> {/* For shadcn Sonner (non-blocking notifications) */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantListingPage />} />
          {/* For RestaurantMenuPage, :restaurantId is a dynamic parameter */}
          <Route path="/restaurant/:restaurantId/menu" element={<RestaurantMenuPage />} />
          <Route path="/cart" element={<CartCheckoutPage />} />
          <Route path="/profile" element={<OrderTrackingProfilePage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} /> {/* Always Include This Line As It Is. */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;