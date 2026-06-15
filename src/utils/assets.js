export const getPublicAssetPath = (path = '') => {
  if (/^(https?:|data:|blob:)/.test(path)) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = String(path).replace(/^\/+/, '');

  return `${normalizedBase}${normalizedPath}`;
};
