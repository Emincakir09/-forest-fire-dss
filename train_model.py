import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.preprocessing import StandardScaler
import joblib

def main():
    # 1. Veri Yükleme
    try:
        df = pd.read_csv('Data.csv', sep=';', decimal=',')
        print(f"Veri yüklendi: {df.shape[0]} satır, {df.shape[1]} sütun.")
    except Exception as e:
        print(f"Hata: Veri yüklenemedi. {e}")
        return

    # 2. Ön İşleme
    target = 'Label' if 'Label' in df.columns else 'label'
    X = df.drop(columns=[target])
    y = df[target]

    # Veriyi Eğitim ve Test Olarak Ayırma
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Ölçeklendirme (SVM için gereklidir, diğerlerine zarar vermez)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 3. Model Tanımlamaları
    models = {
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "SVM (Destek Vektör)": SVC(probability=True, random_state=42),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }

    results = []

    # 4. Modelleri Eğitme ve Karşılaştırma
    print("\n--- Model Karşılaştırma Başlıyor ---")
    for name, model in models.items():
        # Modeli eğit
        model.fit(X_train_scaled, y_train)
        
        # Tahmin yap
        y_pred = model.predict(X_test_scaled)
        
        # Metrikleri hesapla
        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        
        results.append({"Model": name, "Accuracy": acc, "F1-Score": f1})
        
        print(f"\n[{name}] Sonuçları:")
        print(f"Doğruluk: {acc:.4f}")
        print(classification_report(y_test, y_pred))

    # 5. Özet Tablo
    print("\n--- ÖZET KARŞILAŞTIRMA TABLOSU ---")
    summary_df = pd.DataFrame(results).sort_values(by="Accuracy", ascending=False)
    print(summary_df)

    # En iyi modeli kaydetme
    best_model_name = summary_df.iloc[0]['Model']
    best_model = models[best_model_name]
    
    # Model ve Scaler'ı kaydet (Gelecekteki tahminler için ikisi de lazım)
    joblib.dump(best_model, 'best_forest_fire_model.joblib')
    joblib.dump(scaler, 'scaler.joblib')
    
    print(f"\nEn iyi model ({best_model_name}) ve ölçeklendirici kaydedildi.")

if __name__ == "__main__":
    main()
