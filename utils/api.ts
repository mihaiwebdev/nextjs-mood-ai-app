const createURL = (path: string) => {
  return window.location.origin + path;
};

export const updateEntry = async (id: string, content: string) => {
  const request = new Request(createURL(`/api/journal/${id}`), {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });

  const res = await fetch(request);

  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    throw new Error("Failed to update entry");
  }
};

export const createNewEntry = async () => {
  const request = new Request(createURL("/api/journal"), {
    method: "POST",
  });

  const res = await fetch(request);

  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    throw new Error("Failed to create new entry");
  }
};
