export type StoredUserRole = "player" | "operator" | "admin" | "narrador";

export type StoredUser = {
  id: string;
  name: string;
  clan?: string;
  codeHash: string;
  role?: StoredUserRole;
};
