import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { DataUpdateProvider, DataProvider } from "@/components/data-update-context";
import Home from "@/pages/home";
import AdminPage from "@/pages/admin";
import TestimonialsPage from "@/pages/testimonials";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home}/>
        <Route path="/testimonials" component={TestimonialsPage}/>
        <Route path="/admin/*" component={AdminPage}/>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataUpdateProvider>
        <DataProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </DataProvider>
      </DataUpdateProvider>
    </QueryClientProvider>
  );
}

export default App;
