export const createHeaders = (headersContent: Array<[string, string]>) => {
  const headers = new Headers();

  for (let header in headersContent) {
    const [key, value] = header;
    headers.set(key, value);
  }

  return headers;
};
