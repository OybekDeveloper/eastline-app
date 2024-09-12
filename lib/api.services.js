import axios from "axios";

export const ApiService = {
  async getData(url, tagName) {
    const response = await axios.get(`${process.env.NEXT_APP_BASE_URL}${url}`, {
      next: { tags: [`${tagName}`] },
    });
    return response?.data?.data;
  },
};
