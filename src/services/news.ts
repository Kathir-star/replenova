export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
  url?: string;
}

const DEMO_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    headline: 'Cyclone Mandous disrupts maritime container movements at Port of Chennai',
    source: 'Maritime Executive Dispatch',
    publishedAt: '2 hours ago',
    sentiment: 'critical',
  },
  {
    id: 'news-2',
    headline: 'Semiconductor manufacturers report delayed Asia-India ocean transit times',
    source: 'Supply Chain Dive Global',
    publishedAt: '4 hours ago',
    sentiment: 'negative',
  },
  {
    id: 'news-3',
    headline: 'JNPT Mumbai terminal expands dedicated inland rail cargo handling capacity',
    source: 'Logistics Insider India',
    publishedAt: '12 hours ago',
    sentiment: 'positive',
  },
  {
    id: 'news-4',
    headline: 'Automotive tier-1 suppliers activate multi-echelon buffer stock safety protocols',
    source: 'AutoTech Procurement Review',
    publishedAt: '1 day ago',
    sentiment: 'neutral',
  }
];

export async function fetchSupplyChainNews(): Promise<{ news: NewsItem[]; isLive: boolean }> {
  const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;

  if (!newsApiKey) {
    return { news: DEMO_NEWS, isLive: false };
  }

  try {
    const res = await fetch(`https://newsapi.org/v2/everything?q=supply+chain+port+disruption&sortBy=publishedAt&apiKey=${newsApiKey}`);
    if (!res.ok) throw new Error('News API failure');
    const json = await res.json();

    const formatted = json.articles?.slice(0, 6).map((art: any, index: number) => ({
      id: `live-news-${index}`,
      headline: art.title,
      source: art.source?.name || 'Global Logistics News',
      publishedAt: new Date(art.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: art.title.toLowerCase().includes('disrupt') || art.title.toLowerCase().includes('delay') ? 'negative' : 'neutral',
      url: art.url,
    })) || DEMO_NEWS;

    return { news: formatted, isLive: true };
  } catch {
    return { news: DEMO_NEWS, isLive: false };
  }
}
