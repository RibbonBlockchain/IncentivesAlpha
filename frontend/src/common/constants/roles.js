export const roleNames = {
  SUPER_ADMIN: 1,
  HEALTH_WORKER: 2,
  PRACTITIONER: 3,
  PATIENT: 4
};

export const roles = {
  1: "SUPER_ADMIN",
  2: "HEALTH_WORKER",
  3: "PRACTITIONER",
  4: "PATIENT"
};

export const allowedRoutes = [
  [
    "/app/practitioners",
    "/app/practitioners/new",
    "/app/patients",
    "/app/interactions",
    "/app/health-workers",
    "/app/health-workers/new"
  ],
  ["/app/practitioners", "/app/patients", "/app/interactions"],
  [],
  []
];

export const routes = [
  "/app/practitioners",
  "/app/practitioners/new",
  "/app/patients",
  "/app/interactions",
  "/app/health-workers",
  "/app/health-workers/new"
];
