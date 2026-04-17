import requests
from bs4 import BeautifulSoup
import os
import re

# Standard headers to mimic a real browser request
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
}
URL = "https://www.evicore.com/provider/clinical-guidelines"
STATE_FILE = "last_known_guideline.txt"

def get_latest_url():
    try:
        response = requests.get(URL, headers=HEADERS, timeout=30)
        response.raise_for_status()
        content = response.text
        
        # --- STRATEGY 1: REGEX GREEDY SEARCH ---
        # This looks for the raw URL pattern in the source code, 
        # which often catches links hidden in JavaScript accordions.
        pattern = r'\/sites\/default\/files\/clinical-guidelines\/[0-9-]+\/[a-zA-Z0-9_%.-]*Oncology%20Imaging[a-zA-Z0-9_%.-]*\.pdf'
        matches = re.findall(pattern, content)
        
        if matches:
            found_path = matches[0]
            return f"https://www.evicore.com{found_path}" if found_path.startswith('/') else found_path

        # --- STRATEGY 2: BEAUTIFULSOUP FALLBACK ---
        soup = BeautifulSoup(content, 'html.parser')
        for link in soup.find_all('a', href=True):
            href = link['href']
            # Search both the href and the actual visible link text
            if "oncology" in href.lower() and "imaging" in href.lower() and ".pdf" in href.lower():
                return href if href.startswith('http') else f"https://www.evicore.com{href}"
                
    except Exception as e:
        print(f"Scraper Error: {e}")
    
    return "NOT_FOUND"

# Ensure we are operating out of the repository root
full_state_path = os.path.join(os.getcwd(), STATE_FILE)
latest_url = get_latest_url()

# Load the prior baseline from your .txt file
if os.path.exists(full_state_path):
    with open(full_state_path, "r") as f:
        old_url = f.read().strip()
else:
    # Fallback to your known February 2026 URL if the file doesn't exist yet
    old_url = "https://www.evicore.com/sites/default/files/clinical-guidelines/2025-10/Cigna_Oncology%20Imaging%20Guidelines_V1.0.2026_eff02.03.2026_PUB10.30.2025.pdf"

# --- CORE LOGIC ---
is_new = "false"
status = "ACTIVE"

if latest_url == "NOT_FOUND":
    status = "BLIND (Scraper could not find link on page)"
    display_url = old_url # Send the last known working link so the email isn't useless
elif latest_url != old_url:
    is_new = "true"
    display_url = latest_url
    # Update the .txt file so we don't alert again tomorrow
    with open(full_state_path, "w") as f:
        f.write(latest_url)
else:
    display_url = latest_url

# --- GITHUB ACTIONS HANDOFF ---
if "GITHUB_OUTPUT" in os.environ:
    with open(os.environ["GITHUB_OUTPUT"], "a") as f:
        f.write(f"NEW_GUIDELINE_FOUND={is_new}\n")
        f.write(f"URL={display_url}\n")
        f.write(f"SCRAPER_STATUS={status}\n")
else:
    # Local CLI testing output
    print(f"NEW_GUIDELINE_FOUND: {is_new}")
    print(f"URL: {display_url}")
    print(f"SCRAPER_STATUS: {status}")
