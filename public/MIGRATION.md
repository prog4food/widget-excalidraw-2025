## Migration guide from `widget-excalidraw`
Since this widget (`widget-excalidraw-2025`) is a fork of `widget-excalidraw`, they are fully compatible.  
However, because of the new name, you won't be able to edit schemes created by another widget, because the siyuan block specifies which widget it belongs to.  
I can't publish a widget named `widget-excalidraw`, so in this post I will explain how to globally migrate, your drawings from `widget-excalidraw` to `widget-excalidraw-2025`.

The process is simple, and consists of only 3 steps.
1. Substitute the widget name in all notes
2. Move all schemas to the new widget directory
3. Restart siyuan

All commands must be executed by bash, in the siyuan data directory.  
*This is where the `conf`, `data`, `history`, `repo`, `temp` folders are located.*

Examples of commands can be taken from the `RU` part below.

## RU
Так как этот виджет (`widget-excalidraw-2025`) является форком `widget-excalidraw`, то они полностью совместимы.  
Однако из-за нового имени вы не сможете редактировать схемы созданные другим виджетом, тк в siyuan блоке прописывает, какому виджету он принадлежит.  
Я не могу опубликовать виджет с именем `widget-excalidraw`, поэтому в этой заметке я расскажу как глобально мигрировать, ваши схемы с `widget-excalidraw` на `widget-excalidraw-2025`.

Процесс простой, и состоит всего из 3 шагов.
1. Подменить название виджета во всех заметках
2. Переместить все схемы в новый каталог виджета
3. Перезапустить siyuan

Теперь подробнее:  
Для начала вам нужен доступ к хранилищу заметок и компьютер с linux (или windows + git for windows)  
Все команды должны выполняться bash, в каталоге с каталоге с данными siyuan.  
*Это там, где находятся папки `conf`, `data`, `history`, `repo`, `temp`*

#### 1
Для начала надо заменить старый виджет на новый во всех заметках, сделать это можно командой:
```bash
grep -rl '/widget-excalidraw/' --include "*.sy"  ./data/ | xargs sed -i 's!/widget-excalidraw/!/widget-excalidraw-2025/!g'
```

#### 2
Теперь надо переименовать папку с ассетами виджета:
```bash
[ ! -d  ./data/assets/widget-excalidraw-2025/ ] && mkdir ./data/assets/widget-excalidraw-2025/
mv ./data/assets/widget-excalidraw/* ./data/assets/widget-excalidraw-2025/
```

#### 3
Все, перезапустите siyuan и все схемы с виджетом `widget-excalidraw` теперь будут работать через виджет `widget-excalidraw-2025`