import { ROLES } from "../enum";

export type User = {
  user: {
    id: number;
    email: string;
    name: string;
    username: string;
    role: ROLES;
  };
  token: string;
};
