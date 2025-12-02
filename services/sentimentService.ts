
import { SentimentNewsItem } from "../types";

// Raw GitHub URL for "today.json" from voidful/tw_news_stocker
// Note: Using jsdelivr CDN for better reliability and CORS handling compared to raw.githubusercontent
const GITHUB_DATA_URL = "https://cdn.jsdelivr.net/gh/voidful/tw_news_stocker@main/docs/data/today.json";

export const fetchSentimentData = async (symbol: string, name: string): Promise<SentimentNewsItem[]> => {
  try {
    const response = await fetch(GITHUB_DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch sentiment data: ${response.statusText}`);
    }

    const allNews: SentimentNewsItem[] = await response.json();
    
    // Filter news related to the current stock
    // Matches if the symbol (e.g., "2330") or name (e.g., "台積電") appears in title, tags, or stock_id
    const filteredNews = allNews.filter(item => {
      const titleMatch = item.title.includes(symbol) || item.title.includes(name);
      const stockIdMatch = item.stock_id && item.stock_id.includes(symbol);
      const tagMatch = item.tags && item.tags.some(tag => tag.includes(name) || tag.includes(symbol));
      
      return titleMatch || stockIdMatch || tagMatch;
    });

    return filteredNews;

  } catch (error) {
    console.error("Error fetching sentiment data:", error);
    return [];
  }
};
