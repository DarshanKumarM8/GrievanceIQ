"""Debug: inspect what tables the DARPG PDF actually contains."""
import asyncio, sys, os, logging
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
logging.basicConfig(level=logging.INFO)

from io import BytesIO
import httpx
import pdfplumber

async def main():
    url = "https://darpg.gov.in/sites/default/files/DARPG_Monthly_Report_Central_March_2026.pdf"
    print(f"Downloading {url}...")
    async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
        response = await client.get(url)
        pdf_bytes = response.content
    print(f"Downloaded {len(pdf_bytes)} bytes")

    with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
        print(f"Total pages: {len(pdf.pages)}")
        for i, page in enumerate(pdf.pages[:10]):  # First 10 pages
            tables = page.extract_tables()
            text_snippet = (page.extract_text() or "")[:300]
            print(f"\n--- Page {i+1} ---")
            print(f"  Text snippet: {text_snippet[:200]}...")
            if tables:
                for j, table in enumerate(tables):
                    print(f"  Table {j+1}: {len(table)} rows x {len(table[0]) if table and table[0] else '?'} cols")
                    if table and len(table) >= 1:
                        print(f"    Header: {table[0]}")
                    if table and len(table) >= 2:
                        print(f"    Row 1:  {table[1]}")
                    if table and len(table) >= 3:
                        print(f"    Row 2:  {table[2]}")
            else:
                print("  No tables found")

asyncio.run(main())
