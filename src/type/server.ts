export type responseActions = {
  error?: string;
  success?: string;
};

export type Session = {
  error: boolean;
  user: {
    id: string;
    username: string;
    password: string;
    role: string;
  } | null;
};
