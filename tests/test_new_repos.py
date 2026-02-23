import pytest
from playwright.sync_api import Page, expect

def test_markitdown_selection(page_on_index: Page):
    """Test MarkItDown repository selection and script generation"""
    page_on_index.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")
    
    # Select MarkItDown
    page_on_index.select_option("#repoSelect", label="MarkItDown (New)")
    
    # Generate
    page_on_index.click("button:has-text('Continue to Scripts')")
    page_on_index.wait_for_timeout(500)
    
    # Check Setup Script
    setup_code = page_on_index.locator("#setupCode").inner_text()
    assert "pip install ." in setup_code

def test_frappe_docker_selection(page_on_index: Page):
    """Test Frappe Docker repository selection and script generation"""
    page_on_index.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")
    
    # Select Frappe Docker via value since label might change with stars
    page_on_index.select_option("#repoSelect", value="https://github.com/frappe/frappe_docker.git")
    
    # Generate
    page_on_index.click("button:has-text('Continue to Scripts')")
    page_on_index.wait_for_timeout(500)
    
    # Check Setup Script
    setup_code = page_on_index.locator("#setupCode").inner_text()
    assert "cp .env.sample .env" in setup_code
    
    # Check Server Script
    page_on_index.click(".carousel-nav.next")
    page_on_index.wait_for_timeout(300)
    page_on_index.click(".carousel-nav.next")
    page_on_index.wait_for_timeout(300)
    
    server_code = page_on_index.locator("#serverCode").inner_text()
    assert "docker-compose up -d" in server_code

def test_frappe_press_selection(page_on_index: Page):
    """Test Frappe Press repository selection and script generation"""
    page_on_index.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")
    
    page_on_index.select_option("#repoSelect", value="https://github.com/frappe/press.git")
    
    page_on_index.click("button:has-text('Continue to Scripts')")
    page_on_index.wait_for_timeout(500)
    
    setup_code = page_on_index.locator("#setupCode").inner_text()
    assert "bench get-app https://github.com/frappe/press" in setup_code

def test_frappe_payments_selection(page_on_index: Page):
    """Test Frappe Payments repository selection and script generation"""
    page_on_index.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")
    
    page_on_index.select_option("#repoSelect", value="https://github.com/frappe/payments.git")
    
    page_on_index.click("button:has-text('Continue to Scripts')")
    page_on_index.wait_for_timeout(500)
    
    setup_code = page_on_index.locator("#setupCode").inner_text()
    assert "bench --site mysite.local install-app payments" in setup_code

def test_frappe_helm_selection(page_on_index: Page):
    """Test Frappe Helm repository selection and script generation"""
    page_on_index.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")
    
    page_on_index.select_option("#repoSelect", value="https://github.com/frappe/helm.git")
    
    page_on_index.click("button:has-text('Continue to Scripts')")
    page_on_index.wait_for_timeout(500)
    
    setup_code = page_on_index.locator("#setupCode").inner_text()
    assert "helm repo add frappe" in setup_code

def test_commit_repo_selection(page_on_index: Page):
    """Test 'commit' repository selection and script generation"""
    page_on_index.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")
    
    # Select commit using value
    page_on_index.select_option("#repoSelect", value="https://github.com/guilatrova/commit.git")
    
    # Generate
    page_on_index.click("button:has-text('Continue to Scripts')")
    page_on_index.wait_for_timeout(500)
    
    # Check Setup Script
    setup_code = page_on_index.locator("#setupCode").inner_text()
    assert "pip install commit" in setup_code

def test_fix_repo_selection(page_on_index: Page):
    """Test 'fix' repository selection and script generation"""
    page_on_index.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")
    
    # Select fix using value
    page_on_index.select_option("#repoSelect", value="https://pypi.org/project/fix/")
    
    # Generate
    page_on_index.click("button:has-text('Continue to Scripts')")
    page_on_index.wait_for_timeout(500)
    
    # Check Setup Script
    setup_code = page_on_index.locator("#setupCode").inner_text()
    assert "pip install fix" in setup_code

def test_bookwyrm_selection(page_on_index: Page):
    """Test BookWyrm repository selection and script generation"""
    page_on_index.wait_for_selector("#repoSelect option:nth-child(2)", state="attached")
    
    # Select BookWyrm using value
    page_on_index.select_option("#repoSelect", value="https://github.com/bookwyrm-social/bookwyrm.git")
    
    # Generate
    page_on_index.click("button:has-text('Continue to Scripts')")
    page_on_index.wait_for_timeout(500)
    
    # Check Setup Script
    setup_code = page_on_index.locator("#setupCode").inner_text()
    assert "python3 manage.py init_db" in setup_code
    assert "pip install -r requirements.txt" in setup_code
    assert "DOMAIN=localhost:8000" in setup_code
