import httpx
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import List, Dict, Any

RSS_FEEDS = {
    "top": "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
    "india": "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
    "world": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
    "technology": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
    "ai": "https://news.google.com/rss/search?q=Artificial%20Intelligence%20AI&hl=en-US&gl=US&ceid=US:en",
    "business": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
    "science": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
    "education": "https://news.google.com/rss/search?q=Education&hl=en-US&gl=US&ceid=US:en",
    "entertainment": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
}

DEMO_NEWS = [
    {
        "headline": "Quantum Computing Milestone Achieved with Fault-Tolerant Logical Qubits",
        "source": "Quantum Tech Review",
        "time": "Just now",
        "summary": "Researchers demonstrate breakthrough coherence times and quantum error correction routines.",
        "url": "https://news.google.com",
        "category": "Technology",
        "is_demo": True
    },
    {
        "headline": "Next-Generation Autonomous Systems Demonstrate Collaborative Reasoning",
        "source": "AI Global Monitor",
        "time": "1 hour ago",
        "summary": "Distributed neural agent frameworks coordinate mission telemetry in multi-agent environments.",
        "url": "https://news.google.com",
        "category": "AI",
        "is_demo": True
    },
    {
        "headline": "Global Clean Fusion Facility Completes High-Temperature Plasma Pulse",
        "source": "Energy Horizon",
        "time": "3 hours ago",
        "summary": "Advanced superconducting tokamak sustains sustained fusion reaction exceeding prior benchmarks.",
        "url": "https://news.google.com",
        "category": "Science",
        "is_demo": True
    }
]


class NewsService:
    async def get_news(self, category: str = "top", query: str = "") -> Dict[str, Any]:
        category_key = category.lower().strip()
        url = RSS_FEEDS.get(category_key, RSS_FEEDS["top"])
        
        if query:
            url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"

        articles = []
        is_live = False

        try:
            async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
                res = await client.get(url, headers={"User-Agent": "Mozilla/5.0 J.A.R.V.I.S./2.0"})
                if res.status_code == 200:
                    root = ET.fromstring(res.text)
                    items = root.findall("./channel/item")
                    
                    for item in items[:15]:
                        title = item.findtext("title", "Headline unavailable")
                        link = item.findtext("link", "https://news.google.com")
                        pub_date = item.findtext("pubDate", "")
                        source_tag = item.find("source")
                        source = source_tag.text if source_tag is not None else "Global Wire"
                        
                        # Clean title if source is in title
                        headline = title
                        if " - " in title:
                            headline_parts = title.rsplit(" - ", 1)
                            headline = headline_parts[0]
                            if source == "Global Wire":
                                source = headline_parts[1]

                        articles.append({
                            "headline": headline,
                            "source": source,
                            "time": pub_date or "Recent",
                            "summary": f"Latest dispatch from {source} regarding {category_key.upper()} developments.",
                            "url": link,
                            "category": category.capitalize(),
                            "is_demo": False
                        })
                    if articles:
                        is_live = True
        except Exception:
            pass

        if not articles:
            # Fallback to clearly marked demo feed if external network is blocked
            articles = DEMO_NEWS

        return {
            "status": "ONLINE" if is_live else "DEMO",
            "is_demo": not is_live,
            "category": category,
            "articles": articles
        }


news_service = NewsService()
