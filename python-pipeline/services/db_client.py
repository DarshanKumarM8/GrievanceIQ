"""
GrievanceIQ Pipeline — Supabase Database Client
Replaces D1 REST API with direct Supabase REST calls.

Usage:
    from services.db_client import db

    # Query (SELECT)
    rows = await db.query("SELECT * FROM ministry_stats WHERE year = $1", [2026])

    # Execute (INSERT/UPDATE/DELETE)
    result = await db.execute("INSERT INTO ... VALUES ($1, $2)", ["val1", "val2"])

Supabase REST API is used for simplicity — no need for asyncpg/psycopg2.
This keeps the Python pipeline dependency-light and Render-friendly.

Falls back to local SQLite (Wrangler D1 dev DB) if SUPABASE_URL is not set.
"""

import httpx
import sqlite3
import glob
import os
import json
import logging
from typing import Any, Optional

from config import SUPABASE_URL, SUPABASE_SERVICE_KEY

logger = logging.getLogger("grievanceiq-pipeline.db")


def get_local_db_path():
    """Find the local wrangler D1 sqlite file for dev mode."""
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    paths = glob.glob(os.path.join(root_dir, ".wrangler", "state", "v3", "d1", "miniflare-D1DatabaseObject", "*.sqlite"))
    if paths:
        return paths[0]
    return None


class SupabaseClient:
    """
    Database client that uses Supabase REST API in production
    and local SQLite in development.
    
    For SQL queries, uses Supabase's PostgREST or the SQL execution endpoint.
    For simple CRUD, uses the REST API directly.
    """

    def __init__(self):
        self.use_supabase = bool(SUPABASE_URL and SUPABASE_SERVICE_KEY)
        self.local_db_path = get_local_db_path() if not self.use_supabase else None

        if self.use_supabase:
            # Supabase REST API base URL
            self.rest_url = f"{SUPABASE_URL}/rest/v1"
            self.headers = {
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation",
            }
            logger.info("Using Supabase database")
        else:
            logger.info(f"Using local SQLite: {self.local_db_path or 'NOT FOUND'}")

    # ─── REST-based table operations (preferred for Supabase) ───

    async def select(self, table: str, filters: dict = None, limit: int = 1000, order: str = None) -> list[dict]:
        """SELECT rows from a Supabase table using REST API."""
        if not self.use_supabase:
            return await self._local_select(table, filters, limit, order)

        url = f"{self.rest_url}/{table}?limit={limit}"
        if filters:
            for col, val in filters.items():
                url += f"&{col}=eq.{val}"
        if order:
            url += f"&order={order}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Supabase SELECT failed: {response.status_code} {response.text[:200]}")
                return []

    async def insert(self, table: str, data: dict | list[dict], upsert: bool = False) -> list[dict]:
        """INSERT rows into a Supabase table using REST API."""
        if not self.use_supabase:
            return await self._local_insert(table, data)

        url = f"{self.rest_url}/{table}"
        headers = {**self.headers}
        if upsert:
            headers["Prefer"] = "resolution=merge-duplicates,return=representation"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=data if isinstance(data, list) else [data], headers=headers)
            if response.status_code in (200, 201):
                return response.json()
            else:
                logger.error(f"Supabase INSERT failed: {response.status_code} {response.text[:300]}")
                raise Exception(f"Supabase INSERT failed: {response.status_code} — {response.text[:200]}")

    async def update(self, table: str, data: dict, filters: dict) -> list[dict]:
        """UPDATE rows in a Supabase table using REST API."""
        if not self.use_supabase:
            return await self._local_update(table, data, filters)

        url = f"{self.rest_url}/{table}"
        for col, val in filters.items():
            url += f"?{col}=eq.{val}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.patch(url, json=data, headers=self.headers)
            if response.status_code in (200, 204):
                return response.json() if response.text else []
            else:
                logger.error(f"Supabase UPDATE failed: {response.status_code} {response.text[:300]}")
                raise Exception(f"Supabase UPDATE failed: {response.status_code}")

    async def upsert(self, table: str, data: dict | list[dict]) -> list[dict]:
        """UPSERT (INSERT or UPDATE on conflict) using REST API."""
        return await self.insert(table, data, upsert=True)

    async def delete(self, table: str, filters: dict) -> bool:
        """DELETE rows from a Supabase table."""
        if not self.use_supabase:
            return await self._local_delete(table, filters)

        url = f"{self.rest_url}/{table}"
        for col, val in filters.items():
            url += f"?{col}=eq.{val}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.delete(url, headers=self.headers)
            return response.status_code in (200, 204)

    # ─── Raw SQL (for complex queries — uses local SQLite or Supabase RPC) ───

    async def query(self, sql: str, params: Optional[list] = None) -> list[dict[str, Any]]:
        """Execute a SELECT query and return rows. Works with local SQLite."""
        if self.use_supabase:
            # For Supabase, complex SQL queries should use RPC functions
            # or be decomposed into REST calls. For now, log a warning.
            logger.warning(f"Raw SQL query not supported with Supabase REST API. Use select/insert/update instead. SQL: {sql[:80]}")
            return []

        if not self.local_db_path:
            raise Exception("Local D1 database not found. Run 'npm run db:reset' first.")
        with sqlite3.connect(self.local_db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(sql, params or [])
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    async def execute(self, sql: str, params: Optional[list] = None) -> dict[str, Any]:
        """Execute an INSERT/UPDATE/DELETE statement. Works with local SQLite."""
        if self.use_supabase:
            logger.warning(f"Raw SQL execute not supported with Supabase REST API. Use insert/update instead. SQL: {sql[:80]}")
            return {"changes": 0}

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

    # ─── Health Check ───

    async def health_check(self) -> dict:
        """Verify database connection is working."""
        if self.use_supabase:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.get(
                        f"{self.rest_url}/pipeline_runs?limit=1",
                        headers=self.headers
                    )
                    return {
                        "status": "ok" if response.status_code == 200 else "error",
                        "backend": "supabase",
                        "http_status": response.status_code,
                    }
            except Exception as e:
                return {"status": "error", "backend": "supabase", "error": str(e)}
        else:
            try:
                rows = await self.query("SELECT 1 as ok")
                return {
                    "status": "ok" if rows and rows[0].get("ok") == 1 else "error",
                    "backend": "local_sqlite",
                    "path": self.local_db_path,
                }
            except Exception as e:
                return {"status": "error", "backend": "local_sqlite", "error": str(e)}

    # ─── Local SQLite implementations ───

    async def _local_select(self, table, filters, limit, order):
        if not self.local_db_path:
            return []
        where = ""
        params = []
        if filters:
            clauses = []
            for col, val in filters.items():
                clauses.append(f"{col} = ?")
                params.append(val)
            where = " WHERE " + " AND ".join(clauses)
        order_clause = f" ORDER BY {order}" if order else ""
        sql = f"SELECT * FROM {table}{where}{order_clause} LIMIT {limit}"
        return await self.query(sql, params)

    async def _local_insert(self, table, data):
        if not self.local_db_path:
            return []
        rows = data if isinstance(data, list) else [data]
        results = []
        for row in rows:
            cols = ", ".join(row.keys())
            placeholders = ", ".join(["?"] * len(row))
            sql = f"INSERT INTO {table} ({cols}) VALUES ({placeholders})"
            result = await self.execute(sql, list(row.values()))
            results.append({**row, "id": result.get("last_row_id")})
        return results

    async def _local_update(self, table, data, filters):
        if not self.local_db_path:
            return []
        set_clause = ", ".join([f"{k} = ?" for k in data.keys()])
        where_clause = " AND ".join([f"{k} = ?" for k in filters.keys()])
        sql = f"UPDATE {table} SET {set_clause} WHERE {where_clause}"
        params = list(data.values()) + list(filters.values())
        await self.execute(sql, params)
        return [data]

    async def _local_delete(self, table, filters):
        if not self.local_db_path:
            return False
        where_clause = " AND ".join([f"{k} = ?" for k in filters.keys()])
        sql = f"DELETE FROM {table} WHERE {where_clause}"
        await self.execute(sql, list(filters.values()))
        return True


# Singleton instance
db = SupabaseClient()
