/** Missing credentials allow guest checkout; invalid credentials never do. */
export async function resolveAccessSession(request) {
  if (!request.headers.authorization) return null;
  try {
    await request.jwtVerify();
  } catch {
    throw Object.assign(new Error('Invalid or expired access token'), { statusCode: 401 });
  }
  if (request.user?.type !== 'access' || !request.user.sub) {
    throw Object.assign(new Error('An access token is required'), { statusCode: 401 });
  }
  const account = await request.server.prisma.user.findUnique({
    where: { id: request.user.sub },
    select: { role: true, isActive: true }
  });
  if (!account || !account.isActive) {
    throw Object.assign(new Error('Account is no longer active'), { statusCode: 401 });
  }
  request.user.role = account.role;
  return request.user.sub;
}
