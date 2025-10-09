from playwright.sync_api import sync_playwright, expect
import os

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Get the absolute path to the index.html file
    file_path = os.path.abspath("index.html")

    # Navigate to the local HTML file
    page.goto(f"file://{file_path}")

    # Expect the menu page to be visible
    expect(page.locator("#menu-page")).to_be_visible()

    # Click the "Escanear Ingreso" button
    page.get_by_role("button", name="Escanear Ingreso").click()

    # Expect the scanner page to be visible
    expect(page.locator("#scanner-page")).to_be_visible()
    expect(page.locator("#scanner-title")).to_have_text("Escanear Ingreso")

    # Take a screenshot of the scanner page
    page.screenshot(path="jules-scratch/verification/scanner_page.png")

    # Click the back button
    page.get_by_role("button", name="‹").click()

    # Expect the menu page to be visible again
    expect(page.locator("#menu-page")).to_be_visible()

    browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)

print("Verification script executed successfully.")