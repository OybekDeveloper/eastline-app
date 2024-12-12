export const ApiService = {
  async getData(url, tagName) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}${url}`, {
      next: {
        tags: [tagName],
        revalidate: 1200,
      },
    });
    const { data } = await response.json();
    return data;
  },
};
