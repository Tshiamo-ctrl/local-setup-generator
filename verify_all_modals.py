import os
import sys
from playwright.sync_api import sync_playwright

def main():
    index_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "index.html"))
    file_uri = f"file://{index_path}"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(file_uri)
        
        # Test 1: Mobile Viewport 480px Base
        page.set_viewport_size({"width": 480, "height": 800})
        page.wait_for_selector("body", state="attached")
        
        def check_overflow(ctx=""):
            has_scroll = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            if has_scroll:
                print(f"FAILED: Horizontal overflow detected during {ctx}")
                sys.exit(1)
        
        check_overflow("Initial Load")

        # Test 2: Checking Run App Modal
        page.click("text='Run as App'")
        page.wait_for_selector("#runAppModal", state="visible")
        check_overflow("Run App Modal Open")
        page.evaluate("document.getElementById('runAppModal').style.display='none'; document.getElementById('runAppOverlay').style.display='none';")

        # Test 3: Checking Archive Workspace Modal
        page.click("text='Archive Workspace'")
        page.wait_for_selector("#archiveModal", state="visible")
        check_overflow("Archive Workspace Modal Open")
        page.evaluate("document.getElementById('archiveModal').style.display='none'; document.getElementById('archiveOverlay').style.display='none';")

        # Test 4: Interactions with custom config
        page.select_option("#repoSelect", value="custom")
        check_overflow("Custom Repo Form Display")
        
        print("SUCCESS: All interactive elements were fully verified on mobile width (480px). No horizontal cutoffs detected.")
        browser.close()

if __name__ == "__main__":
    main()
