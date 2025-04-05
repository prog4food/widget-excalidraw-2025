import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Excalidraw,
  exportToSvg,
  MainMenu,
  THEME,
  WelcomeScreen,
} from "@excalidraw/excalidraw";
import {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types/types";
import * as siyuan from "./utils/siyuan";
import { serializeSVGToString } from "./utils/utils";
import {
  backgroundIcon,
  gridIcon,
  unsyncOffIcon,
  syncIcon,
} from "./utils/icons";
import { ExcalidrawElement, Theme } from "@excalidraw/excalidraw/types/element/types";
import { debounce } from "lodash";

function App() {
  const blockId = siyuan.getBlockId();
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [theme, setTheme] = useState<Theme>(THEME.LIGHT);
  const [gridModeEnabled, setGridModeEnabled] = useState<boolean>(true);
  const [exportBackground, setExportBackground] = useState<boolean>(true);
  const [initData, setInitData] = useState<ExcalidrawInitialDataState>();
  const [autoSave, setAutoSave] = useState<boolean>(true);

  useEffect(() => {
    if (blockId) {
      // 在开启授权码模式时，思源笔记伺服无法根据当前url自动重定向到授权页，所以这里需要手动拼跳转的url
      siyuan.isAuthEnable().then((auth) => {
        if(auth) {
          const { pathname, search } = window.location;
          const url = '/check-auth?to=' + encodeURIComponent(pathname + search);
          window.location.href=url;
        }
      });

      // 初始化配置项
      siyuan.getOptions(blockId).then((options) => {
        setTheme(options.theme ?? THEME.LIGHT);
        setGridModeEnabled(options.gridModeEnabled ?? true);
        setExportBackground(options.exportBackground ?? true);
      });
      // 初始化数据
      siyuan.getRestoreDataState(blockId).then((e) => setInitData(e));
    }
  }, []);

  const saveDataToSiyuan = (hints: boolean) => {
    if (!blockId || !excalidrawAPI) {
      return;
    }
    const { viewBackgroundColor } = excalidrawAPI.getAppState();
    exportToSvg({
      elements: excalidrawAPI.getSceneElements(),
      appState: {
        exportEmbedScene: true,
        exportWithDarkMode: theme === THEME.DARK,
        exportBackground,
        viewBackgroundColor,
      },
      files: excalidrawAPI.getFiles(),
    })
      .then((svg: SVGSVGElement) => {
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        const svgString = serializeSVGToString(svg);
        return siyuan.assetsUpload(false, "0", svgString);
      })
      .then((assetsPath: string) => {
        // 缓存旧路径
        return siyuan.getBlockAttrs(blockId).then((e) => {
          return {
            oldAssetsPath: e["data-assets"],
            assetsPath,
          };
        });
      })
      .then(({ oldAssetsPath, assetsPath }) => {
        return siyuan
          .setBlockAttrs({
            "data-assets": assetsPath,
            // 图片配置项
            options: {
              gridModeEnabled,
              exportBackground,
              theme,
            },
          })
          .then((e) => {
            return {
              oldAssetsPath,
              response: e,
            };
          });
      })
      .then(({ oldAssetsPath, response }) => {
        response.json().then((e) => {
          let message;
          if (response.ok && e?.code === 0) {
            message = "Save - OK!";
            // 确保在保存成功之后再删除旧文件(尽力而为地删除，删除失败也没关系)
            siyuan.removeFile(oldAssetsPath).then((r) => r);
          } else {
            message = "Save - ERROR!";
          }
          if (hints) {
            excalidrawAPI.setToast({ message, closable: true, duration: 1000 });
          }
        });
      });
  };

  const renderTopRightUI = () => {
    return (
      <>
        {blockId && (
          <div
            className="Island ToolIcon"
            style={{ padding: '6px 0' }}
          >
          <div
            className="ToolIcon__icon"
            onClick={() => saveDataToSiyuan(true)}
          >
            <svg width="36px" height="36px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#0F0F0F"/>
            </svg>
          </div>
          </div>
        )}
      </>
    );
  };

  const handleOnChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    files: BinaryFiles
  ) => {
    setTheme(appState.theme);
  };

  const debounceFun: EventListener = debounce(
    () => saveDataToSiyuan(false),
    2000
  );

  useEffect(() => {
    if (autoSave) {
      window.addEventListener("pointerup", debounceFun);
    } else {
      window.removeEventListener("pointerup", debounceFun);
    }
    return () => {
      window.removeEventListener("pointerup", debounceFun);
    };
  }, [autoSave, excalidrawAPI, theme, exportBackground, gridModeEnabled]);

  return (
    <>
      <div style={{ height: "100vh" }}>
        {initData && (
          <Excalidraw
            excalidrawAPI={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
            initialData={initData}
            langCode={"ru-RU"}
            autoFocus
            handleKeyboardGlobally
            renderTopRightUI={renderTopRightUI}
            gridModeEnabled={gridModeEnabled}
            theme={theme}
            UIOptions={{
              canvasActions: {
                toggleTheme: true,
              },
            }}
            onChange={handleOnChange}
          >
            <MainMenu>
              <MainMenu.DefaultItems.LoadScene />
              <MainMenu.DefaultItems.SaveToActiveFile />
              <MainMenu.DefaultItems.SaveAsImage />
              <MainMenu.DefaultItems.Export />
              <MainMenu.DefaultItems.ClearCanvas />
              <MainMenu.DefaultItems.Help />
              <MainMenu.Separator />
              <MainMenu.DefaultItems.ToggleTheme />
              <MainMenu.Item
                icon={gridIcon}
                onSelect={() => setGridModeEnabled(!gridModeEnabled)}
              >
                Show grid ({gridModeEnabled ? "YES" : "NO"})
              </MainMenu.Item>
              <MainMenu.Item
                icon={backgroundIcon}
                onSelect={() => setExportBackground(!exportBackground)}
              >
                Export background ({exportBackground ? "YES" : "NO"})
              </MainMenu.Item>
              <MainMenu.DefaultItems.ChangeCanvasBackground />
              <MainMenu.Separator />
              <MainMenu.Item
                onSelect={() => setAutoSave(!autoSave)}
                icon={autoSave ? syncIcon : unsyncOffIcon}
              >
                AutoSave（{autoSave ? "ON" : "OFF"}）
              </MainMenu.Item>
            </MainMenu>
            <WelcomeScreen />
          </Excalidraw>
        )}
      </div>
    </>
  );
}

export default App;
