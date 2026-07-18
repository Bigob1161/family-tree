export function getBasePath(): string {
  return process.env.NODE_ENV === "production" ? "/family-tree" : "";
}

export function navigateTo(path: string) {
  const base = getBasePath();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  window.location.href = `${base}${normalized}`;
}

export function getPagePath(path: string): string {
  const base = getBasePath();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
