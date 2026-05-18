const translations = {
    tr: {
        "badge": "KARAR DESTEK SİSTEMİ (KDS)",
        "header-p": "İtfaiye ve Orman Yönetimi Planlama Arayüzü",
        "scenario-h3": "🛠️ Gelişmiş Senaryo Analizi (15 Parametre)",
        "scenario-p": "Her bir parametreyi değiştirerek risk üzerindeki etkisini gözlemleyin.",
        "tab-topo": "Dağ/Arazi",
        "tab-veg": "Bitki/Uydu",
        "tab-meteo": "Hava Durumu",
        "lbl-elev": "🏔️ Yükseklik (m)",
        "lbl-slop": "📐 Eğim (%)",
        "lbl-aspe": "🧭 Bakı (Derece)",
        "lbl-lan": "🗺️ Arazi Kodu",
        "lbl-ndvi": "🌿 NDVI (Sağlık)",
        "lbl-ndwi": "💧 NDWI (Su Kont.)",
        "lbl-bsi": "🪨 BSI (Çıplaklık)",
        "lbl-evi": "🍃 EVI (Gelişmiş)",
        "lbl-lai": "🌳 LAI (Yaprak)",
        "lbl-temp": "🌡️ Sıcaklık (K)",
        "lbl-prec": "🌧️ Yağış (mm)",
        "lbl-windu": "💨 Rüzgar U (Hız)",
        "lbl-windv": "🌬️ Rüzgar V (Yön)",
        "lbl-dew": "🌫️ Çiğ Noktası",
        "lbl-pop": "👥 Nüfus Etkisi",
        "btn-reset": "🔄 Tümünü Sıfırla",
        "sec-topo": "🏔️ Topografya & Coğrafya",
        "sec-veg": "🍃 Bitki Örtüsü & Uydu",
        "sec-meteo": "☁️ Meteorolojik Koşullar",
        "lbl-elev-short": "Yükseklik (m)",
        "lbl-slop-short": "Eğim (%)",
        "lbl-aspe-short": "Bakı (0-360)",
        "lbl-lan-short": "Arazi Tipi",
        "lbl-ndvi-short": "NDVI (Sağlık)",
        "lbl-ndwi-short": "NDWI (Su)",
        "lbl-bsi-short": "BSI (Çıplak)",
        "lbl-lai-short": "LAI (Yaprak)",
        "lbl-temp-short": "Sıcaklık (K)",
        "lbl-prec-short": "Yağış (mm)",
        "lbl-windu-short": "Rüzgar U",
        "lbl-windv-short": "Rüzgar V",
        "lbl-dew-short": "Çiğ Noktası",
        "btn-predict": "SENARYOYU ANALİZ ET VE KARAR ÜRET"
    },
    en: {
        "badge": "DECISION SUPPORT SYSTEM (DSS)",
        "header-p": "Fire Brigade & Forest Management Planning Interface",
        "scenario-h3": "🛠️ Advanced Scenario Analysis (15 Parameters)",
        "scenario-p": "Observe the impact on risk by changing each parameter.",
        "tab-topo": "Topo/Terrain",
        "tab-veg": "Veg/Satellite",
        "tab-meteo": "Weather",
        "lbl-elev": "🏔️ Elevation (m)",
        "lbl-slop": "📐 Slope (%)",
        "lbl-aspe": "🧭 Aspect (Degrees)",
        "lbl-lan": "🗺️ Land Cover Code",
        "lbl-ndvi": "🌿 NDVI (Health)",
        "lbl-ndwi": "💧 NDWI (Water Cont.)",
        "lbl-bsi": "🪨 BSI (Bare Soil)",
        "lbl-evi": "🍃 EVI (Enhanced)",
        "lbl-lai": "🌳 LAI (Leaf Area)",
        "lbl-temp": "🌡️ Temperature (K)",
        "lbl-prec": "🌧️ Precipitation (mm)",
        "lbl-windu": "💨 Wind U (Speed)",
        "lbl-windv": "🌬️ Wind V (Direction)",
        "lbl-dew": "🌫️ Dew Point",
        "lbl-pop": "👥 Population Effect",
        "btn-reset": "🔄 Reset All",
        "sec-topo": "🏔️ Topography & Geography",
        "sec-veg": "🍃 Vegetation & Satellite",
        "sec-meteo": "☁️ Meteorological Conditions",
        "lbl-elev-short": "Elevation (m)",
        "lbl-slop-short": "Slope (%)",
        "lbl-aspe-short": "Aspect (0-360)",
        "lbl-lan-short": "Land Type",
        "lbl-ndvi-short": "NDVI (Health)",
        "lbl-ndwi-short": "NDWI (Water)",
        "lbl-bsi-short": "BSI (Bare)",
        "lbl-lai-short": "LAI (Leaf)",
        "lbl-temp-short": "Temperature (K)",
        "lbl-prec-short": "Precipitation (mm)",
        "lbl-windu-short": "Wind U",
        "lbl-windv-short": "Wind V",
        "lbl-dew-short": "Dew Point",
        "btn-predict": "ANALYZE SCENARIO AND GENERATE DECISION"
    }
};

let currentLang = 'tr';

function switchLanguage(lang) {
    currentLang = lang;
    
    // Buton aktiflik durumu
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${lang}`).classList.add('active');

    // Tüm i18n elementlerini güncelle
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Bazı özel durumlar (Placeholder veya dinamik metinler)
    const mapBtnFocus = document.querySelector('.map-btn:nth-child(1)');
    const mapBtnToggle = document.getElementById('toggle-btn');
    
    if (lang === 'en') {
        mapBtnFocus.textContent = "📍 Focus on Dataset Region";
        mapBtnToggle.textContent = map.hasLayer(overlayLayer) ? "👁️ Close Susceptibility Layer" : "👁️ Open Susceptibility Layer";
        document.querySelector('.map-overlay h3').textContent = "Select Region from Map";
        document.querySelector('.map-overlay p').textContent = "Data for the clicked point will be fetched automatically.";
        document.querySelector('.map-legend p strong').textContent = "Susceptibility (TIF):";
        const legends = document.querySelectorAll('.legend-item');
        legends[0].lastChild.textContent = " High Sensitivity";
        legends[1].lastChild.textContent = " Medium Sensitivity";
        legends[2].lastChild.textContent = " Low Sensitivity";
    } else {
        mapBtnFocus.textContent = "📍 Veri Seti Bölgesine Odakla";
        mapBtnToggle.textContent = map.hasLayer(overlayLayer) ? "👁️ Duyarlılık Bölgesini Kapat" : "👁️ Duyarlılık Bölgesini Aç";
        document.querySelector('.map-overlay h3').textContent = "Dünya Üzerinden Bölge Seçin";
        document.querySelector('.map-overlay p').textContent = "Tıkladığınız noktanın verileri otomatik çekilecektir.";
        document.querySelector('.map-legend p strong').textContent = "Duyarlılık (TIF):";
        const legends = document.querySelectorAll('.legend-item');
        legends[0].lastChild.textContent = " Yüksek Hassasiyet";
        legends[1].lastChild.textContent = " Orta Hassasiyet";
        legends[2].lastChild.textContent = " Düşük Hassasiyet";
    }
}

// Harita Kurulumu
const map = L.map('map').setView([39.9334, 32.8597], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Duyarlılık Haritası Katmanını Ekle
let overlayLayer = null;
let overlayBounds = null;

fetch('/static/bounds.txt')
    .then(response => response.text())
    .then(text => {
        const [south, west, north, east] = text.split(',').map(Number);
        overlayBounds = [[south, west], [north, east]];
        overlayLayer = L.imageOverlay('/static/overlay.png', overlayBounds, {
            opacity: 0.6,
            interactive: false
        }).addTo(map);
        
        // Haritayı bu bölgeye odakla
        map.fitBounds(overlayBounds);
    })
    .catch(err => console.log("Overlay yüklenemedi."));

function focusOnData() {
    if (overlayBounds) {
        map.fitBounds(overlayBounds, { padding: [50, 50], animate: true, duration: 1.5 });
    } else {
        alert("Veri bölgesi henüz yüklenmedi!");
    }
}

function toggleOverlay() {
    const btn = document.getElementById('toggle-btn');
    if (!overlayLayer) return;

    if (map.hasLayer(overlayLayer)) {
        map.removeLayer(overlayLayer);
        btn.textContent = "👁️ Duyarlılık Bölgesini Aç";
        btn.style.opacity = "0.7";
    } else {
        overlayLayer.addTo(map);
        btn.textContent = "👁️ Duyarlılık Bölgesini Kapat";
        btn.style.opacity = "1";
    }
}

// Karanlık Harita Filtresi (CSS üzerinden de yapılabilir ama bu daha temiz)
document.querySelector('.leaflet-tile-container').style.filter = "brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)";

let currentMarker = null;
let originalValues = {};

// Haritaya Tıklama Olayı
map.on('click', function(e) {
    const { lat, lng } = e.latlng;

    // Marker ekle/güncelle
    if (currentMarker) map.removeLayer(currentMarker);
    currentMarker = L.marker([lat, lng]).addTo(map);

    // Verileri çek
    fetchData(lat, lng);
});

async function fetchData(lat, lng) {
    // Görsel geri bildirim
    const btn = document.getElementById('predict-btn');
    btn.textContent = "VERİLER ÇEKİLİYOR...";
    btn.disabled = true;

    try {
        const response = await fetch('/fetch_data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lon: lng })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        // Orijinal verileri sakla (Senaryo için)
        originalValues = { ...data };
        resetSliders();

        // Kutucukları doldur
        for (const [key, value] of Object.entries(data)) {
            const input = document.getElementById(key);
            if (input) {
                input.value = value;
                // Hafif parlama efekti
                input.style.borderColor = "#f97316";
                setTimeout(() => input.style.borderColor = "rgba(255, 255, 255, 0.1)", 1000);
            }
        }
    } catch (error) {
        console.error("Hata:", error);
        alert("Veriler çekilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
        btn.textContent = "RİSK ANALİZİ YAP";
        btn.disabled = false;
    }
}

function resetSliders() {
    const sliders = document.querySelectorAll('.slider-group input[type="range"]');
    sliders.forEach(slider => {
        slider.value = 0;
        const spanId = slider.id.replace('slider-', 'val-');
        const span = document.getElementById(spanId);
        if (span) {
            if (spanId.includes('NDVI') || spanId.includes('NDWI') || spanId.includes('BSI') || spanId.includes('EVI') || spanId.includes('LAI')) {
                span.textContent = "0%";
            } else {
                span.textContent = "0";
            }
        }
    });
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`${tabId}-sliders`).classList.add('active');
    event.currentTarget.classList.add('active');
}

function updateParam(id, value, mode) {
    if (Object.keys(originalValues).length === 0) {
        alert("Lütfen önce haritadan bir bölge seçin!");
        resetSliders();
        return;
    }

    const input = document.getElementById(id);
    const span = document.getElementById(`val-${id}`);
    const original = originalValues[id];
    const val = parseFloat(value);
    
    let newVal;
    if (mode === 'percent') {
        newVal = original * (1 + val / 100);
        span.textContent = `${val > 0 ? '+' : ''}${val}%`;
    } else {
        newVal = original + val;
        span.textContent = `${val > 0 ? '+' : ''}${val}${getUnit(id)}`;
    }
    
    input.value = newVal.toFixed(4);
    input.style.backgroundColor = "rgba(249, 115, 22, 0.3)";
    setTimeout(() => input.style.backgroundColor = "transparent", 300);
}

function getUnit(id) {
    if (id === 'Feat1_Elev') return 'm';
    if (id === 'Feat2_Slop') return '%';
    if (id === 'Feat3_Aspe') return '°';
    if (id === 'Feat8_Temp') return 'K';
    if (id === 'Feat9_Prec') return 'mm';
    return '';
}

function resetParams() {
    if (Object.keys(originalValues).length === 0) return;
    
    for (const [key, value] of Object.entries(originalValues)) {
        const input = document.getElementById(key);
        if (input) input.value = value;
    }
    resetSliders();
}

// Parametre Ayarlama Aracı (Eski butonlar için destek)
function adjustParam(id, amount, isPercentage = false) {
    const input = document.getElementById(id);
    if (!input || !input.value) return;
    
    let val = parseFloat(input.value);
    if (isPercentage) {
        val = val * amount;
    } else {
        val = val + amount;
    }
    
    input.value = val.toFixed(4);
    
    // Görsel geri bildirim
    input.style.backgroundColor = "rgba(249, 115, 22, 0.3)";
    setTimeout(() => input.style.backgroundColor = "transparent", 500);
}

// Tahmin Butonu
document.getElementById('predict-btn').addEventListener('click', async function() {
    const features = {};
    const inputs = document.querySelectorAll('input[type="number"]');
    
    let hasEmpty = false;
    inputs.forEach(input => {
        if (!input.value) hasEmpty = true;
        features[input.id] = input.value;
    });

    // Bazı eksik verileri tamamla (Eğer grid'de yoksa)
    if (!features['Feat7_EVI_']) features['Feat7_EVI_'] = 0.3;
    if (!features['Feat11_V_W']) features['Feat11_V_W'] = 0.1;
    if (!features['Feat13_Pop']) features['Feat13_Pop'] = 50;

    if (hasEmpty) {
        alert("Lütfen tüm temel kutucukların dolu olduğundan emin olun! Haritadan bir yer seçerek doldurabilirsiniz.");
        return;
    }

    const resultPanel = document.getElementById('result-panel');
    const resultStatus = document.getElementById('result-status');
    const resultProb = document.getElementById('result-prob');
    const probFill = document.getElementById('prob-fill');
    const decisionText = document.getElementById('decision-text');

    resultPanel.classList.remove('hidden');
    resultStatus.textContent = "ANALİZ EDİLİYOR...";
    probFill.style.width = "0%";

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(features)
        });

        const result = await response.json();

        setTimeout(() => {
            if (result.prediction === 1) {
                resultStatus.textContent = "⚠️ KRİTİK YANGIN RİSKİ!";
                resultStatus.style.color = "#ef4444";
                probFill.style.backgroundColor = "#ef4444";
                decisionText.textContent = "ACİL DURUM: Bölgedeki itfaiye ekiplerine ön uyarı verilmeli ve hava araçları hazır bekletilmelidir. Senaryo yüksek yayılma potansiyeli gösteriyor.";
            } else {
                resultStatus.textContent = "✅ GÜVENLİ DURUM";
                resultStatus.style.color = "#22c55e";
                probFill.style.backgroundColor = "#22c55e";
                decisionText.textContent = "Bölge şu anki senaryo altında stabil görünüyor. Rutin devriye yeterlidir. Yangın duyarlılığı düşük seviyededir.";
            }
            
            resultProb.textContent = `Analiz Güven Oranı: %${result.probability}`;
            probFill.style.width = `${result.probability}%`;
        }, 500);

    } catch (error) {
        alert("Tahmin sırasında bir hata oluştu.");
    }
});
