# Menggunakan image dasar Python 3.10-slim agar ukuran image kecil
FROM python:3.10-slim

# Mencegah Python membuat file .pyc (bytecode)
ENV PYTHONDONTWRITEBYTECODE=1
# Mencegah Python melakukan buffering pada stdout dan stderr (berguna untuk logging di Docker)
ENV PYTHONUNBUFFERED=1

# Menentukan direktori kerja di dalam container
WORKDIR /app

# Menyalin file requirements.txt ke direktori kerja
COPY requirements.txt .

# Menginstal dependensi Python
RUN pip install --no-cache-dir -r requirements.txt

# Menyalin seluruh kode proyek ke direktori kerja
COPY . .

# Secara default, jalankan script pengujian
CMD ["python", "test.py"]
