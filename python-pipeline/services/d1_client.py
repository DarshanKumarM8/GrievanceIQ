"""
GrievanceIQ Pipeline — Cloudflare D1 REST API Client / Local SQLite fallback
Handles all database operations via the Cloudflare REST API, or local SQLite if no API tokens.
"""

import httpx
import sqlite3
import glob
import os
from typing import Any, Optional
from config import CF_ACCOUNT_ID, CF_D1_DATABASE_ID, CF_D1_API_TOKEN

def get_local_db_path():
    # Find the local wrangler D1 sqlite file
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    paths = glob.glob(os.path.join(root_dir, ".wrangler", "state", "v3", "d1", "miniflare-D1DatabaseObject", "*.sqlite"))
    if paths:
        return paths[0]
    return None

class D1Client:
    """Client for Cloudflare D1 database via REST API or local SQLite."""

    def __init__(self):
        self.use_local = not (CF_ACCOUNT_ID and CF_D1_DATABASE_ID and CF_D1_API_TOKEN)
        self.local_db_path = get_local_db_path() if self.use_local else None
        
        self.base_url = (
            f"https://api.cloudflare.com/client/v4/accounts/"
            f"{CF_ACCOUNT_ID}/d1/database/{CF_D1_DATABASE_ID}/query"
        ) if not self.use_local else None
        
        self.headers = {
            "Authorization": f"Bearer {CF_D1_API_TOKEN}",
            "Content-Type": "application/json",
        } if not self.use_local else None

    async def query(self, sql: str, params: Optional[list] = None) -> list[dict[str, Any]]:
        """Execute a SELECT query and return rows."""
        if self.use_local:
            if not self.local_db_path:
                raise Exception("Local D1 database not found. Run 'npm run db:reset' first.")
            # Map SQLite parameters ? to SQLite parameter list
            with sqlite3.connect(self.local_db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute(sql, params or [])
                rows = cursor.fetchall()
                return [dict(row) for row in rows]

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

    async def execute(self, sql: str, params: Optional[list] = None) -> dict[str, Any]:
        """Execute an INSERT/UPDATE/DELETE statement."""
        if self.use_local:
            if not self.local_db_path:
                raise Exception("Local D1 database not found. Run 'npm run db:reset' first.")
            with sqlite3.connect(self.local_db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(sql, params or [])
                conn.commit()
                return {
                    "changes": cursor.rowcount,
                    "last_row_id": cursor.lastrowid,
                }

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
        """Execute multiple SQL statements in a batch."""
        if self.use_local:
            if not self.local_db_path:
                raise Exception("Local D1 database not found. Run 'npm run db:reset' first.")
            results = []
            with sqlite3.connect(self.local_db_path) as conn:
                cursor = conn.cursor()
                for stmt in statements:
                    try:
                        cursor.execute(stmt["sql"], stmt.get("params") or [])
                        results.append({"success": True, "changes": cursor.rowcount})
                    except Exception as e:
                        results.append({"success": False, "error": str(e)})
                conn.commit()
            return results

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
