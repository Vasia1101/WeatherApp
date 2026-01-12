# 🌦 WeatherApp

Сучасний веб-додаток для перегляду погоди з живим пошуком міст, геолокацією та динамічним фоновим зображенням міста.

👉 Побудований на **Next.js (App Router)**, **TypeScript**, **Open-Meteo**, **OpenWeather Geocoding** та **Unsplash AP**

## ✨ Можливості

-   🔍 **Пошук міст** (geocoding через Open-Meteo)
    
-   📍 **Моя локація** (Navigator Geolocation)
    
-   🌡 **Поточна погода**
    
-   🕒 **Погодинний прогноз (24h)**
    
-   📅 **7-денний прогноз**
    
-   ⭐ **Обрані міста** (localStorage)
    
-   🖼 **Динамічний фон міста** (Unsplash, через сервер)
    
-   🌗 Акуратний **glassmorphism UI**
    
-   ⚡ Кешування запитів (React Query + Next fetch revalidate)

## 🧱 Технології

-   **Next.js 16 (App Router, Turbopack)**
    
-   **React + TypeScript**
    
-   **Tailwind CSS**
    
-   **@tanstack/react-query**
    
-   **Open-Meteo API** — погода та geocoding
    
-   **OpenWeather Reverse Geocoding** — EN-назви міст
    
-   **Unsplash API** — фон міста
    
-   **ESLint** (strict rules)

## 📦 Структура проєкту

src/
├─ app/
│  ├─ api/
│  │  ├─ geocode/        # пошук міст (Open-Meteo)
│  │  └─ unsplash/       # бекграунд міста (через сервер)
│  ├─ layout.tsx
│  └─ page.tsx
│
├─ components/
│  ├─ CitySearch.tsx
│  ├─ CityBackground.tsx
│  ├─ CurrentWeatherCard.tsx
│  ├─ HourlyChart.tsx
│  ├─ DailyForecast.tsx
│  ├─ Favorites.tsx
│  ├─ GeoButton.tsx
│  ├─ GeoPrompt.tsx
│  └─ GlassCard.tsx
│
├─ lib/
│  ├─ api.ts            # запити до Open-Meteo
│  ├─ geo.ts            # геолокація
│  ├─ storage.ts        # localStorage helpers
│  ├─ types.ts
│  └─ utils.ts
│
└─ styles/
 

----------

## 🔑 Environment variables

Створи файл **`.env.local`**:

`UNSPLASH_ACCESS_KEY=your_unsplash_key_here
OPENWEATHER_API_KEY=your_openweather_key_here` 

### Де взяти ключі?

-   Unsplash → [https://unsplash.com/developers](https://unsplash.com/developers)
    
-   OpenWeather → [https://openweathermap.org/api](https://openweathermap.org/api?utm_source=chatgpt.com)
    

----------

## 🚀 Запуск проєкту

`npm install
npm run dev` 

Відкрий:  
👉 [http://localhost:3000](http://localhost:3000)

----------

## 🧪 Лінтинг

`npm run lint` 

Проєкт налаштований на **strict ESLint**, включно з:

-   `react-hooks/exhaustive-deps`
    
-   `react-hooks/set-state-in-effect`
    
-   `@typescript-eslint/no-explicit-any`
    

----------

## 🖼 Unsplash Attribution

Фонові зображення використовуються відповідно до правил Unsplash.  
Ім’я автора та посилання на Unsplash відображаються поверх фону.

----------

## 📌 Notes / Architecture decisions

-   Компоненти, що працюють з `localStorage`, рендеряться **client-only** (`ssr:false`)
    
-   Unsplash API викликається **через серверний route**, щоб:
    
    -   не світити API key
        
    -   уникнути CORS
        
    -   контролювати кешування
        
-   Geocoding і weather — **один провайдер (Open-Meteo)** → стабільніше
    

----------

## 🛣 Можливі покращення

-   ⛅ Анімації погоди (Lottie / Canvas)
    
-   🌍 Зміна мови (i18n)
    
-   📱 PWA / offline cache
    
-   🧠 Smart background (weather-aware queries)
    
-   📊 Більше графіків
    

----------

## 👨‍💻 Автор

**Vasyl Haida**  
Full-Stack / Frontend Engineer  
🇺🇦