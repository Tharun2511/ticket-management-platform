export type GuestRole = "sysadmin" | "projectAdmin" | "resolver" | "client";

interface GuestCredential {
  email: string;
  password: string;
  label: string;
  description: string;
}

export const GUEST_CREDENTIALS: Record<GuestRole, GuestCredential> = {
  sysadmin: {
    email: "admin@system.com",
    password: "admin123",
    label: "System Admin",
    description: "Full platform access",
  },
  projectAdmin: {
    email: "projadmin@acme.com",
    password: "projadmin123",
    label: "Project Admin",
    description: "Assigns & closes tickets",
  },
  resolver: {
    email: "resolver@acme.com",
    password: "resolver123",
    label: "Resolver",
    description: "Works & resolves tickets",
  },
  client: {
    email: "client@acme.com",
    password: "client123",
    label: "Client",
    description: "Creates & verifies tickets",
  },
};
