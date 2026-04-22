import pdfplumber
with pdfplumber.open("/Users/jason/darshan/GrievanceIQ/python-pipeline/DARPG_Monthly_Report_Central_March_2026.pdf") as pdf:
    for i in range(5):
        print(f"--- Page {i+1} ---")
        print(pdf.pages[i].extract_text())
