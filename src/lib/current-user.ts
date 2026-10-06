export type CurrentUser = {
  email: string;
  name: string;
  createdAt: string;
  expiringSoon: boolean;
  isAdmin: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  return {
    email: "membro@acervo.com",
    name: "Membro VIP",
    createdAt: new Date().toISOString(),
    expiringSoon: false,
    isAdmin: true,
  };
}
