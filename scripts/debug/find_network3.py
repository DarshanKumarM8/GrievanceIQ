with open("src/routes/api.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

in_route = False
for line in lines:
    if "apiRoutes.get('/analytics/network'" in line:
        in_route = True
    if in_route:
        print(line.rstrip())
        # Let's break if we hit the end of the route
        if line.startswith('})'):
            break
