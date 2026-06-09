import re

darpg_path = "python-pipeline/services/darpg_fetcher.py"
with open(darpg_path, "r") as f:
    darpg_content = f.read()

darpg_content = darpg_content.replace(
    """UPDATE ministry_stats SET
                        complaints_received = ?,
                        complaints_disposed = ?,
                        complaints_pending = ?,
                        avg_resolution_days = ?,
                        official_resolution_rate = ?,
                        data_source = 'darpg_pdf',
                        last_synced_at = ?,
                        month = ?,
                        year = ?
                    WHERE ministry_name = ?""",
    """INSERT INTO ministry_stats (
                        ministry_name,
                        complaints_received,
                        complaints_disposed,
                        complaints_pending,
                        avg_resolution_days,
                        official_resolution_rate,
                        data_source,
                        last_synced_at,
                        month,
                        year
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(ministry_name) DO UPDATE SET
                        complaints_received = excluded.complaints_received,
                        complaints_disposed = excluded.complaints_disposed,
                        complaints_pending = excluded.complaints_pending,
                        avg_resolution_days = excluded.avg_resolution_days,
                        official_resolution_rate = excluded.official_resolution_rate,
                        data_source = excluded.data_source,
                        last_synced_at = excluded.last_synced_at,
                        month = excluded.month,
                        year = excluded.year"""
)

# Fix the parameter ordering
darpg_content = darpg_content.replace(
    """[
                        row.get("received", 0),
                        row.get("disposed", 0),
                        row.get("pending", 0),
                        row.get("avg_days", 0),
                        round(row.get("disposed", 0) / max(row.get("received", 1), 1) * 100, 1),
                        now,
                        current_month,
                        current_year,
                        ministry_name,
                    ],""",
    """[
                        ministry_name,
                        row.get("received", 0),
                        row.get("disposed", 0),
                        row.get("pending", 0),
                        row.get("avg_days", 0),
                        round(row.get("disposed", 0) / max(row.get("received", 1), 1) * 100, 1),
                        'darpg_pdf',
                        now,
                        current_month,
                        current_year,
                    ],"""
)

with open(darpg_path, "w") as f:
    f.write(darpg_content)

datagov_path = "python-pipeline/services/datagov_fetcher.py"
with open(datagov_path, "r") as f:
    datagov_content = f.read()

datagov_content = re.sub(
    r"    if not DATAGOV_API_KEY:.*?return \{.*?\}",
    """    if not DATAGOV_API_KEY or DATAGOV_API_KEY == "your-free-api-key-here":
        logger.warning("DATAGOV_API_KEY not configured. Using realistic mock historical data.")
        return await _generate_mock_history()""",
    datagov_content,
    flags=re.DOTALL
)

with open(datagov_path, "w") as f:
    f.write(datagov_content)

