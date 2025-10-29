
from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Get the absolute path to the HTML file
        file_path = os.path.abspath('index.html')

        page.goto(f'file://{file_path}')

        # Take a screenshot of the initial view
        page.screenshot(path='jules-scratch/verification/initial_view.png')

        # Click the "Descargar" button
        page.click('#install-button')

        # Take a screenshot after clicking the button
        page.screenshot(path='jules-scratch/verification/after_click.png')

        browser.close()

if __name__ == '__main__':
    run()
