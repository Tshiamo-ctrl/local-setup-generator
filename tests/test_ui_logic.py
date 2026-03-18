import pytest
from playwright.sync_api import Page, expect



def test_dynamic_config_hiding(page: Page):
    """
    Test that the Admin creation and DB sections are hidden when a repo disables them.
    Django REST Framework sets hasDb: false and hasDemo: false. This should hide and uncheck them.
    """
    import os
    index_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html"))
    # Navigate
    page.goto(f"file://{index_path}")
    page.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")

    # Pick Horilla HRM first to ensure elements are visibly shown (defaults usually show it)
    page.select_option("#repoSelect", value="https://github.com/horilla-opensource/horilla.git")
    
    # Assert elements are visible and checked
    expect(page.locator("#initDbContainer")).to_be_visible()
    expect(page.locator("#createSuperContainer")).to_be_visible()
    expect(page.locator("#initDb")).to_be_checked()
    expect(page.locator("#createSuper")).to_be_checked()

    # Now select Django REST Framework (hasDb: false, meaning hasAdmin is inheritedly false unless overriding)
    page.select_option("#repoSelect", value="https://github.com/encode/django-rest-framework.git")
    
    # Assert they are hidden
    expect(page.locator("#initDbContainer")).to_be_hidden()
    expect(page.locator("#createSuperContainer")).to_be_hidden()
    
    # Assert they are unchecked forcefully by the UI logic
    expect(page.locator("#initDb")).not_to_be_checked()
    expect(page.locator("#createSuper")).not_to_be_checked()

def test_venv_default(page: Page):
    import os
    index_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html"))
    page.goto(f"file://{index_path}")
    page.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")

    page.select_option("#repoSelect", value="https://github.com/horilla-opensource/horilla.git")
    expect(page.locator("#venvName")).to_have_value("venv")

    page.select_option("#repoSelect", value="https://github.com/horilla-opensource/horilla-crm.git")
    expect(page.locator("#venvName")).to_have_value("venv")

def test_mutual_exclusivity(page: Page):
    import os
    index_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html"))
    page.goto(f"file://{index_path}")
    page.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")

    # Select Horilla
    page.select_option("#repoSelect", value="https://github.com/horilla-opensource/horilla.git")
    
    # Check that initDb checking toggles createSuper
    page.uncheck("#initDb")
    page.check("#initDb")
    expect(page.locator("#initDb")).to_be_checked()
    expect(page.locator("#createSuper")).not_to_be_checked()

    # Check that createSuper checking toggles initDb
    page.check("#createSuper")
    expect(page.locator("#createSuper")).to_be_checked()
    expect(page.locator("#initDb")).not_to_be_checked()

def test_responsive_layout(page: Page):
    import os
    index_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html"))
    page.goto(f"file://{index_path}")
    page.wait_for_selector("body", state="attached")

    # Set viewport to a small mobile size
    page.set_viewport_size({"width": 480, "height": 800})
    
    # Check that there is no horizontal scrolling by evaluating scrollWidth vs clientWidth
    has_horizontal_scroll = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
    assert not has_horizontal_scroll, "Page has horizontal scroll at 480px width, layout is overflowing"

    # Now verify at a split-screen 768px width
    page.set_viewport_size({"width": 768, "height": 800})
    has_horizontal_scroll_split = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
    assert not has_horizontal_scroll_split, "Page has horizontal scroll at 768px width, layout is overflowing"
