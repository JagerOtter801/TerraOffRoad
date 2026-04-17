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
        response = requests.get(URL, headers=HEADERS, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # We look for the Cigna/Oncology PDF specifically
        for link in soup.find_all('a', href=True):
            href = link['href']
            # Using the keywords from your example link
            if "oncology" in href.lower() and "imaging" in href.lower() and ".pdf" in href.lower():
                # If it's already a full URL (like the one you sent), return it
                if href.startswith('http'):
                    return href
                # Otherwise, prepend the domain
                return f"https://www.evicore.com{href}"
                
    except Exception as e:
        print(f"Scraper Error: {e}")
    return "NOT_FOUND"

full_state_path = os.path.join(os.getcwd(), STATE_FILE)
latest_url = get_latest_url()

if os.path.exists(full_state_path):
    with open(full_state_path, "r") as f:
        old_url = f.read().strip()
else:
    old_url = "NO_PRIOR_STATE"

# Determine if there is a change
is_new = "true" if latest_url != "NOT_FOUND" and latest_url != old_url else "false"

if is_new == "true":
    with open(full_state_path, "w") as f:
        f.write(latest_url)

# Write to GitHub Output for the YAML to read
if "GITHUB_OUTPUT" in os.environ:
    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        f.write(f"NEW_GUIDELINE_FOUND={is_new}\n")
        f.write(f"URL={latest_url}\n")
