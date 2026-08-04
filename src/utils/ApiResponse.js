/** Consistent success envelope across every route. */
export function sendSuccess(res, { statusCode = 200, data = null, meta = null }) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}