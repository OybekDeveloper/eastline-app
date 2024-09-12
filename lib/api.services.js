import axios from "axios";

const cache = new Map(); // Cache uchun oddiy Map obyekti

export const ApiService = {
  async getData(url, tagName) {
    const cacheKey = `${url}_${tagName}`;
    
    // Agar cache'da mavjud bo'lsa, cache'dan qaytaramiz
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    // API so'rovi
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}${url}`, {
      next: { tags: [`${tagName}`] },
    });
    
    const data = response?.data?.data;

    // Ma'lumotni cache'ga qo'shamiz
    cache.set(cacheKey, data);

    return data;
  },

  // Cache'dan ma'lumotni o'chirish uchun funksiya
  clearCache(url, tagName) {
    const cacheKey = `${url}_${tagName}`;
    cache.delete(cacheKey);
  },
};
