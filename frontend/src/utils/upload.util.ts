export const getImageURL = (aliasPath: string) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
  return `${baseURL}${aliasPath}`;
};
