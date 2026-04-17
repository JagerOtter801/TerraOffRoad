import requests
from bs4 import BeautifulSoup
import os

# The page containing the links
URL = "https://www.evicore.com/provider/clinical-guidelines"
# Search for this specific string in the PDF links
SEARCH_TERM = "Oncology%20Imaging" 
STATE_FILE = "last_known_guideline.txt"

def get_latest_url():
    try:
        response = requests.get(URL, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        for link in soup.find_all('a', href=True):
            if SEARCH_TERM in link['href']:
                return link['href']
    except Exception as e:
        print(f"Error: {e}")
    return None

latest_url = get_latest_url()

# Read the previous URL
if os.path.exists(STATE_FILE):
    with open(STATE_FILE, "r") as f:
        old_url = f.read().strip()
else:
    old_url = ""

# Determine if we found a change
is_new = "false"
if latest_url and latest_url != old_url:
    is_new = "true"
    with open(STATE_FILE, "w") as f:
        f.write(latest_url)

# This part is crucial for the YAML to work
if "GITHUB_OUTPUT" in os.environ:
    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        f.write(f"NEW_GUIDELINE_FOUND={is_new}\n")
        f.write(f"URL={latest_url}\n")
else:
    # Fallback for local testing
    print(f"NEW_GUIDELINE_FOUND={is_new}")
    print(f"URL={latest_url}")
