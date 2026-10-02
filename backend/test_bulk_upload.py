import requests

url = "http://127.0.0.1:8000/api/screenings/3/upload-resumes/"

file1 = r"C:\Users\Krishna Agrawal\Downloads\Rahul_Sharma_Resume (1).pdf"
file2 = r"C:\Users\Krishna Agrawal\Downloads\Krishna_Agrawal_Resume.pdf"

with open(file1, "rb") as f1, open(file2, "rb") as f2:

    files = [
        ("resumes", ("Rahul_Sharma_Resume.pdf", f1, "application/pdf")),
        ("resumes", ("Krishna_Agrawal_Resume.pdf", f2, "application/pdf")),
    ]

    response = requests.post(url, files=files)

print(response.status_code)
print(response.text)