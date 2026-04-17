import requests
from bs4 import BeautifulSoup
import os

# The page containing the links
URL = "https://www.evicore.com/provider/clinical-guidelines"
# Search for this specific string in the PDF links
SEARCH_TERM = "Oncology%20Imaging" 

def get_latest_url():
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    for link in soup.find_all('a', href=True):
        if SEARCH_TERM in link['href']:
            return link['href']
    return None

latest_url = get_latest_url()
old_url_file = "last_known_guideline.txt"

# Read the previous URL
if os.path.exists(old_url_file):
    with open(old_url_file, "r") as f:
        old_url = f.read().strip()
else:
    old_url = ""

if latest_url and latest_url != old_url:
    print(f"NEW_GUIDELINE_FOUND=true")
    print(f"URL={latest_url}")
    with open(old_url_file, "w") as f:
        f.write(latest_url)
else:
    print("NEW_GUIDELINE_FOUND=false")
