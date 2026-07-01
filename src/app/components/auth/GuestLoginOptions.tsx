"use client";

import { GUEST_CREDENTIALS, GuestRole } from "@/constant/guestCreds";
import { useLogin } from "@/hooks/useLogin";
import { Box, Button, Typography, Chip, alpha, useTheme } from "@mui/material";
import {
  Shield,
  FolderSpecial,
  Build,
  Person,
} from "@mui/icons-material";
import { useState, ReactNode } from "react";

const ROLE_CONFIG: Record<
  GuestRole,
  { icon: ReactNode; color: string; tier: string }
> = {
  sysadmin: { icon: <Shield />, color: "#dc2626", tier: "System" },
  projectAdmin: {
    icon: <FolderSpecial />,
    color: "#0891b2",
    tier: "Project",
  },
  resolver: { icon: <Build />, color: "#059669", tier: "Project" },
  client: { icon: <Person />, color: "#d97706", tier: "Project" },
};

const ROLE_ORDER: GuestRole[] = [
  "sysadmin",
  "projectAdmin",
  "resolver",
  "client",
];

export default function GuestLoginOptions() {
  const login = useLogin();
  const [activeRole, setActiveRole] = useState<string>("");
  const theme = useTheme();

  async function handleGuestLogin(role: GuestRole) {
    setActiveRole(role);
    const cred = GUEST_CREDENTIALS[role];
    login.setEmail(cred.email);
    login.setPassword(cred.password);
    await login.submit(cred.email, cred.password);
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Select a role to explore the platform as a guest.
      </Typography>

      {login.error && (
        <Typography color="error" variant="body2" textAlign="center">
          {login.error}
        </Typography>
      )}

      <Box display="flex" flexDirection="column" gap={1}>
        {ROLE_ORDER.map((role) => {
          const cred = GUEST_CREDENTIALS[role];
          const config = ROLE_CONFIG[role];
          const isActive = activeRole === role;

          return (
            <Button
              key={role}
              variant="outlined"
              disabled={login.loading}
              onClick={() => handleGuestLogin(role)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                py: 1.5,
                justifyContent: "flex-start",
                gap: 1.5,
                borderColor: isActive ? config.color : "divider",
                bgcolor: isActive ? alpha(config.color, 0.08) : "transparent",
                "&:hover": {
                  borderColor: config.color,
                  bgcolor: alpha(config.color, 0.04),
                },
              }}
            >
              <Box
                sx={{
                  color: config.color,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {config.icon}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  flex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.primary"
                >
                  {isActive ? "Logging in..." : cred.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cred.description}
                </Typography>
              </Box>
              <Chip
                label={config.tier}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.65rem",
                  height: 20,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? alpha(config.color, 0.15)
                      : alpha(config.color, 0.08),
                  color: config.color,
                }}
              />
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
