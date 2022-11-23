import { createRouter, createWebHistory } from "vue-router";
import CustomerQuotation from "../customers/pages/customer-quotation.component.vue";

const routes = [
  {
    path: "/",
    name: "root",
    redirect: { name: "sign-in" },
  },
  {
    path: "/customer/comments",
    name: "customer-comments",
    component: () =>
      import(
        "../shipments/customer-shipments/pages/comments/customer-comment.component.vue"
      ),
    props: true,
  },
  {
    path: "/enterprise/comments",
    name: "view-comments",
    component: () =>
      import(
        "../shipments/customer-shipments/pages/comments/view-comment.component.vue"
      ),
    props: true,
  },
  {
    path: "/enterprise/:id/vehicles",
    name: "vehicles",
    component: () => import("../vehicles/pages/vehicle-list.component.vue"),
    props: true,
  },
  {
    path: "/customers/:id/shipments",
    name: "client-shipments",
    component: () =>
      import(
        "../shipments/customer-shipments/pages/customer-shipments.component.vue"
      ),
    props: true,
  },
  {
    path: "/customers/:id/shipments/:id2/shipment-detail",
    name: "customer-shipment-detail",
    component: () =>
      import(
        "../shipments/customer-shipments/pages/customer-shipments-detail.component.vue"
      ),
    props: true,
  },
  {
    path: "/customers/:id/payments",
    name: "customer-payments",
    component: () => import("../payments/pages/payments-list.component.vue"),
    props: { isCustomer: true },
  },
  {
    path: "/enterprise/:id/payments",
    name: "enterprise-payments",
    component: () => import("../payments/pages/payments-list.component.vue"),
    props: { isCustomer: false },
  },
  {
    path: "/enterprise/:id/vehicles",
    name: "vehicles",
    component: () => import("../vehicles/pages/vehicle-list.component.vue"),
    props: { enableListDialogs: true },
  },
  {
    path: "/customers/:id/quotations",
    props: true,
    component: CustomerQuotation,
    children: [
      {
        path: "/customers/:id/quotations",
        name: "customer-quotations",
        props: true,
        component: () =>
          import(
            "../customers/pages/steps-quotation/quotation-shipment.step.vue"
          ),
      },
      {
        path: "/customers/:id/business-shipping",
        props: true,
        component: () =>
          import(
            "../customers/pages/steps-quotation/enterprise-shipping.step.vue"
          ),
      },
      {
        path: "/customers/:id/pick-up-detail",
        props: true,
        component: () =>
          import("../customers/pages/steps-quotation/pick-up-detail.step.vue"),
      },
      {
        path: "/customers/:id/destination-detail",
        props: true,
        component: () =>
          import(
            "../customers/pages/steps-quotation/destination-detail.step.vue"
          ),
      },
      {
        path: "/customers/:id/payment",
        props: true,
        component: () =>
          import(
            "../customers/pages/steps-quotation/payment-shipment.step.vue"
          ),
      },
    ],
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: () => import("../security/pages/sign-in.component.vue"),
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: () => import("../security/pages/sign-up.component.vue"),
  },
  {
    path: "/enterprise/:id/shipments",
    name: "enterprise-shipments",
    component: () =>
      import(
        "../shipments/enterprise-shipments/pages/enterprise-shipments.component.vue"
      ),
    props: true,
  },
  {
    path: "/enterprise/:id/shipments/:id2/shipment-detail",
    name: "enterprise-shipment-detail",
    component: () =>
      import(
        "../shipments/enterprise-shipments/pages/enterprise-shipments-detail.component.vue"
      ),
    props: true,
  },
  {
    path: "/customers/:idCustomer/shipments/:idShipment/",
    name: "Customer shipment detail",
    component: () =>
      import(
        "../Shipments/customer-shipments/pages/customer-shipments-detail.component.vue"
      ),
  },
  {
    path: "/shipments/enterprise/shipmentDetail/:id",
    name: "Enterprise shipment detail",
    component: () =>
      import(
        "../Shipments/enterprise-shipments/pages/enterprise-shipments-detail.component.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    else return { left: 0, top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/sign-in", "/sign-up"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = JSON.parse(localStorage.getItem("auth"));
  console.log(loggedIn);
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/sign-in");
  } else {
    next();
  }
});

export default router;
