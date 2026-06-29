import type { Role } from "./types";

export interface Permissions {
  showAdministration: boolean;
  showUsersRoles: boolean;
  showReports: boolean;
  showExports: boolean;
  scopedToPole: boolean;
  canCreateSeance: boolean;
  canEditAnySeance: boolean;
  canApproveSeance: boolean;
  canExportPdfAll: boolean;
}

export const PERMISSIONS: Record<Role, Permissions> = {
  dir_pedagogique: {
    showAdministration: true,
    showUsersRoles: true,
    showReports: true,
    showExports: true,
    scopedToPole: false,
    canCreateSeance: true,
    canEditAnySeance: true,
    canApproveSeance: true,
    canExportPdfAll: true,
  },
  chef_pole: {
    showAdministration: true,
    showUsersRoles: false,
    showReports: true,
    showExports: true,
    scopedToPole: true,
    canCreateSeance: true,
    canEditAnySeance: false,
    canApproveSeance: true,
    canExportPdfAll: false,
  },
  formateur: {
    showAdministration: false,
    showUsersRoles: false,
    showReports: false,
    showExports: false,
    scopedToPole: true,
    canCreateSeance: false,
    canEditAnySeance: false,
    canApproveSeance: false,
    canExportPdfAll: false,
  },
};

export const ROLE_LABELS: Record<Role, string> = {
  dir_pedagogique: "Directeur Pédagogique",
  chef_pole: "Chef de Pôle",
  formateur: "Formateur",
};
