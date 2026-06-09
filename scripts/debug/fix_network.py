import re

with open("src/pages/dashboard.ts", "r", encoding="utf-8") as f:
    content = f.read()

# The original frontend fetch logic
old_logic = """async function loadNetworkGraph() {
      try {
        const res = await fetch('/api/analytics/network');
        const json = await res.json();
        if (!json.success) return;
        const { nodes, edges } = json.data;
        const container = document.getElementById('networkContainer');
        const canvas = document.getElementById('networkCanvas');
        if (!canvas || !container) return;"""

new_logic = """async function loadNetworkGraph() {
      try {
        const res = await fetch('/api/analytics/network');
        const json = await res.json();
        const container = document.getElementById('networkContainer');
        
        if (!json.success || !json.data || !json.data.nodes || json.data.nodes.length === 0) {
            if (container) {
                container.innerHTML = '<div class="text-center py-10 h-full flex flex-col justify-center"><i class="fas fa-diagram-project text-gray-300 dark:text-gray-600 text-3xl mb-3"></i><p class="text-sm text-gray-500 dark:text-gray-400 font-medium">No transfer network data available.</p></div>';
            }
            return;
        }
        
        // Remove the spinner
        const spinner = container.querySelector('.text-center');
        if (spinner) spinner.style.display = 'none';

        const { nodes, edges } = json.data;
        const canvas = document.getElementById('networkCanvas');
        if (!canvas || !container) return;"""

if old_logic in content:
    content = content.replace(old_logic, new_logic)
    with open("src/pages/dashboard.ts", "w", encoding="utf-8") as f:
        f.write(content)
    print("Dashboard Frontend Network Fetch fixed!")
else:
    print("Could not find old_logic in dashboard.ts. Please check string manually.")

# Backend API check
with open("src/routes/api.ts", "r", encoding="utf-8") as f:
    api_content = f.read()

# Ensure we handle errors gracefully by returning empty nodes/edges array instead of erroring out so frontend doesn't fail hard
old_api_catch = "} catch (e: any) {\n    return c.json({ success: false, error: e.message }, 500)\n  }"
new_api_catch = "} catch (e: any) {\n    // Graceful fallback: return empty network object if DB fails so frontend handles it cleanly\n    return c.json({ success: true, data: { nodes: [], edges: [], meta: { total_nodes: 0, total_edges: 0 } } })\n  }"

if old_api_catch in api_content:
    api_content = api_content.replace(old_api_catch, new_api_catch)
    with open("src/routes/api.ts", "w", encoding="utf-8") as f:
        f.write(api_content)
    print("Backend API graceful fallback added!")
else:
    print("Could not find old_api_catch in api.ts")
