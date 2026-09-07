# 📡 Telco CRM - Microservices Platform

![Java](https://img.shields.io/badge/Java-17%20%2F%2021-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-Eureka%20%2F%20Gateway-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-KRaft_Mode-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16%20(App_Router)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Bir telekomünikasyon operatörünün uçtan uca müşteri, sipariş, abonelik, kullanım ve faturalama süreçlerini yöneten **dağıtık, olay güdümlü (event-driven) mikroservis platformu**.

Proje; **10 iş servisi** ve **3 altyapı bileşeni** olmak üzere toplam **13 bağımsız backend servisi**, izole PostgreSQL şemaları (`database-per-service`), Apache Kafka olay akışları ve **Next.js 16** web arayüzünden oluşmaktadır.

---

## 📊 Rakamlarla Proje

| Ölçüt | Değer |
| :--- | :--- |
| **Toplam Backend Mikroservisi** | 13 (10 Domain Servisi + 3 Altyapı Bileşeni) |
| **Ayrık Veritabanı (Şema) Sayısı** | 10 (`database-per-service`) |
| **Toplam Ana Entity (Tablo)** | 17 |
| **Aktif Kafka Topic Sayısı** | 8 |
| **Frontend Sayfa Sayısı** | 9 Domain Sayfası |
| **Temel Teknolojiler** | Spring Boot 3.2, Spring Cloud, Kafka, PostgreSQL, Next.js 16 |

---

## 🏗️ Mimari ve Servis Dağılımı

Platform, **Database-per-Service** ilkesini sıkı bir şekilde uygular. Hiçbir servis bir diğerinin veritabanına doğrudan erişemez. Servisler arası iletişim; anlık cevap gerektiren durumlarda **REST**, gevşek bağlılık (loose-coupling) gerektiren durumlarda ise **Apache Kafka** üzerinden yürütülür.

### Servis ve Port Haritası

| # | Servis | Port | Veritabanı | Temel Sorumluluk |
| :-: | :--- | :-: | :--- | :--- |
| 1 | **`identity-service`** | `9001` | `db_identity` | JWT tabanlı kimlik doğrulama, BCrypt şifreleme ve RBAC (Rol & İzin). |
| 2 | **`customer-service`** | `9002` | `db_customer` | Bireysel/Kurumsal müşteri, TCKN/VKN doğrulama, KYC ve Soft-delete. |
| 3 | **`product-catalog-service`** | `9003` | `db_catalog` | Tarife, paket ve ek servisler; versiyon korumalı katalog yönetimi. |
| 4 | **`order-service`** | `9004` | `db_order` | Sipariş orkestrasyonu (Saga deseni), paket değişim ve hat siparişleri. |
| 5 | **`subscription-service`** | `9005` | `db_subscription` | Abonelik yaşam döngüsü (aktif/askı/iptal) ve Numara Taşıma (MNP). |
| 6 | **`usage-service`** | `9006` | `db_usage` | CDR (Call Detail Record) işleme, kota takibi (%80, %100) ve aşım tespiti. |
| 7 | **`billing-service`** | `9007` | `db_billing` | Aylık toplu faturalama (Bill-run), KDV/aşım hesaplama, PDF fatura üretimi. |
| 8 | **`payment-service`** | `9008` | `db_payment` | Idempotent ödeme yönetimi, 24/72/168 saat kademeli retry mekanizması. |
| 9 | **`notification-service`** | `9009` | `db_notification`| SMS/E-posta şablon motoru (`{{parametre}}`) ve müşteri opt-in/opt-out kontrolü. |
| 10 | **`ticket-service`** | `9010` | `db_ticket` | Çağrı merkezi talep yönetimi (Arıza 4s, Şikayet 24s, Talep 48s SLA takibi). |
| 11 | **`api-gateway`** | `8080` | — | Spring Cloud Gateway reaktif yönlendirme katmanı. |
| 12 | **`discovery-server`** | `8761` | — | Spring Cloud Netflix Eureka servis kayıt ve keşif sunucusu. |
| 13 | **`config-server`** | `8888` | — | Spring Cloud Config Server merkezi konfigürasyon deposu. |

---

## ⚡ Olay Güdümlü Entegrasyon (Apache Kafka)

Servisler arasında derleme-zamanı bağımlılığını (compile-time coupling) önlemek amacıyla paylaşımlı DTO kütüphanesi yerine **Alias tabanlı JSON tip haritası** kullanılmıştır.

### Topic Listesi ve Veri Akışı

| Topic | Üretici | Tüketici(ler) | Tetiklenen İş Akışı |
| :--- | :--- | :--- | :--- |
| `order-events` | `order-service` | `subscription-service`, `billing-service` | Sipariş onaylandığında abonelik ve ilk fatura tetiklenir. |
| `billing-events` | `billing-service` | `order-service` | Fatura ödendiğinde sipariş `PAID` durumuna geçer. |
| `subscription-events` | `subscription-service`| `order-service` | Abonelik açılışı tamamlandığında sipariş `FULFILLED` olur. |
| `cdr-events` | `usage-service` | `usage-service` | Gelen çağrı/data kayıtlarının asenkron bakiye düşümü. |
| `usage-overage-events` | `usage-service` | `billing-service` | Kota aşımlarının fatura kalemine dönüştürülmesi. |
| `usage-notification-events`| `usage-service` | `notification-service` | Kotanın %80 ve %100 seviyelerine ulaşma uyarıları. |
| `billing-notification-events`| `billing-service` | `notification-service` | Yeni fatura kesildiğinde müşteriye bilgilendirme. |
| `ticket-notification-events` | `ticket-service` | `notification-service` | Destek kaydı açıldığında müşteriye onay bildirimi. |

---

## 💡 Öne Çıkan Mühendislik Pratikleri

* **Saga Orchestration:** Dağıtık sipariş akışlarında `order-service` üzerinden telafi edilebilir (compensating) işlemler.
* **Idempotency & Resilience:** `payment-service` üzerinde tekil `paymentRequestId` ile mükerrer çekim engelleme ve 3 aşamalı exponential retry döngüsü.
* **Versiyon Korumalı Katalog:** `product-catalog-service` üzerinde mevcut abonelerin haklarını korumak amacıyla satır ezmek yerine `RETIRED` işaretleyerek versiyonlama (`v1 -> v2`).
* **Merkezi Hata Yönetimi:** Tüm mikroservislerde ortak `@RestControllerAdvice` ve `ApiException` yapısıyla standart hata JSON formatı (`{status, message}`).
* **Algoritmik Doğrulama:** `customer-service` üzerinde gerçek T.C. Kimlik Numarası ve Vergi Kimlik Numarası (VKN) matematiksel checksum kontrolü.
* **Next.js Rewrite Proxy:** Frontend uygulamasında CORS sorunlarını aşmak ve mikroservis adreslerini tek merkezden yönetmek için Next.js internal rewrite mimarisi.

---

## 💻 Tech Stack

- **Backend:** Java 17 / 21, Spring Boot 3.2.0, Spring Data JPA, Hibernate, Spring Cloud (Eureka, Gateway, Config)
- **Mesajlaşma:** Apache Kafka (KRaft Mode), Spring Kafka
- **Veritabanı & Altyapı:** PostgreSQL 15, Redis, Docker Compose
- **Belge & Raporlama:** Apache PDFBox 3.0.3 (Türkçe karakter sanitize destekli PDF üretimi)
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Axios

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- [Docker & Docker Compose](https://www.docker.com/)
- [Java 17+](https://adoptium.net/) & [Maven](https://maven.apache.org/)
- [Node.js 18+](https://nodejs.org/) (Frontend geliştirme için)

### 1. Altyapıyı ve Servisleri Başlatma
```bash
# Repoyu klonlayın
git clone [https://github.com/hsyndyst7/telco-crm-microservices-mvp.git](https://github.com/hsyndyst7/telco-crm-microservices-mvp.git)
cd telco-crm-microservices-mvp

# PostgreSQL, Kafka ve Redis altyapısını Docker ile ayağa kaldırın
docker-compose up -d


👤 Geliştirici

Hasan Hüseyin Dabanıyastı
