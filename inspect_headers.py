with open("src/pages/dashboard.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "from-navy-" in line or "from-indigo-" in line or "from-purple-" in line or "from-slate-" in line:
        print(f"L{i+1}: {line.strip()}")
        # Check next 2 lines
        for j in range(1, 3):
            if i+j < len(lines):
                print(f"L{i+j+1}: {lines[i+j].strip()}")
        print("---")
