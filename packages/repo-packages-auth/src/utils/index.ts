export const checkKVBeCreated = (): boolean => {
  try {
    return !!AUTH_TOKENS;
  } catch (error) {
    return false;
  }
};
