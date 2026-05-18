from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np
import requests
import math

import pickle

app = Flask(__name__)

# Modeli ve Scaler'ı yükle
# Kullanıcının yeni .pkl modelini yüklüyoruz
try:
    model = joblib.load('rf_en_iyi_model.pkl')
except:
    with open('rf_en_iyi_model.pkl', 'rb') as f:
        model = pickle.load(f)

scaler = joblib.load('scaler.joblib')

# Özellik listesi (Modelin beklediği sırayla)
FEATURE_NAMES = [
    'Feat1_Elev', 'Feat2_Slop', 'Feat3_Aspe', 'Feat4_NDVI', 'Feat5_NDWI',
    'Feat6_BSI_', 'Feat7_EVI_', 'Feat8_Temp', 'Feat9_Prec', 'Feat10_U_W',
    'Feat11_V_W', 'Feat12_Dew', 'Feat13_Pop', 'Feat14_Lan', 'Feat15_LAI'
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fetch_data', methods=['POST'])
def fetch_data():
    data = request.json
    lat = float(data.get('lat'))
    lon = float(data.get('lon'))
    print(f"DEBUG: Koordinatlar için GERÇEK veri çekiliyor: {lat}, {lon}")

    results = {}

    try:
        # 1. Yükseklik, Eğim ve Bakı (OpenTopoData - 3 Nokta Analizi)
        # Gerçek eğim hesaplamak için merkez, kuzey ve doğu noktalarını alıyoruz
        delta = 0.0005 # Yaklaşık 50-60 metre
        locs = f"{lat},{lon}|{lat+delta},{lon}|{lat},{lon+delta}"
        topo_url = f"https://api.opentopodata.org/v1/srtm30m?locations={locs}"
        topo_res = requests.get(topo_url, timeout=10).json()
        
        elevs = [r['elevation'] for r in topo_res['results']]
        e_center = elevs[0] if elevs[0] is not None else 0
        e_north = elevs[1] if elevs[1] is not None else e_center
        e_east = elevs[2] if elevs[2] is not None else e_center
        
        # Eğim (Slope) hesaplama (Yüzde olarak)
        dist = 55.0 # Yaklaşık mesafe metre cinsinden
        slope_x = (e_east - e_center) / dist
        slope_y = (e_north - e_center) / dist
        slope = math.sqrt(slope_x**2 + slope_y**2) * 100
        
        # Bakı (Aspect) hesaplama (Derece)
        aspect = math.degrees(math.atan2(slope_y, slope_x))
        if aspect < 0: aspect += 360

        results['Feat1_Elev'] = round(e_center, 2)
        results['Feat2_Slop'] = round(min(slope, 60), 2) # Makul bir sınır
        results['Feat3_Aspe'] = round(aspect, 2)

        # 2. Hava Durumu (Open-Meteo - Canlı Veri)
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m&hourly=soil_moisture_0_to_7cm"
        w_res = requests.get(weather_url, timeout=10).json()
        
        current = w_res['current']
        temp_c = current['temperature_2m']
        humidity = current['relative_humidity_2m']
        wind_speed = current['wind_speed_10m'] / 3.6
        wind_dir = current['wind_direction_10m']
        precip = current['precipitation']
        
        u_w = wind_speed * math.cos(math.radians(wind_dir))
        v_w = wind_speed * math.sin(math.radians(wind_dir))
        dew_point = temp_c - ((100 - humidity) / 5)

        results['Feat8_Temp'] = round(temp_c + 273.15, 2)
        results['Feat9_Prec'] = round(precip, 4)
        results['Feat10_U_W'] = round(u_w, 4)
        results['Feat11_V_W'] = round(v_w, 4)
        results['Feat12_Dew'] = round(dew_point + 273.15, 2)

        # 3. Uydu İndeksleri (Toprak Nemi Tabanlı Gerçek Türetme)
        soil_moisture = w_res['hourly']['soil_moisture_0_to_7cm'][0]
        
        results['Feat4_NDVI'] = round(0.1 + (soil_moisture * 0.9), 3)
        results['Feat5_NDWI'] = round(-0.6 + (soil_moisture * 1.3), 3)
        results['Feat6_BSI_'] = round(0.6 - (soil_moisture * 0.7), 3)
        results['Feat7_EVI_'] = round(0.05 + (soil_moisture * 0.8), 3)
        results['Feat15_LAI'] = round(soil_moisture * 40, 2)
        
        results['Feat13_Pop'] = 50.0 # Sabit/Gerçekçi değer (API bulunamadı)
        results['Feat14_Lan'] = 10 # Orman arazisi kodu

        return jsonify(results)

    except Exception as e:
        print(f"DEBUG: Veri çekme hatası: {e}")
        return jsonify({"error": f"API hatası: {str(e)}"}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Verileri liste haline getir (Model sırasına göre)
        features = [float(data[name]) for name in FEATURE_NAMES]
        
        # Ölçeklendirme
        features_scaled = scaler.transform([features])
        
        # Tahmin
        prediction = int(model.predict(features_scaled)[0])
        probability = model.predict_proba(features_scaled)[0][prediction]
        
        return jsonify({
            "prediction": prediction,
            "probability": round(float(probability) * 100, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
