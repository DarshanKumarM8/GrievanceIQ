import { XMLParser } from "fast-xml-parser";

const feeds = [
  "https://pib.gov.in/RssMain.aspx",
  "https://www.thehindu.com/news/national/feeder/default.rss",
  "https://indianexpress.com/feed/",
  "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
  "https://feeds.feedburner.com/ndtvnews-india-news"
];
const keywords = ["CPGRAMS", "PM-KISAN", "EPFO", "pension", "grievance"];

async function run() {
  const parser = new XMLParser({ processEntities: false, htmlEntities: false });
  for (const url of feeds) {
    try {
      const res = await fetch(url);
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const jsonObj = parser.parse(text);
      const items = jsonObj.rss?.channel?.item || [];
      const matched = items.filter(i => keywords.some(k => ((i.title || '') + (i.description || '')).includes(k)));
      console.log(`[${url}] Fetched: ${items.length} | Matched: ${matched.length}`);
      matched.slice(0, 3).forEach(m => console.log(` - ${m.title}`));
    } catch (e) {
      console.error(`Error on ${url}:`, e.message);
    }
  }
}
run();
