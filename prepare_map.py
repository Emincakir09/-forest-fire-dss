import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
import numpy as np
from PIL import Image
import os

def prepare_tif_for_web(input_path, output_png, output_meta):
    # Bu fonksiyon .tif dosyasını okur, WGS84'e dönüştürür ve şeffaf bir PNG yapar.
    # Ayrıca haritaya tam oturması için köşe koordinatlarını kaydeder.
    
    with rasterio.open(input_path) as src:
        transform, width, height = calculate_default_transform(
            src.crs, 'EPSG:4326', src.width, src.height, *src.bounds)
        kwargs = src.meta.copy()
        kwargs.update({
            'crs': 'EPSG:4326',
            'transform': transform,
            'width': width,
            'height': height
        })

        # Yeniden projeksiyon (UTM -> WGS84)
        with rasterio.open('temp_wgs84.tif', 'w', **kwargs) as dst:
            for i in range(1, src.count + 1):
                reproject(
                    source=rasterio.band(src, i),
                    destination=rasterio.band(dst, i),
                    src_transform=src.transform,
                    src_crs=src.crs,
                    dst_transform=transform,
                    dst_crs='EPSG:4326',
                    resampling=Resampling.nearest)

    # PNG'ye dönüştürme ve renklendirme (Basit bir palet)
    with rasterio.open('temp_wgs84.tif') as src:
        data = src.read(1)
        bounds = src.bounds
        
        # Veriyi 0-255 arasına normalize et
        mask = (data != src.nodata)
        data_min = data[mask].min()
        data_max = data[mask].max()
        normalized = np.zeros_like(data, dtype=np.uint8)
        normalized[mask] = ((data[mask] - data_min) / (data_max - data_min) * 255).astype(np.uint8)
        
        # Şeffaflık kanalı ekle
        alpha = np.zeros_like(normalized)
        alpha[mask] = 180 # %70 şeffaflık
        
        # Renk paleti uygula (Sıcaklık haritası gibi: düşük yeşil, yüksek kırmızı)
        color_img = Image.new("RGBA", (width, height))
        for x in range(width):
            for y in range(height):
                val = normalized[y, x]
                if mask[y, x]:
                    # Düşük değerler yeşil, yüksekler kırmızı
                    color_img.putpixel((x, y), (val, 255-val, 0, 180))
                else:
                    color_img.putpixel((x, y), (0, 0, 0, 0))
        
        color_img.save(output_png)
        
        # Koordinatları kaydet (Leaflet için)
        with open(output_meta, 'w') as f:
            f.write(f"{bounds.bottom},{bounds.left},{bounds.top},{bounds.right}")
    
    if os.path.exists('temp_wgs84.tif'):
        os.remove('temp_wgs84.tif')
    print("Harita katmanı başarıyla hazırlandı.")

if __name__ == "__main__":
    tif_file = 'Yangin_Duyarlilik_Haritasi_Sonuc.tif'
    if os.path.exists(tif_file):
        prepare_tif_for_web(tif_file, 'static/overlay.png', 'static/bounds.txt')
    else:
        print(f"Hata: {tif_file} bulunamadı!")
