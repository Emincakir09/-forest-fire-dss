import joblib
import pandas as pd
import numpy as np

def tahmin_et(yeni_veri_dict):
    # 1. Kaydedilen model ve ölçeklendiriciyi (scaler) yükle
    try:
        model = joblib.load('best_forest_fire_model.joblib')
        scaler = joblib.load('scaler.joblib')
    except Exception as e:
        print(f"Hata: Model dosyaları bulunamadı! Önce eğitimi tamamlamalısınız. \n{e}")
        return

    # 2. Gelen veriyi tablo formatına çevir
    yeni_df = pd.DataFrame([yeni_veri_dict])
    
    # 3. Veriyi modelin eğitimde gördüğü formata getir (Ölçeklendirme)
    yeni_df_scaled = scaler.transform(yeni_df)
    
    # 4. Tahmin yap
    tahmin = model.predict(yeni_df_scaled)[0]
    olasilik = model.predict_proba(yeni_df_scaled)[0] # [0 olma ihtimali, 1 olma ihtimali]
    
    # 5. Sonucu yazdır
    print("\n--- YENİ VERİ TAHMİN SONUCU ---")
    if tahmin == 1:
        print(f"SONUÇ: YANGIN RİSKİ VAR! (Sınıf 1)")
        print(f"Güven Oranı: %{olasilik[1]*100:.2f}")
    else:
        print(f"SONUÇ: YANGIN RİSKİ DÜŞÜK. (Sınıf 0)")
        print(f"Güven Oranı: %{olasilik[0]*100:.2f}")

if __name__ == "__main__":
    # Tam Tersi 50/50 Senaryosu: Hava Serin ve Rüzgarsız ama Doğa Kupkuru
    # GÜVENLİ Lehine (Serin, yağışsız ama rüzgarsız): Temp, Wind, Slope
    # YANGIN Lehine (Aşırı kuraklık, ölü bitkiler, insan yoğunluğu): NDVI, NDWI, BSI, Prec
    uydurma_bolge = {
        'Feat1_Elev': 200,   # YANGIN: Alçak rakım (daha sıcak olma potansiyeli)
        'Feat2_Slop': 5,     # GÜVENLİ: Düz arazi (yangın yavaş yayılır)
        'Feat3_Aspe': 180,   # YANGIN: Güney bakı (güneşi dik alır, kurudur)
        'Feat4_NDVI': 0.05,  # YANGIN: Bitki örtüsü tamamen ölmüş/kurumuş
        'Feat5_NDWI': -0.4,  # YANGIN: Toprakta zerre nem yok (çöl gibi)
        'Feat6_BSI_': 0.8,   # YANGIN: Çıplak yanıcı madde çok fazla
        'Feat7_EVI_': 0.05,  # YANGIN: Orman sağlığı bitmiş
        'Feat8_Temp': 280,   # GÜVENLİ: 7 derece (Hava buz gibi)
        'Feat9_Prec': 0.0,   # YANGIN: Hiç yağış yok (Uzun süreli kuraklık)
        'Feat10_U_W': 0.1,   # GÜVENLİ: Yaprak kıpırdamıyor (Rüzgar yok)
        'Feat11_V_W': 0.1,   # GÜVENLİ: Yaprak kıpırdamıyor (Rüzgar yok)
        'Feat12_Dew': 270,   # YANGIN: Hava çok kuru (Nem oranı çok düşük)
        'Feat13_Pop': 10,    # GÜVENLİ: İnsan yok (Ateş yakacak kimse yok)
        'Feat14_Lan': 30,    # YANGIN: Kolay yanabilen arazi tipi
        'Feat15_LAI': 1.0    # YANGIN: Çok az yaprak var
    }
    
    tahmin_et(uydurma_bolge)
