import asyncio, httpx, pdfplumber, re
from io import BytesIO

async def main():
    url = "https://darpg.gov.in/sites/default/files/DARPG_Monthly_Report_Central_March_2026.pdf"
    async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
        res = await client.get(url)
        pdf_bytes = res.content
    
    with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages[:30]:
            text = page.extract_text()
            if text:
                for line in text.split('\n'):
                    if any(x in line.lower() for x in ['ministry', 'department', 'board']):
                        # Find lines with multiple large integers > 100
                        nums = [int(n.replace(',', '')) for n in re.findall(r'\b\d{1,3}(?:,\d{3})*\b', line) if n]
                        if len(nums) >= 2 and any(n > 100 for n in nums):
                            print(line)

asyncio.run(main())
