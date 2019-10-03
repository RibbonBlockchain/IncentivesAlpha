export const roleNames = {
  SUPER_ADMIN: 0,
  COMMUNITY_HEALTH_WORKER: 1,
  PRACTITIONER: 2,
  PATIENT: 3
};

export const roles = {
  0: "SUPER_ADMIN",
  1: "COMMUNITY_HEALTH_WORKER",
  2: "PRACTITIONER",
  3: "PATIENT"
};

export const allowedRoutes = [
  [
    "/app/practitioners",
    "/app/patients",
    "/app/interactions",
    "/app/health-workers"
  ],
  ["/app/practitioners", "/app/patients", "/app/interactions"],
  [],
  []
];
