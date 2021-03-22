import { app, Tray, nativeImage } from "electron";
import { Menubar, menubar } from "menubar";
import * as path from "path";
import { format as formatUrl } from "url";
import is from "electron-is";

let mb: Menubar | null = null;

app.on("ready", () => {
  const tray = new Tray(
    nativeImage.createFromPath(path.join(__dirname, "IconTemplate.png"))
  );

  tray.on("mouse-down", () => {
    mb?.window?.webContents.send("trayMouseDown");
  });
  tray.on("mouse-up", () => {
    mb?.window?.webContents.send("trayMouseUp");
  });

  mb = menubar({
    tray,
    showDockIcon: false,
    index: is.dev()
      ? `http:localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
      : formatUrl({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file:",
          slashes: true,
        }),
    tooltip: "WalkieTalkie",
    browserWindow: {
      height: 300,
      width: 250,
      webPreferences: {
        nodeIntegration: true,
      },
    },
    showOnAllWorkspaces: true,
    preloadWindow: true,
    showOnRightClick: true,
  });

  mb.on("after-create-window", () => {
    // TODO:
    // tray.removeAllListeners("double-click");
    if (is.dev()) {
      mb?.window?.webContents.openDevTools({ mode: "undocked" });
    }
  });
});

app.on("window-all-closed", (e: Event) => {
  app.dock.hide();
  e.preventDefault();
});
