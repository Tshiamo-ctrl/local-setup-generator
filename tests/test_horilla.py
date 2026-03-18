import pytest
from playwright.sync_api import Page, expect

def test_horilla_hrm_script_generation(page_on_index: Page):
    page_on_index.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")
    page_on_index.select_option("#repoSelect", value="https://github.com/horilla-opensource/horilla.git")
    page_on_index.click("button:has-text('Continue to Scripts')")
    page_on_index.wait_for_timeout(500)
    
    setup_code = page_on_index.locator("#setupCode").inner_text()
    
    # Verify sed command for tracking fix
    assert "sed -i 's/.*check_linkedin.*/#&/' recruitment/urls.py" in setup_code
    # Verify headless python script
    assert "Initializing AHRM Database headless..." in setup_code
    assert "Employee.objects.create(employee_user_id=user," in setup_code

def test_horilla_crm_script_generation(page_on_index: Page):
    page_on_index.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")
    page_on_index.select_option("#repoSelect", value="https://github.com/horilla-opensource/horilla-crm.git")
    page_on_index.click("button:has-text('Continue to Scripts')")
    page_on_index.wait_for_timeout(500)
    
    setup_code = page_on_index.locator("#setupCode").inner_text()
    
    # Verify headless python script via cat password
    assert "INIT_PW=$(cat .init_password" in setup_code
    assert "User.objects.create_superuser('admin', 'admin@example.com', '${INIT_PW}')" in setup_code
