import httpx
import xml.etree.ElementTree as ET
from typing import List, Dict, Any

SPORTS_FEEDS = {
    "cricket": "https://news.google.com/rss/search?q=Cricket%20ICC%20India&hl=en-IN&gl=IN&ceid=IN:en",
    "football": "https://news.google.com/rss/search?q=Football%20Premier%20League%20Champions%20League&hl=en-US&gl=US&ceid=US:en",
    "f1": "https://news.google.com/rss/search?q=Formula%201%20Grand%20Prix&hl=en-US&gl=US&ceid=US:en",
    "tennis": "https://news.google.com/rss/search?q=Tennis%20ATP%20WTA%20Grand%20Slam&hl=en-US&gl=US&ceid=US:en",
    "basketball": "https://news.google.com/rss/search?q=NBA%20Basketball&hl=en-US&gl=US&ceid=US:en",
}

class SportsService:
    async def get_sports(self, category: str = "cricket", tab: str = "live") -> Dict[str, Any]:
        category_key = category.lower().strip()
        feed_url = SPORTS_FEEDS.get(category_key, SPORTS_FEEDS["cricket"])
        
        items = []
        is_live = False

        try:
            async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
                res = await client.get(feed_url, headers={"User-Agent": "Mozilla/5.0 J.A.R.V.I.S./2.0"})
                if res.status_code == 200:
                    root = ET.fromstring(res.text)
                    xml_items = root.findall("./channel/item")
                    
                    for item in xml_items[:10]:
                        title = item.findtext("title", "Sports update")
                        link = item.findtext("link", "https://news.google.com")
                        pub_date = item.findtext("pubDate", "")
                        source_tag = item.find("source")
                        source = source_tag.text if source_tag is not None else "Sports Wire"

                        # Parse title into teams or match summary if available
                        items.append({
                            "title": title,
                            "tournament": f"{category.upper()} Worldwide Circuit",
                            "source": source,
                            "date": pub_date or "Today",
                            "status": "COMPLETED / RECENT" if tab == "recent" else ("SCHEDULED" if tab == "upcoming" else "IN PROGRESS / LIVE"),
                            "score": "Check broadcast feed" if tab == "live" else "N/A",
                            "link": link,
                            "is_demo": False
                        })
                    if items:
                        is_live = True
        except Exception:
            pass

        return {
            "status": "ONLINE" if is_live else "LIVE DATA UNAVAILABLE",
            "is_live_available": is_live,
            "category": category,
            "tab": tab,
            "events": items
        }


sports_service = SportsService()
