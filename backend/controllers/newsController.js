const { fetchAllFeeds } = require('../utils/rssFetcher');

// GET /api/news
const getNews = async (req, res) => {
  try {
    const { category } = req.query;
    let articles = await fetchAllFeeds();
    if (category && category !== 'All') {
      articles = articles.filter(a => a.category === category);
    }
    res.json({ articles, total: articles.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNews };
