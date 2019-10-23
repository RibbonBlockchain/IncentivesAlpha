export const roleNames = {
  SUPER_ADMIN: 1,
  HEALTH_WORKER: 2,
  PATIENT: 3,
  PRACTITIONER: 4
};

export const roles = {
  1: "SUPER_ADMIN",
  2: "HEALTH_WORKER",
  3: "PATIENT",
  4: "PRACTITIONER"
};

export const allowedRoutes = [
  [],
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

export const getRoleURL = role => {
  switch (role) {
    case roleNames.HEALTH_WORKER:
      return "chw";
    case roleNames.PATIENT:
      return "patients";
    case roleNames.PRACTITIONER:
      return "practitioners";
    default:
      return {
        error: `Unknown role type ${role}`
      };
  }
};
