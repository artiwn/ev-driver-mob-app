# VoltDrive Driver App Prototype

Интерактивный dark-only прототип мобильного приложения водителя для EV Charging Platform.

## Онлайн-публикация через GitHub и Vercel

1. Создайте пустой репозиторий на GitHub.
2. Загрузите в корень репозитория все файлы из этой папки.
3. В Vercel выберите **Add New → Project**.
4. Подключите созданный GitHub-репозиторий.
5. В настройках импорта оставьте **Framework Preset: Other**.
6. Build Command и Output Directory оставьте пустыми.
7. Нажмите **Deploy**.

После каждого нового `push` в основную ветку Vercel автоматически обновит сайт.

## Локальный запуск

Требуется Node.js 18 или новее.

```bash
npm run dev
```

Откройте адрес, который будет показан в терминале, обычно `http://localhost:3000`.

Для простой проверки можно также открыть `index.html` напрямую, однако Service Worker работает только через HTTP/HTTPS.

## Проверка JavaScript

```bash
npm run check
```

## Структура проекта

```text
.
├── index.html
├── manifest.webmanifest
├── package.json
├── README.md
├── sw.js
├── tsconfig.json
├── vercel.json
└── src
    ├── app.js
    ├── app.ts
    └── styles.css
```

- `src/app.ts` — редактируемый TypeScript-исходник прототипа.
- `src/app.js` — готовый браузерный JavaScript, подключённый в `index.html`.
- `src/styles.css` — общие стили приложения.
- `manifest.webmanifest` и `sw.js` — PWA и offline-поддержка.
- `vercel.json` — настройки статической публикации в Vercel.

## Важно

Это UI/UX-прототип. Карта, QR-сканирование, платежи, связь с Charger, push-уведомления и поддержка сейчас работают как демонстрационные mock-сценарии, а не как production-интеграции.
