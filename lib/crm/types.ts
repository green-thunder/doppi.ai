import type { Role } from "@prisma/client";

/** The subset of the session user that is safe to hand to client components. */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
  locale: string;
  org: {
    id: string;
    name: string;
    slug: string;
    currency: string;
  };
}

export function toPublicUser(u: {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
  locale: string;
  org: { id: string; name: string; slug: string; currency: string };
}): PublicUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatarColor: u.avatarColor,
    locale: u.locale,
    org: {
      id: u.org.id,
      name: u.org.name,
      slug: u.org.slug,
      currency: u.org.currency,
    },
  };
}

/** A lightweight option used by <select> menus (owner pickers, etc.). */
export interface Option {
  value: string;
  label: string;
}
