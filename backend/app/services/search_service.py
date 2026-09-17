import urllib.parse
from typing import Dict, Any, List

SEARCH_ENGINES = {
    "google": "https://www.google.com/search?q=",
    "youtube": "https://www.youtube.com/results?search_query=",
    "news": "https://news.google.com/search?q=",
    "technology": "https://www.google.com/search?q=technology+",
    "academic": "https://scholar.google.com/scholar?q="
}

class SearchService:
    def perform_search(self, query: str, category: str = "google") -> Dict[str, Any]:
        cleaned_query = query.strip()
        encoded = urllib.parse.quote_plus(cleaned_query)
        base_url = SEARCH_ENGINES.get(category.lower(), SEARCH_ENGINES["google"])
        target_url = base_url + encoded

        # Provide category structured metadata and safe browser redirect links
        providers = [
            {"name": "Google Web", "url": f"https://www.google.com/search?q={encoded}", "type": "web"},
            {"name": "Google Scholar (Academic)", "url": f"https://scholar.google.com/scholar?q={encoded}", "type": "academic"},
            {"name": "YouTube Intel", "url": f"https://www.youtube.com/results?search_query={encoded}", "type": "video"},
            {"name": "Google News Intelligence", "url": f"https://news.google.com/search?q={encoded}", "type": "news"},
            {"name": "arXiv Research", "url": f"https://arxiv.org/search/?query={encoded}&searchtype=all", "type": "research"}
        ]

        return {
            "query": cleaned_query,
            "category": category,
            "target_url": target_url,
            "providers": providers,
            "instructions": "Direct tactical search queries dispatched to real-time external intelligence providers."
        }


search_service = SearchService()
