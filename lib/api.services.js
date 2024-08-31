import axios from "axios";

export const ApiService = {
  async postData(url, data) {
    const response = await axios({
      method: "POST",
      url: `${"https://eastline-app.vercel.app"}${url}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return response.data.data;
  },
  async getData(url) {
    const response = await axios({
      method: "GET",
      url: `${"https://eastline-app.vercel.app"}${url}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  },
};
