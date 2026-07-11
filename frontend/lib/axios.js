const api = {
  get: async (url) => {
    const fetchUrl = url.startsWith('/') ? `/api${url}` : url;
    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return { data };
  },
  post: async (url, body) => {
    const fetchUrl = url.startsWith('/') ? `/api${url}` : url;
    const res = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return { data };
  },
  put: async (url, body) => {
    const fetchUrl = url.startsWith('/') ? `/api${url}` : url;
    const res = await fetch(fetchUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return { data };
  },
  delete: async (url) => {
    const fetchUrl = url.startsWith('/') ? `/api${url}` : url;
    const res = await fetch(fetchUrl, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return { data };
  }
};

export default api;
