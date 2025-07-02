# API Endpoint'leri

## Kimlik Doğrulama
- `POST /api/v1/auth/register` - Yeni kullanıcı kaydı
- `POST /api/v1/auth/login` - Kullanıcı girişi
- `POST /api/v1/auth/refresh` - Token yenileme

## Kullanıcı İşlemleri
- `GET /api/v1/users/me` - Mevcut kullanıcı bilgileri
- `PUT /api/v1/users/me` - Kullanıcı bilgilerini güncelle
- `GET /api/v1/users/skills` - Kullanıcı yetenekleri

## Kurs ve İçerik
- `GET /api/v1/courses` - Tüm kursları listele
- `GET /api/v1/courses/{id}` - Kurs detayları
- `POST /api/v1/courses/enroll` - Kursa kayıt ol

## İş İlanları
- `GET /api/v1/jobs` - İş ilanlarını listele
- `GET /api/v1/jobs/{id}` - İş ilanı detayları
- `POST /api/v1/jobs/apply` - İş başvurusu yap
