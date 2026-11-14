# Мастерская мерча — техническое задание и рабочий контекст

Обновлено: 14.11.2026. Репозиторий Blane239/test1211261442. Источник истины — файлы корня main, не архив source.zip.

## Цель
Сохранить содержание и оформление мастерской, выстроить понятный путь посетителя, сделать отдельные информационные страницы и единый набор локальных анимаций. Пункт 15 отменён и не реализуется. Контент: не менять возраст, часы, имена и статус запуска без отдельной задачи.

## Требования и реализация

| № | Требование | Решение |
|---|---|---|
| 1 | Логичный UX-порядок | Первый экран и преимущества → о мастерской → результат → этапы → программа → формат → автор → вопросы → первый шаг → ссылки для организаторов. |
| 2 | Пояснительная записка и планы в верхнем меню | Отдельные explanatory-note.html и development.html с обратной навигацией. Оснащение размещено на странице развития. |
| 3 | Иконки icons.download | Реальные SVG Vitaly Belousov, regular/outline/rounded; скопированы в HTML. Нет запросов к поставщику при работе сайта. |
| 4 | Morphicons / Heroicons | Локальная адаптация пружинного перехода меню/крестик на геометрии Heroicons; aria-expanded, Escape, клик вне меню, поддержка reduced motion. Это самостоятельный vanilla-код, не установленный пакет Morphicons. |
| 5 | About-15 без пластинки | Временная самостоятельная реализация веера квадратных карточек: переключение кнопками, клавиатурой, свайпом. Точный платный React Bits Pro компонент НЕ установлен: исходник закрыт, ключ REACTBITS_LICENSE_KEY не предоставлен. Подключать лицензированный исходник после его получения, без раскрытия ключа в публичном репозитории. |
| 6 | Иерархия H1–H6 | Ровно один H1 на каждой странице; H2 — разделы; H3 — карточки и занятия. На странице развития заголовки направлений H2. Уровни не выбирать ради размера шрифта. |
| 7 | Eldora Fade Text для H1 | Локальное последовательное плавное появление слов, без блеска H1. |
| 8 | Word Pull Up для прямоугольников | Общий motion-card, последовательное появление сдвигом вверх. Не конфликтует с вращением карточек веера. |
| 9 | Никаких runtime-зависимостей от внешних сайтов | HTML/CSS/JS/SVG/картинки/Word хранятся рядом в репозитории. Никаких CDN, iframe или удалённых шрифтов. |
| 10 | Word Pull Up для чисел | Числа в заголовках и числовых метках оборачиваются автоматически, без изменения семантики. |
| 11 | Word Pull Up для описаний | Общий обработчик сохраняет разметку и пробелы, анимирует слова при появлении описания. |
| 12 | Word Pull Up в перечислениях | Применён к спискам главного экрана и тегам; существующее сменяющееся перечисление в CTA сохранено. |
| 13 | Word Pull Up на кнопках | Слова внутри отдельной button-label; эффекты при наведении и клавиатурном фокусе, SVG не раздвигают слова. |
| 14 | Папка Word-документов | Локальная адаптация предоставленного Glass Folder Cards: стеклянная передняя панель, подъём файла, открытие кликом/Enter/Space, Escape, inert закрытого содержимого. Реальная ссылка на documents-course-program.docx и обычная резервная ссылка. |

## Архитектура и зоны изменений
- index.html: только главная страница; не возвращать сюда полную записку и планы.
- explanatory-note.html: записка, семантические раскрывающиеся подразделы, папка документов.
- development.html: направления развития и оборудование.
- content-lessons.js: тексты занятий и параметры программы; общие факты не дублировать в скриптах.
- css-styles.css: базовая прежняя верстка.
- css-hero-layout.css: композиция первого экрана.
- css-ux-polish.css: единый слой адаптации, motion-токены и изолированные sleeve-/folder-/motion- компоненты. Не дописывать повторяющиеся переопределения: редактировать существующее правило.
- js-app.js: занятия и локальные скачивания; не переносить сюда меню.
- js-motion.js: общие меню, морфинг, анимации, веер, папка; используется на всех трёх страницах.
- документы и изображения: относительные пути в корне. source.zip — исторический архив, не рабочая версия.

## Рабочий промт для следующих изменений
Прочитай это ТЗ и актуальный код затронутого компонента. Выполняй только новую задачу, сохраняя реализованные пункты. Не переписывай сайт целиком. Сначала определи один источник изменения: контент, шаблон страницы, общий стиль или общий обработчик. Изменяй его на месте. Переиспользуй существующие классы и токены. Не добавляй React/Tailwind/CDN ради одного эффекта в статический сайт. Все новые ресурсы храни в проекте. Не подменяй недоступные платные исходники заявлением об их установке. Обновляй статусы и существенные ограничения в этом файле. После изменения общих ассетов обнови query-версию подключений на всех страницах одним значением. Проверь именно опубликованный результат.

## Приёмка
1. Размеры 320, 390, 768, 1440 px: отсутствие горизонтального переполнения документа и обрезанных кнопок.
2. Меню: открытие, закрытие, Escape, переход на каждую отдельную страницу и возврат.
3. Семантика: один H1, последовательность H2/H3; названия занятий остаются H3 внутри summary.
4. Веер: обе кнопки, клавиши стрелок, изменение статуса, свайп без блокировки вертикального скролла.
5. Документы: открытие папки, фокус файла, Escape, рабочее скачивание DOCX, резервная ссылка.
6. Мини-бриф: открытие, закрытие, required-поля, локальное скачивание; никаких отправок на сервер.
7. Reduced motion: контент виден, анимации отключены; без JS статический контент читаем, ссылка на документ доступна.
8. Ресурсы только того же origin, отсутствие ошибок консоли. GitHub Pages должен завершить публикацию успешно.

## Источники и ограничения
- https://icons.download/license — разрешены личные и коммерческие проекты и модификация. Нельзя распространять иконки отдельной конкурирующей библиотекой. Используются встроенными в сайт.
- https://www.morphicons.com/docs — reference for spring morphing, vanilla adaptation; Heroicons menu paths.
- https://www.eldoraui.site/docs/components/fade-text и /word-pull-up-text — reference behaviors adapted to existing static site, not remote React imports.
- https://pro.reactbits.dev/docs/blocks/about/about-15 — точный компонент заблокирован Pro-доступом; не обходить ограничение. Нативный веер не выдавать за оригинальный компонент.
- Glass Folder Cards — исходный компонент предоставлен пользователем файлом «Вставленный текст.txt»; портирована презентация папки и взаимодействие для чтения документов. Добавление произвольных файлов и удаление не требуются.

## Проверено 14.11.2026

- Главная и обе отдельные страницы: 320, 390, 768, 1440 px, горизонтального переполнения документа нет.
- Один H1 на каждой странице; локальная проверка HTML не нашла пропусков уровней, повторных id, отсутствующих файлов и сломанных якорей.
- Node --check: js-app.js и js-motion.js — успешно.
- На опубликованной главной сформированы все 10 занятий с H3.
- Меню: открытие, Escape и переходы на отдельные страницы — успешно. Веер: кнопки и клавиатура — успешно. Свайп реализован, физическим сенсорным устройством не проверен.
- Папка: открытие, фокус Word-ссылки, Escape и inert закрытых файлов — успешно. DOCX реально скачан браузером.
- Заполненный мини-бриф реально скачан как текстовый файл. Никакой отправки формы на сервер.
- Эмуляция prefers-reduced-motion: анимации заголовков и блоков отключены.
- Ресурсные ссылки проверены: все того же origin. Проверенные страницы не показали ошибок консоли.
- Локальная рабочая копия актуального репозитория сохранена на компьютере.
- Открытое ограничение: пункт 5, точный About-15 требует лицензированного исходника; самостоятельный веер не является оригиналом React Bits Pro.


## Batch 2 — 14 November 2026
- Shared rounded glass navigation with local card dropdowns and mobile menu.
- Shine restricted to section-title headings; H1 fades, remaining text pulls up including lists and labels.
- Six white benefits with blue hover; seamless three-phrase ticker.
- Light development hero, accessible native progress at 12%, eight unique connected milestones.
- Partner support section: five keyboard-operable tabs, local animated SVG illustrations, progressive enhancement.
- Navigation 2 and Features 9 source is license gated; no license key available. These are independently authored local adaptations, not installed Pro components.
- No runtime CDN or remote component dependency. Reduced-motion and no-JS content preserved.
- Validation: JS syntax; unique IDs, one H1 per page, local asset paths; browser checked 320 px menu/dropdowns and support tabs, desktop layout.


## Batch 3 — compact development page
- Move preparation into a separate centered green section at the bottom. Native accessible progress remains 12%; Minecraft-inspired segmented experience track, percentage at the right end.
- Replace the long eight-item roadmap with six concise bento cards, based on the supplied 21st.dev bento-grid-01 visual reference. Merge related launch and showcase goals without losing the education, professionals, new techniques or future shop directions.
- Replace support tabs with five square illustrated cards in a seamless infinite carousel. Local implementation inspired by Features 9; licensed Pro source is still unavailable.
- Controls: previous, next and pause; pause on hover/focus, swipe pauses after manual movement. Pause when offscreen/background. Reduced-motion uses native horizontal scrolling with no automatic movement. No-JS preserves readable original cards.
- Changes isolated in css-development.css and js-development.js; preserve the other pages.
- Validation: JS syntax, IDs, local assets, goal/card counts; browser at 320, 768 and 1440px, no horizontal page overflow or cropped card content; pause/next and reduced-motion checked.
