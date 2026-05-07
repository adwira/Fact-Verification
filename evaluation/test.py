import pandas as pd
import requests
import json
import time

# ==========================================
# KONFIGURASI PENGUJIAN
# ==========================================
API_URL = "http://localhost:8000/api/v1/verify"
INPUT_CSV = "dataset_uji.csv"
OUTPUT_CSV = "hasil_pengujian.csv"

def konversi_label_ai(verdict_text):
    """
    Mengubah teks respons AI menjadi angka ordinal.
    """
    verdict = str(verdict_text).strip().upper()
    if verdict == "FAKTA":
        return 1
    elif verdict == "HOAKS" or verdict == "HOAX":
        return 0
    else:
        # Untuk "TIDAK TERBUKTI", "DISINFORMASI", dll
        return 2

def ekstrak_payload_dari_sse(response):
    """
    Membaca StreamingResponse (SSE) dari FastAPI baris demi baris,
    dan mengekstrak data JSON hanya pada event 'result'.
    """
    for line in response.iter_lines():
        if line:
            decoded_line = line.decode('utf-8')
            # Memastikan format sesuai dengan 'data: {...}' dari backend
            if decoded_line.startswith("data: "):
                json_str = decoded_line[len("data: "):]
                try:
                    data = json.loads(json_str)
                    # Cek tipe event dari backend
                    if data.get("type") == "error":
                        raise Exception(data.get("message"))
                    elif data.get("type") == "result":
                        return data.get("payload")
                except json.JSONDecodeError:
                    continue
    return None

def jalankan_pengujian():
    print(f"[*] Memulai pengujian dari {INPUT_CSV}...")
    
    try:
        df = pd.read_csv(INPUT_CSV)
    except FileNotFoundError:
        print(f"[!] File {INPUT_CSV} tidak ditemukan.")
        return

    hasil_pengujian = []

    for index, row in df.iterrows():
        nomor = row['nomor']
        klaim = row['klaim']
        
        print(f"\n[{nomor}/{len(df)}] Menguji: {klaim[:60]}...")
        
        # Tambahkan bypass_cache=True jika API kamu mendukungnya, 
        # agar tiap tes benar-benar mengeksekusi AI, bukan mengambil data cache.
        payload = {
            "claim": klaim,
            "bypass_cache": False 
        }
        
        try:
            # PENTING: Gunakan 'with' agar socket koneksi langsung dibebaskan setelah selesai membaca stream
            with requests.post(API_URL, json=payload, stream=True, timeout=600) as response:
                
                # Tangani 422 Pydantic secara eksplisit agar mudah di-debug bila teks terlalu pendek
                if response.status_code == 422:
                    raise Exception(f"Input ditolak Backend (Error 422): {response.text}")
                    
                response.raise_for_status() 
                
                # Memproses stream SSE untuk mencari hasil akhir
                hasil_ai = ekstrak_payload_dari_sse(response)
                
                if not hasil_ai:
                    raise Exception("Tidak menemukan event 'result' dari stream API.")
                
                # Mapping ke kolom sesuai skema VerificationResponse
                label_angka = konversi_label_ai(hasil_ai.get("verdict"))
                waktu_verifikasi = hasil_ai.get("verified_at", "N/A")
                
                # Tambahkan "or 0.0" untuk mencegah TypeError bila execution_time tiba-tiba bernilai None
                waktu_eksekusi = hasil_ai.get("execution_time") or 0.0 
                text_hasil = hasil_ai.get("explanation", "")
                
                print(f"    -> Sukses ({waktu_eksekusi:.2f} detik) | Verdict: {hasil_ai.get('verdict')}")
                
                hasil_pengujian.append({
                    "nomor": nomor,
                    "label_verifikasi_hasil_ai": label_angka,
                    "waktu_verifikasi": waktu_verifikasi,
                    "waktu_eksekusi_detik": waktu_eksekusi,
                    "text_hasil_verifikasi": text_hasil
                })
                
        except Exception as e:
            print(f"    -> [!] ERROR pada nomor {nomor}: {e}")
            hasil_pengujian.append({
                "nomor": nomor,
                "label_verifikasi_hasil_ai": -1,
                "waktu_verifikasi": "ERROR",
                "waktu_eksekusi_detik": 0.0,
                "text_hasil_verifikasi": f"Error: {str(e)}"
            })
            
        # Jeda 5 detik antar request untuk menghindari Rate Limit Gemini API
        print("    [*] Jeda 5 detik sebelum klaim berikutnya...")
        time.sleep(5) 

    print(f"\n[*] Menyimpan hasil ke {OUTPUT_CSV}...")
    df_output = pd.DataFrame(hasil_pengujian)
    df_output.to_csv(OUTPUT_CSV, index=False)
    print("[*] Pengujian Batch Selesai!")

if __name__ == "__main__":
    jalankan_pengujian()