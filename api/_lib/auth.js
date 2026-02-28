export function requireAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return false;
  }
  return auth.slice(7) === process.env.ADMIN_PASSWORD;
}
