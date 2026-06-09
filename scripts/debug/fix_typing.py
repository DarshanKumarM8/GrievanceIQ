import os
import re

for root, dirs, files in os.walk("python-pipeline"):
    for file in files:
        if file.endswith(".py"):
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            new_content = content.replace(" | None", "")
            
            if new_content != content:
                with open(path, "w") as f:
                    f.write(new_content)
