const axios = require('axios');
const xml2js = require('xml2js');

const RSS_FEEDS = [
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'Tech' },
  { url: 'https://hnrss.org/frontpage', source: 'Hacker News', category: 'Dev' },
  { url: 'https://spectrum.ieee.org/rss/fulltext', source: 'IEEE Spectrum', category: 'Engineering' },
  { url: 'https://www.technologyreview.com/feed/', source: 'MIT Tech Review', category: 'Research' },
  { url: 'https://dev.to/feed', source: 'Dev.to', category: 'Dev' },
];

const parseRSS = async (feedConfig) => {
  try {
    const response = await axios.get(feedConfig.url, {
      timeout: 8000,
      headers: { 'User-Agent': 'EduNexus/1.0' }
    });
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);
    const items = result.rss?.channel?.item || [];
    const itemArray = Array.isArray(items) ? items : [items];

    return itemArray.slice(0, 5).map(item => ({
      title: item.title || 'No Title',
      link: item.link || '#',
      description: item.description
        ? item.description.replace(/<[^>]*>/g, '').substring(0, 200)
        : '',
      source: feedConfig.source,
      category: feedConfig.category,
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      image: item['media:content']?.['$']?.url || item['media:thumbnail']?.['$']?.url || '',
    }));
  } catch (error) {
    console.error(`RSS fetch failed for ${feedConfig.source}:`, error.message);
    return [];
  }
};

const fetchAllFeeds = async () => {
  const results = await Promise.allSettled(RSS_FEEDS.map(parseRSS));
  const articles = [];
  results.forEach(r => {
    if (r.status === 'fulfilled') articles.push(...r.value);
  });
  return articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
};

module.exports = { fetchAllFeeds };
