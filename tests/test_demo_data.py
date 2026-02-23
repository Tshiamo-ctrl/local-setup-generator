
import pytest
from playwright.sync_api import Page, expect

def test_server_port_config(page: Page):
    """
    Test that changing the server port updates the generated script.
    """
    page.goto("file:///home/tmo/Documents/Horilla_setup_generator_app/index.html")
    
    # Wait for population
    page.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")

    # Select Horilla HRM
    page.select_option("#repoSelect", value="https://github.com/horilla-opensource/horilla.git")
    
    # Change Port
    page.fill("#serverPort", "9090")
    
    # Generate
    page.click("text=Continue to Scripts")
    
    # Verify Content in Server Script
    page.click("button[onclick=\"switchTab(event, 'server')\"]")
    server_code = page.locator("#serverCodeTab").text_content()
    
    assert "PORT=9090" in server_code
    assert "python3 manage.py runserver 0.0.0.0:9090" in server_code

def test_horilla_auth_note_visibility(page: Page):
    """
    Verify that Horilla Auth Note is visible for Horilla repos and hidden for others.
    """
    page.goto("file:///home/tmo/Documents/Horilla_setup_generator_app/index.html")
    
    # 1. Select Horilla HRM (Should show note)
    page.select_option("#repoSelect", value="https://github.com/horilla-opensource/horilla.git")
    expect(page.locator("#horillaAuthNote")).to_be_visible()
    
    # Verify content of note
    note_text = page.locator("#horillaAuthNote").text_content()
    assert "d3f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d" in note_text
    
    # 2. Select a non-Horilla repo (e.g. Django CMS) -> Should hide note
    # Finding a non-horilla repo URL from repos.js (approximate)
    # Assuming the dropdown has other django options.
    # We can select "Custom" to be safe or another known one if available.
    page.select_option("#repoSelect", value="custom") 
    expect(page.locator("#horillaAuthNote")).not_to_be_visible()

def test_load_demo_removed(page: Page):
    """
    Verify that Load Demo Data checkbox is NOT present.
    """
    page.goto("file:///home/tmo/Documents/Horilla_setup_generator_app/index.html")
    expect(page.locator("#loadDemo")).not_to_be_visible()
