import { generateToast } from "@/app/_global_components/generateToast";

const getData = async <T>(path: string): Promise<T> => {
  try {
    const headers = new Headers();

    const response = await fetch(`${path}`, { headers });
    if (!response.ok) {
      const {error} = await response.json();
      generateToast("error", error);
      throw new Error(error);
    }
    const result = (await response.json()) as T;
    return result;
  } catch (error) {
    console.error("getData Error:", error);
    generateToast("error", (error as Error).message);
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
      generateToast("error", error);
      throw new Error(error);
    }

    const result = (await response.json()) as T;
    generateToast("success", "Data created successfully");
    return result;
  } catch (error) {
    console.error("createData Error:", error);
    generateToast("error", (error as Error).message);
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
      generateToast("error", error);
      throw new Error(error);
    }

    const result = (await response.json()) as T;
    generateToast("success", "Data deleted successfully");
    return result;
  } catch (error) {
    console.error("deleteData Error:", error);
    generateToast("error", (error as Error).message);
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
      generateToast("error", errData.error || "Something went wrong");
      throw new Error(errData.error || "Failed to update data");
    }

    const result = (await response.json()) as T;
    generateToast("success", "Data updated successfully");
    return result;
  } catch (error) {
    console.error("updateData Error:", error);
    generateToast("error", (error as Error).message);
    throw error;
  }
};


export { getData, createData, deleteData, updateData };
