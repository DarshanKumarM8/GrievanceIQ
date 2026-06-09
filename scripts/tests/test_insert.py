import asyncio
import sys
sys.path.insert(0, 'python-pipeline')
from services.darpg_fetcher import fetch_darpg_data
from services.datagov_fetcher import fetch_datagov_history

async def test():
    print("DARPG:")
    res1 = await fetch_darpg_data()
    print(res1)
    print("DATAGOV:")
    res2 = await fetch_datagov_history()
    print(res2)

asyncio.run(test())
