export const setTempSessionStorage = (key: string, data: any) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};
export const getTempSessionStorage = (key: string) => {
  return sessionStorage.getItem(key);
};
export const removeTempSessionStorage = (key: string) => {
  sessionStorage.removeItem(key);
};
