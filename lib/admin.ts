export function getAdminEmails(): string[] {
  const adminEmailsString = process.env.ADMIN_EMAILS;

  if (!adminEmailsString) {
    console.warn("ADMIN_EMAILS não está definido no arquivo .env");
    return [];
  }

  try {
    return adminEmailsString
      .split(",")
      .map((email) => email.trim().toLowerCase());
  } catch (error) {
    console.error("Erro ao processar ADMIN_EMAILS:", error);
    return [];
  }
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;

  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}
