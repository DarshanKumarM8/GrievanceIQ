import asyncio, httpx, pdfplumber, re
from io import BytesIO

async def main():
    url = "https://darpg.gov.in/sites/default/files/DARPG_Monthly_Report_Central_March_2026.pdf"
    async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
        res = await client.get(url)
        pdf_bytes = res.content
    
    with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages[:20]:
            text = page.extract_text()
            if text:
                for line in text.split('\n'):
                    if any(x in line.lower() for x in ['ministry', 'department', 'board']):
                        print(line)

asyncio.run(main())
