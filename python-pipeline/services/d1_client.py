"""
GrievanceIQ Pipeline — Cloudflare D1 REST API Client
Handles all database operations via the Cloudflare REST API.
"""

import httpx
from typing import Any
from config import CF_ACCOUNT_ID, CF_D1_DATABASE_ID, CF_D1_API_TOKEN


class D1Client:
    """Client for Cloudflare D1 database via REST API."""

    def __init__(self):
        self.base_url = (
            f"https://api.cloudflare.com/client/v4/accounts/"
            f"{CF_ACCOUNT_ID}/d1/database/{CF_D1_DATABASE_ID}/query"
        )
        self.headers = {
            "Authorization": f"Bearer {CF_D1_API_TOKEN}",
            "Content-Type": "application/json",
        }

    async def query(self, sql: str, params: list | None = None) -> list[dict[str, Any]]:
        """Execute a SELECT query and return rows."""
        payload = {"sql": sql}
        if params:
            payload["params"] = params

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                self.base_url, json=payload, headers=self.headers
            )
            response.raise_for_status()
            data = response.json()

        if not data.get("success"):
            errors = data.get("errors", [])
            raise Exception(f"D1 query failed: {errors}")

        results = data.get("result", [])
        if results and len(results) > 0:
            return results[0].get("results", [])
        return []

    async def execute(self, sql: str, params: list | None = None) -> dict[str, Any]:
        """Execute an INSERT/UPDATE/DELETE statement."""
        payload = {"sql": sql}
        if params:
            payload["params"] = params

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                self.base_url, json=payload, headers=self.headers
            )
            response.raise_for_status()
            data = response.json()

        if not data.get("success"):
            errors = data.get("errors", [])
            raise Exception(f"D1 execute failed: {errors}")

        results = data.get("result", [])
        if results and len(results) > 0:
            meta = results[0].get("meta", {})
            return {
                "changes": meta.get("changes", 0),
                "last_row_id": meta.get("last_row_id"),
                "rows_read": meta.get("rows_read", 0),
                "rows_written": meta.get("rows_written", 0),
            }
        return {"changes": 0}

    async def batch_execute(self, statements: list[dict]) -> list[dict[str, Any]]:
        """Execute multiple SQL statements in a batch.
        
        Each statement is a dict with 'sql' and optional 'params' keys.
        """
        # D1 REST API doesn't support native batch, so we execute sequentially
        results = []
        for stmt in statements:
            try:
                result = await self.execute(stmt["sql"], stmt.get("params"))
                results.append({"success": True, **result})
            except Exception as e:
                results.append({"success": False, "error": str(e)})
        return results

    async def health_check(self) -> bool:
        """Verify D1 connection is working."""
        try:
            rows = await self.query("SELECT 1 as ok")
            return len(rows) > 0 and rows[0].get("ok") == 1
        except Exception:
            return False


# Singleton instance
d1 = D1Client()
