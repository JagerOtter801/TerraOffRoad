import requests
from bs4 import BeautifulSoup
import os

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
URL = "https://www.evicore.com/provider/clinical-guidelines"
STATE_FILE = "last_known_guideline.txt"

def get_latest_url():
    try:
        # Increase timeout for corporate sites
        response = requests.get(URL, headers=HEADERS, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # More robust search: look for any 'a' tag where 'oncology' and 'imaging' appear in href or text
        for link in soup.find_all('a', href=True):
            href = link['href'].lower()
            text = link.get_text().lower()
            if "oncology" in href and "imaging" in href and ".pdf" in href:
                full_url = link['href']
                if full_url.startswith('/'):
                    return f"https://www.evicore.com{full_url}"
                return full_url
    except Exception as e:
        print(f"DEBUG: Scraper Error - {e}")
    return "NOT_FOUND" # Return a string instead of None to prevent 'Invalid format' errors

full_state_path = os.path.join(os.getcwd(), STATE_FILE)
latest_url = get_latest_url()

if os.path.exists(full_state_path):
    with open(full_state_path, "r") as f:
        old_url = f.read().strip()
else:
    old_url = "NO_PRIOR_STATE"

is_new = "true" if latest_url != "NOT_FOUND" and latest_url != old_url else "false"

if is_new == "true":
    with open(full_state_path, "w") as f:
        f.write(latest_url)

# Correctly write to GITHUB_OUTPUT
if "GITHUB_OUTPUT" in os.environ:
    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        f.write(f"NEW_GUIDELINE_FOUND={is_new}\n")
        f.write(f"URL={latest_url}\n")
