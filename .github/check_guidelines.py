import requests
from bs4 import BeautifulSoup
import os

# Standard headers to avoid 403 Forbidden errors
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
URL = "https://www.evicore.com/provider/clinical-guidelines"
STATE_FILE = "last_known_guideline.txt"

def get_latest_url():
    try:
        response = requests.get(URL, headers=HEADERS, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # We look for any link containing 'Oncology' and 'Imaging'
        for link in soup.find_all('a', href=True):
            href = link['href']
            # SDET logic: check for keywords and ensure it's a PDF
            if "oncology" in href.lower() and "imaging" in href.lower() and ".pdf" in href.lower():
                # Handle relative URLs by prepending the domain
                if href.startswith('/'):
                    return f"https://www.evicore.com{href}"
                return href
    except Exception as e:
        print(f"Scraper encountered an error: {e}")
    return None

# Force the script to look at the repo root for the state file
# os.getcwd() returns the root directory in a GitHub Action environment
full_state_path = os.path.join(os.getcwd(), STATE_FILE)

latest_url = get_latest_url()

# Read previous state
if os.path.exists(full_state_path):
    with open(full_state_path, "r") as f:
        old_url = f.read().strip()
else:
    old_url = "NO_PRIOR_STATE"

# Determine if we have a fresh change
is_new = "false"
if latest_url and latest_url != old_url:
    is_new = "true"
    # Update the text file so we don't flag the same link tomorrow
    with open(full_state_path, "w") as f:
        f.write(latest_url)

# Print logs for the GitHub Action Console
print(f"DEBUG: Live Link: {latest_url}")
print(f"DEBUG: Saved Link: {old_url}")

# This writes to the specific environment file GitHub Actions uses for variables
if "GITHUB_OUTPUT" in os.environ:
    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        f.write(f"NEW_GUIDELINE_FOUND={is_new}\n")
        f.write(f"URL={latest_url}\n")
else:
    # Local terminal testing
    print(f"NEW_GUIDELINE_FOUND={is_new}")
    print(f"URL={latest_url}")
