import asyncio
import sys
sys.path.insert(0, 'python-pipeline')
from services.datagov_fetcher import fetch_datagov_history

async def test():
    res2 = await fetch_datagov_history()
    print(res2)

asyncio.run(test())
