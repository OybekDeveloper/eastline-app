export const ApiService = {
  async getData(url, tagName) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}${url}`, {
      next: { tags: [`${tagName}`] },
      cache: "no-cache",
      cache: "no-store",
    });
    const { data } = await response.json();
    console.log(data);

    return data;
  },
};
