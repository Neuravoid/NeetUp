# Sistem Mimarisi

## Genel Bakış
NeetUp, modern web teknolojileri kullanılarak geliştirilmiş bir kariyer ve girişimcilik platformudur. Mikroservis mimarisi prensiplerine uygun olarak tasarlanmıştır.

## Bileşenler

### 1. Frontend
- **Teknoloji:** React.js
- **Durum Yönetimi:** Redux Toolkit
- **Stil:** CSS-in-JS (Styled Components)
- **Rota Yönetimi:** React Router

### 2. Backend
- **Çatı:** FastAPI (Python)
- **Veritabanı:** PostgreSQL
- **Önbellek:** Redis
- **Mesaj Kuyruğu:** RabbitMQ

### 3. Altyapı
- **Containerizasyon:** Docker
- **Orkestrasyon:** Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus + Grafana

## Veri Akışı
1. Kullanıcı arayüzünden gelen istekler API Gateway üzerinden ilgili servislere yönlendirilir.
2. Her servis kendi veritabanına sahiptir ve diğer servislerle API üzerinden iletişim kurar.
3. Asenkron işlemler mesaj kuyruğu üzerinden yönetilir.

## Güvenlik
- JWT tabanlı kimlik doğrulama
- Role-based access control (RBAC)
- Tüm iletişim HTTPS üzerinden
- Düzenli güvenlik güncellemeleri
