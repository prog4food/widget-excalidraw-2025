# Excalidraw widget for SiYuan

This is an updated version of the widget that allows you to draw [Excalidraw](https://docs.excalidraw.com/) diagrams for [SiYuan](https://github.com/siyuan-note/siyuan).

The original widget source code: [ooooooook/widget-excalidraw](https://github.com/ooooooook/widget-excalidraw).  
Unfortunately, it is entirely in Chinese and has not been maintained or updated for a long time.  
**[Important]** This widget has a new id `widget-excalidraw-2025`, and drawings created by `widget-excalidraw` are compatible but need to be migrated.  
Read [this guide](./public/MIGRATION.md)

![preview](./public/preview.png)

## RU
Это обновленная версия виджета, позволяющего рисовать [excalidraw](https://docs.excalidraw.com/) схемы для [SiYuan](https://github.com/siyuan-note/siyuan)

Код оригинального виждета: [ooooooook/widget-excalidraw](https://github.com/ooooooook/widget-excalidraw).  
К сожалению он полностью на китайском, уже давно не поддерживается и не обновляется.  
**[Важно]** У этого виджета новый ид `widget-excalidraw-2025`, и схемы созданные старым виджетом (`widget-excalidraw`), хоть и совместимы, но требуют миграции.  
Прочтите [это руководство](./public/MIGRATION.md#ru)

Этот форк я делал для себя, и собрал в нем доработки, которые мне необходимы.
Сразу говорю, я не знаю React (более того, я ненавижу его), поэтому некоторые исправления могут быть нелогичными, и неуместными.  
Тем не менее, мне достаточно стабильности и функционала, которые я получил.

Вот примерный список изменений:
 * [~] Переход на Excalidraw v18
 * [~] Сборщик проекта теперь на vite
 * [~] В базе - чистый шаблон vitejs/plugin-react
 * [+] Кнопка в главном меню SearchMenu
 * [~] Язык Excalidraw теперь берется из siyuan
 * [~] Перевод некоторых элементов на английский
 * [+] Разблокированный пункт меню SaveToActiveFile
 * [~] Улучшенная кнопка Save
