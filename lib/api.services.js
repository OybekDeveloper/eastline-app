"use server";
const baseUrl = process.env.BACK_URL;
export async function getData(url, tag) {
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      method: "GET",
      next: { tags: [`${tag}`], revalidate: 86400 },
      redirect: "follow",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch ${url}. Status: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error(
        `Unexpected content-type for ${url}: ${contentType}. Expected JSON.`
      );
      return [];
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${baseUrl}${url}:`, error);
    return [];
  }
}

export async function postData(endpoint, data, tag) {
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }), // Send tag in body
    });
    const result = await response.json();
    console.log(result);
    if (result.error) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return error; // Xatolik bo'lsa, `null` qaytariladi
  }
}
export async function revalidateUpdate(tag) {
  const url = `${baseUrl}/api/revalidate`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }), // Send tag in body
    });

    const result = await response.json().catch(() => null);

    return result;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return error; // Xatolik bo'lsa, `null` qaytariladi
  }
}

export async function putData(endpoint, data, tag) {
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }), // Send tag in body
    });
    const result = await response.json();
    console.log(result);

    if (result.error) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null; // Xatolik bo'lsa, `null` qaytariladi
  }
}

export async function patchData(endpoint, data, tag) {
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }), // Send tag in body
    });
    const result = await response.json();
    console.log(result);

    if (result.error) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null; // Xatolik bo'lsa, `null` qaytariladi
  }
}

export async function deleteData(endpoint, tag) {
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      redirect: "follow",
    });
    await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag }), // Send tag in body
    });
    const result = await response.json();
    console.log(result);

    if (result.error) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null; // Xatolik bo'lsa, `null` qaytariladi
  }
}
