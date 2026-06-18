import { IconMinus, IconSquare, IconX, IconBriefcase } from "@tabler/icons-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function Titlebar() {
  const appWindow = getCurrentWindow();

  const handleMinimize = () => {
    appWindow.minimize().catch(console.error);
  };

  const handleMaximize = () => {
    appWindow.toggleMaximize().catch(console.error);
  };

  const handleClose = () => {
    appWindow.close().catch(console.error);
  };

  const handleDrag = (e: React.MouseEvent) => {
    // Only drag on left-click, and not when clicking on buttons
    if (e.button === 0) {
      appWindow.startDragging().catch(console.error);
    }
  };

  return (
    <div className="titlebar" onMouseDown={handleDrag}>
      <div className="titlebar-title">
        <IconBriefcase size={12} className="titlebar-logo-icon" />
        <span className="titlebar-logo-text">jata</span>
      </div>
      <div className="titlebar-controls" onMouseDown={(e) => e.stopPropagation()}>
        <button
          onClick={handleMinimize}
          className="titlebar-button"
          title="Minimize"
          aria-label="Minimize"
        >
          <IconMinus size={14} />
        </button>
        <button
          onClick={handleMaximize}
          className="titlebar-button"
          title="Maximize"
          aria-label="Maximize"
        >
          <IconSquare size={12} />
        </button>
        <button
          onClick={handleClose}
          className="titlebar-button close"
          title="Close"
          aria-label="Close"
        >
          <IconX size={14} />
        </button>
      </div>
    </div>
  );
}
