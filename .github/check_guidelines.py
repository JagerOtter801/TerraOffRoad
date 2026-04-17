import requests
from bs4 import BeautifulSoup
import os

# Updated to a more modern User-Agent for 2026
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}
URL = "https://www.evicore.com/provider/clinical-guidelines"
STATE_FILE = "last_known_guideline.txt"

def get_latest_url():
    try:
        response = requests.get(URL, headers=HEADERS, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Search all links for the Oncology Imaging PDF keywords
        for link in soup.find_all('a', href=True):
            href = link['href']
            # Search href and link text for maximum coverage
            link_text = link.get_text().lower()
            if "oncology" in href.lower() and "imaging" in href.lower() and ".pdf" in href.lower():
                if href.startswith('http'):
                    return href
                return f"https://www.evicore.com{href}"
    except Exception as e:
        print(f"Scraper Error: {e}")
    return "NOT_FOUND"

# Ensure pathing is relative to repo root
full_state_path = os.path.join(os.getcwd(), STATE_FILE)
latest_url = get_latest_url()

# Load baseline
if os.path.exists(full_state_path):
    with open(full_state_path, "r") as f:
        old_url = f.read().strip()
else:
    # Use the example URL you provided as the default baseline if file is missing
    old_url = "https://www.evicore.com/sites/default/files/clinical-guidelines/2025-10/Cigna_Oncology%20Imaging%20Guidelines_V1.0.2026_eff02.03.2026_PUB10.30.2025.pdf"

# LOGIC:
# 1. We only flag 'true' if we found a valid URL AND it's different from the saved one.
# 2. We set 'SCRAPER_STATUS' to inform the email body.
is_new = "false"
status = "ACTIVE"

if latest_url == "NOT_FOUND":
    status = "BLIND (Link not found on page)"
    # We display the old_url so the email at least has a working link
    display_url = old_url 
elif latest_url != old_url:
    is_new = "true"
    display_url = latest_url
    with open(full_state_path, "w") as f:
        f.write(latest_url)
else:
    display_url = latest_url

# Final Hand-off to GitHub Actions
if "GITHUB_OUTPUT" in os.environ:
    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        f.write(f"NEW_GUIDELINE_FOUND={is_new}\n")
        f.write(f"URL={display_url}\n")
        f.write(f"SCRAPER_STATUS={status}\n")
else:
    print(f"NEW_GUIDELINE_FOUND={is_new}")
    print(f"URL={display_url}")
    print(f"SCRAPER_STATUS={status}")
