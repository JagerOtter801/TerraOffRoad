import requests
from bs4 import BeautifulSoup
import os

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
}
URL = "https://www.evicore.com/provider/clinical-guidelines"
STATE_FILE = "last_known_guideline.txt"

def get_latest_url():
    try:
        response = requests.get(URL, headers=HEADERS, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # EviCore often nests these in accordion-style divs. 
        # We'll search for any link that contains "Oncology" and "Imaging" in the URL or Text
        for link in soup.find_all('a', href=True):
            href = link['href']
            # Search the text inside the link AND the href attribute
            link_text = link.get_text(strip=True).lower()
            link_href = href.lower()
            
            if "oncology" in link_text or "oncology" in link_href:
                if "imaging" in link_text or "imaging" in link_href:
                    if ".pdf" in link_href:
                        # Construct absolute URL
                        full_url = href if href.startswith('http') else f"https://www.evicore.com{href}"
                        return full_url
        
        # Backup: Search for the specific February 2026 version string if text matches fail
        for link in soup.find_all('a', href=True):
            if "2026" in link['href'] and "oncology" in link['href'].lower():
                return f"https://www.evicore.com{link['href']}" if link['href'].startswith('/') else link['href']

    except Exception as e:
        print(f"Scraper Error: {e}")
    return "NOT_FOUND"

full_state_path = os.path.join(os.getcwd(), STATE_FILE)
latest_url = get_latest_url()

if os.path.exists(full_state_path):
    with open(full_state_path, "r") as f:
        old_url = f.read().strip()
else:
    old_url = "INITIAL_RUN"

# Determine change status
is_new = "true" if latest_url != "NOT_FOUND" and latest_url != old_url else "false"

# Update file if new
if is_new == "true":
    with open(full_state_path, "w") as f:
        f.write(latest_url)

# Write to GitHub Output
if "GITHUB_OUTPUT" in os.environ:
    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        f.write(f"NEW_GUIDELINE_FOUND={is_new}\n")
        f.write(f"URL={latest_url}\n")
