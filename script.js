// script.js

const DOM = {
    // Ana Elementler
    baslangic: document.getElementById('baslangic-ekrani'),
    tarama: document.getElementById('taramamodulu'),
    
    // Tarama Bilgileri
    durumCubugu: document.getElementById('sistem-durumu'),
    gecenSure: document.getElementById('gecen-sure'),
    taramaFaz: document.getElementById('tarama-faz'),
    taramaMesaj: document.getElementById('tarama-mesaj'),
    ilerlemeCubugu: document.querySelector('#ilerleme-cubugu .ilerleme-içi'),
    dosyaSayisi: document.getElementById('dosya-sayisi'),
    hataSayisi: document.getElementById('hata-sayisi'),
    
    // Hata Ekranı
    hataKutusu: document.getElementById('hata-kutusu'),
};

let taramaInterval = null;
let zamanlayiciInterval = null;
let ilerleme = 0;
let dosyaSayar = 0;
let hataSayar = 0;
let saniye = 0;

// Tarama Aşama Tanımları
const taramaAsamalari = [
    { faz: "Sistem Çekirdeği Doğrulaması", total: 20, mesajlar: ["Kernel hash'leri kontrol ediliyor...", "Çekirdek modülleri yükleniyor...", "Önbellek bütünlüğü test ediliyor..."] },
    { faz: "Kritik Dosya Taraması", total: 50, mesajlar: ["WIN32.dll ve SYS32 yedekleri kontrol ediliyor...", "Kayıt defteri taranıyor...", "Sistem yolları doğrulandı..."] },
    { faz: "Ağ ve Güvenlik Protokolleri", total: 85, mesajlar: ["Güvenlik duvarı kuralları inceleniyor...", "Gelen/Giden port aktivitesi şüpheli...", "Yabancı IP adresi tespiti bekleniyor..."] },
    { faz: "Sonuçların Raporlanması", total: 100, mesajlar: ["Analiz sonuçları derleniyor...", "Kritik hata protokolü aktif...", "Raporlama tamamlanıyor..."] }
];
let mevcutAsamaIndex = 0;


function baslatTamEkran() {
    // Tam ekran başlatma (Tarayıcı gereksinimi)
    const element = document.documentElement;
    element.requestFullscreen ? element.requestFullscreen() : element.webkitRequestFullscreen ? element.webkitRequestFullscreen() : null;

    // Ekranları değiştir
    DOM.baslangic.classList.remove('aktif');
    DOM.tarama.classList.add('aktif');
    DOM.durumCubugu.textContent = 'Tarama Başladı';
    DOM.durumCubugu.style.color = '#ffcc00'; // Sarı

    // Taramayı başlat
    taramaBaslat();
    zamanlayiciBaslat();
}

function zamanlayiciBaslat() {
    saniye = 0;
    zamanlayiciInterval = setInterval(() => {
        saniye++;
        const dakika = String(Math.floor(saniye / 60)).padStart(2, '0');
        const s = String(saniye % 60).padStart(2, '0');
        DOM.gecenSure.textContent = `${dakika}:${s}`;
    }, 1000);
}

function taramaBaslat() {
    mevcutAsamaIndex = 0;
    ilerleme = 0;
    dosyaSayar = 0;
    hataSayar = 0;
    DOM.hataKutusu.classList.add('gizli'); // Her ihtimale karşı gizle
    DOM.hataSayisi.textContent = '0';
    DOM.ilerlemeCubugu.style.backgroundColor = '#58a6ff'; // Mavi başlangıç

    taramaInterval = setInterval(() => {
        // Aşamaları İlerleme Kontrolü
        const hedefIlerleme = taramaAsamalari[mevcutAsamaIndex].total;
        
        if (ilerleme < hedefIlerleme) {
            // İlerlemeyi Artır
            ilerleme += Math.random() * 2 + 0.5;
            if (ilerleme > hedefIlerleme) ilerleme = hedefIlerleme;

            // İlerleme Çubuğu ve Sayıcıları Güncelle
            DOM.ilerlemeCubugu.style.width = ilerleme + '%';
            dosyaSayar += Math.floor(Math.random() * 25) + 5;
            DOM.dosyaSayisi.textContent = dosyaSayar;
            
            // Hata Sayacını Rastgele Artır (Kritik aşamada daha sık)
            if (mevcutAsamaIndex >= 2 && Math.random() < 0.2) { // 3. aşamadan sonra hata riski artsın
                hataSayar++;
                DOM.hataSayisi.textContent = hataSayar;
                // Kritikleşen renk
                if (hataSayar >= 3) {
                    DOM.hataSayisi.style.color = '#f85149';
                    DOM.ilerlemeCubugu.style.backgroundColor = 'red';
                }
            }

            // Mesaj Güncelle
            const asama = taramaAsamalari[mevcutAsamaIndex];
            DOM.taramaFaz.textContent = asama.faz;
            
            // Rastgele mesaj seç
            if (Math.random() < 0.1) {
                const randMsg = asama.mesajlar[Math.floor(Math.random() * asama.mesajlar.length)];
                DOM.taramaMesaj.textContent = randMsg;
            }

        } else if (mevcutAsamaIndex < taramaAsamalari.length - 1) {
            // Bir sonraki aşamaya geç
            mevcutAsamaIndex++;
            DOM.taramaMesaj.textContent = `Aşama ${mevcutAsamaIndex + 1} Başlatılıyor...`;
        } else {
            // Tarama Tamamlandı (Şaka Tetiklenmesi)
            clearInterval(taramaInterval);
            clearInterval(zamanlayiciInterval);
            taramaTamamlandi();
        }

    }, 150); // Her 150ms'de bir güncelle
}

function taramaTamamlandi() {
    DOM.durumCubugu.textContent = 'KRİTİK HATA!';
    DOM.durumCubugu.style.color = 'red';
    DOM.taramaFaz.textContent = 'KRİTİK RAPORLAMA AŞAMASI';
    DOM.taramaMesaj.textContent = `Sistem %${(hataSayar / dosyaSayar * 100).toFixed(2)} oranında enfekte. Zorla kapatılıyor...`;
    
    // Hata kutusunu 2 saniye sonra göster
    setTimeout(() => {
        DOM.hataKutusu.classList.remove('gizli');
    }, 2000);
}

function kapatVeSifirla() {
    // Tarama ve zamanlayıcıyı durdur
    if (taramaInterval) clearInterval(taramaInterval);
    if (zamanlayiciInterval) clearInterval(zamanlayiciInterval);
    
    // Tam ekrandan çıkış
    document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : null;

    // Şaka uyarısı
    alert("!! DİKKAT !!\nBu sadece bir simülasyondu ve bilgisayarınızda bir sorun YOKTUR. Rahatlayın.");

    // Ekranı sıfırla ve başlangıca dön
    DOM.tarama.classList.remove('aktif');
    DOM.baslangic.classList.add('aktif');
    DOM.durumCubugu.textContent = 'Hazır';
    DOM.durumCubugu.style.color = '#4acb59';
    DOM.hataKutusu.classList.add('gizli');
    DOM.gecenSure.textContent = '00:00';
    DOM.hataSayisi.style.color = '#ff7b72'; // Rengi sıfırla
    // ... diğer sayıcıları da sıfırlayabilirsiniz
}