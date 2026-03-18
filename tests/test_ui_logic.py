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
