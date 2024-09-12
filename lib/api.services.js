import axios from "axios";

export const ApiService = {
  async getData(url, tagName) {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACK_URL}${url}`,
      {
        cache: "no-store",
      }
    );
    return response?.data?.data;
  },
};
