# Family Archive — семейное древо

Цифровой семейный архив в восточном стиле. Интерактивное семейное древо, профили, фотогалереи, важные даты, темная тема и анимации.

## Технологии

- [Next.js 16](https://nextjs.org/) (статический экспорт)
- [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Base UI)
- [Zustand](https://github.com/pmndrs/zustand) + persist (хранение данных в `localStorage`)
- [Framer Motion](https://www.framer.com/motion/) (анимации)
- [Lucide React](https://lucide.dev/) (иконки)

## Возможности

- Создание семейного древа
- Добавление, редактирование и удаление родственников
- Дерево связей с панорамированием, масштабированием и drag & drop для связей
- Профиль человека с галереей фотографий
- Загрузка фото с устройства или по URL
- Поиск по родственникам
- Темная тема
- Страницы: дерево, профиль, настройки, статистика, важные даты, хронология
- Адаптивная верстка для компьютера и телефона
- Хранение данных локально в браузере

## Установка и запуск

```bash
# Перейдите в папку проекта
cd familytree-web

# Установите зависимости
npm install

# Запустите локальный сервер разработки
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Сборка для публикации

```bash
npm run build
```

Статический сайт будет собран в папку `dist/`. Её можно загрузить на GitHub Pages, Netlify, Vercel или любой статический хостинг.

## Публикация на GitHub Pages

1. Создайте новый репозиторий на GitHub.
2. Выполните команды в терминале:

```bash
cd familytree-web
git init
git add .
git commit -m "Initial commit: Family Archive web app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

3. В настройках репозитория (`Settings → Pages`) выберите ветку `main` и папку `dist/` (или соберите через GitHub Actions).

## Структура проекта

```
familytree-web/
  app/                 # Страницы Next.js
  components/          # Компоненты интерфейса
  lib/                 # Типы, хранилище и утилиты
  components/ui/       # Компоненты shadcn/ui
  dist/                # Сборка для публикации
```

## Лицензия

MIT
