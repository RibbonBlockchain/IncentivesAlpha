export const roleNames = {
  SUPER_ADMIN: 0,
  HEALTH_WORKER: 1,
  PRACTITIONER: 2,
  PATIENT: 3
};

export const roles = {
  0: "SUPER_ADMIN",
  1: "HEALTH_WORKER",
  2: "PRACTITIONER",
  3: "PATIENT"
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
