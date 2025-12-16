const hits = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const record = hits.get(key);
  if (!record || record.expiresAt < now) {
    hits.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

// Cleanup to prevent unbounded growth in dev.
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of hits.entries()) {
    if (value.expiresAt < now) hits.delete(key);
  }
}, 60_000).unref();
