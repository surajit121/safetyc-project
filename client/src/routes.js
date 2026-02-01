import { lazy } from 'react';

// Prefetch utility
const prefetchMap = new Map();

// Helper to prefetch a route's component
export const prefetchRoute = (path) => {
  const route = routes.find(r => r.path === path);
  if (route && route.importFunc && !prefetchMap.has(path)) {
    console.log(`Prefetching ${path}...`);
    const promise = route.importFunc();
    prefetchMap.set(path, promise);
    return promise;
  }
};

// Route definitions with import functions
export const routes = [
  {
    path: "/",
    label: "Home",
    importFunc: () => import("./pages/Home.jsx"),
    component: lazy(() => import("./pages/Home.jsx"))
  },
  {
    path: "/about",
    label: "About Us",
    importFunc: () => import("./pages/About.jsx"),
    component: lazy(() => import("./pages/About.jsx"))
  },
  {
    path: "/services",
    label: "Services",
    importFunc: () => import("./pages/Services.jsx"),
    component: lazy(() => import("./pages/Services.jsx"))
  },
  {
    path: "/projects",
    label: "Projects",
    importFunc: () => import("./pages/Projects.jsx"),
    component: lazy(() => import("./pages/Projects.jsx"))
  },
  {
    path: "/clients",
    label: "Clients",
    importFunc: () => import("./pages/Clients.jsx"),
    component: lazy(() => import("./pages/Clients.jsx"))
  },
  {
    path: "/careers",
    label: "Careers",
    importFunc: () => import("./pages/Careers.jsx"),
    component: lazy(() => import("./pages/Careers.jsx"))
  },
  {
    path: "/contact",
    label: "Contact",
    importFunc: () => import("./pages/Contact.jsx"),
    component: lazy(() => import("./pages/Contact.jsx"))
  },
  {
    path: "/book-service",
    label: "Book Service",
    importFunc: () => import("./pages/BookService.jsx"),
    component: lazy(() => import("./pages/BookService.jsx"))
  },
  {
    path: "*",
    label: "Not Found",
    importFunc: () => import("./pages/NotFound.jsx"),
    component: lazy(() => import("./pages/NotFound.jsx"))
  }
];
