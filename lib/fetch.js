export const fetcher = (...args) => {
  return fetch(...args).then(async (res) => {
    let payload;
    try {
      if (res.status === 204) return null; // 204 does not have body
      payload = await res.json();
    } catch (e) {
      /* noop */
    }
    if (res.ok) {
      return payload;
    } else {
     
      const errorMessage = payload?.error?.message || payload?.message || 'Something went wrong';
      console.error(`Error: ${errorMessage} (Status: ${res.status})`);
      return Promise.reject(new Error(errorMessage));
    }
  });
};
