
const getData = async <T>(path: string): Promise<T> => {
  try {
    const headers = new Headers();

    const response = await fetch(`${path}`, { headers });
    if (!response.ok) {
      const {error} = await response.json();
      throw new Error(error);
    }
    const result = (await response.json()) as T;
    return result;
  } catch (error) {
    console.error("getData Error:", error);
    throw error;
  }
};

const createData = async <T>(
  path: string,
  contentType: string,

  data?: T
): Promise<T> => {
  try {
    const headers = new Headers();

    headers.append("Content-Type", contentType);

    const response = await fetch(`${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const {error} = await response.json();
      throw new Error(error);
    }

    const result = (await response.json()) as T;
    return result;
  } catch (error) {
    console.error("createData Error:", error);
    throw error;
  }
};

const deleteData = async <T>(path: string): Promise<T> => {
  try {
    const headers = new Headers();

    const response = await fetch(`${path}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
     const {error} = await response.json();
      throw new Error(error);
    }

    const result = (await response.json()) as T;
    return result;
  } catch (error) {
    console.error("deleteData Error:", error);
    throw error;
  }
};


const updateData = async <T>(
  path: string,
  data?: T,
  contentType = "application/json",
  method: "PATCH" | "PUT" = "PUT"
): Promise<T> => {
  try {
    const headers = new Headers();
    if (contentType) headers.append("Content-Type", contentType);

    const response = await fetch(path, {
      method,
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to update data");
    }

    const result = (await response.json()) as T;
    return result;
  } catch (error) {
    console.error("updateData Error:", error);
    throw error;
  }
};


export { getData, createData, deleteData, updateData };
