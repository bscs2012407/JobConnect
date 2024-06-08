import { lazy } from "react";

const PagesRoutes = [
  //Workspace

  {
    path: "/pages/authentication/register",
    component: lazy(() => import("../../view/pages/authentication/register")),
    layout: "FullLayout",
    isProtected: false,
  },

  {
    path: "/pages/authentication/login",
    component: lazy(() => import("../../view/pages/authentication/login")),
    layout: "FullLayout",
    isProtected: false,
  },

  {
    path: "/pages/workspace",
    component: lazy(() => import("../../view/main/dashboard/workspace")),
    layout: "VerticalLayout",
    isProtected: true,
  },

  {
    path: "/pages/jobposts",
    component: lazy(() => import("../../view/main/dashboard/joposts")),
    layout: "VerticalLayout",
    isProtected: true,
  },

  {
    path: "/pages/job-history",
    component: lazy(() => import("../../view/main/dashboard/jobHistory")),
    layout: "VerticalLayout",
    isProtected: true,
  },

  {
    path: "/pages/resume",
    component: lazy(() => import("../../view/main/dashboard/resume")),
    layout: "VerticalLayout",
    isProtected: true,
  },

  // {
  //   path: "/pages/workspace-history",
  //   component: lazy(() => import("../../view/pages/workspaceHistory/WorkspaceHistory")),
  //   layout: "VerticalLayout",
  //   isProtected: true,
  // },

  // PAGES
  {
    path: "/pages/education",
    component: lazy(() => import("../../view/main/dashboard/education")),
    layout: "VerticalLayout",
    isProtected: true,
    show: "user",
  },
  {
    path: "/pages/experience",
    component: lazy(() => import("../../view/main/dashboard/experience")),
    layout: "VerticalLayout",
    isProtected: true,
    show: "user",
  },
  {
    path: "/pages/candidate",
    component: lazy(() => import("../../view/main/dashboard/candidate")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/authentication/recover-password",
    component: lazy(() =>
      import("../../view/pages/authentication/recover-password")
    ),
    layout: "FullLayout",
    isProtected: false,
  },
  {
    path: "/pages/authentication/verify-email",
    component: lazy(() =>
      import("../../view/pages/authentication/verify-email")
    ),
    layout: "FullLayout",
    isProtected: false,
  },
  {
    path: "/pages/authentication/reset-password",
    component: lazy(() =>
      import("../../view/pages/authentication/reset-password")
    ),
    layout: "FullLayout",
    isProtected: false,
  },
  {
    path: "/pages/pricing",
    component: lazy(() => import("../../view/pages/pricing")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/profile/personel-information",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/profile/password-change",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
    isProtected: true,
  },
  {
    path: "/pages/payment/success",
    component: lazy(() => import("../../view/pages/payment-success")),
    layout: "FullLayout",
    isProtected: true,
  },
  {
    path: "/pages/payment/fail",
    component: lazy(() => import("../../view/pages/payment-fail")),
    layout: "FullLayout",
    isProtected: true,
  },

  {
    path: "/",
    component: lazy(() => import("../../view/pages/HomePage")),
    layout: "FullLayout",
    isProtected: false,
  },
];

export default PagesRoutes;
