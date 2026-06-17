import { getCurrentWindow } from "@tauri-apps/api/window";

type ResizeDirection = "North" | "South" | "East" | "West" | "NorthEast" | "NorthWest" | "SouthEast" | "SouthWest";

const EDGE_SIZE = 5;

const edges: { direction: ResizeDirection; style: React.CSSProperties }[] = [
  // Sides
  { direction: "North", style: { top: 0, left: EDGE_SIZE, right: EDGE_SIZE, height: EDGE_SIZE, cursor: "n-resize" } },
  { direction: "South", style: { bottom: 0, left: EDGE_SIZE, right: EDGE_SIZE, height: EDGE_SIZE, cursor: "s-resize" } },
  { direction: "West", style: { left: 0, top: EDGE_SIZE, bottom: EDGE_SIZE, width: EDGE_SIZE, cursor: "w-resize" } },
  { direction: "East", style: { right: 0, top: EDGE_SIZE, bottom: EDGE_SIZE, width: EDGE_SIZE, cursor: "e-resize" } },
  // Corners
  { direction: "NorthWest", style: { top: 0, left: 0, width: EDGE_SIZE, height: EDGE_SIZE, cursor: "nw-resize" } },
  { direction: "NorthEast", style: { top: 0, right: 0, width: EDGE_SIZE, height: EDGE_SIZE, cursor: "ne-resize" } },
  { direction: "SouthWest", style: { bottom: 0, left: 0, width: EDGE_SIZE, height: EDGE_SIZE, cursor: "sw-resize" } },
  { direction: "SouthEast", style: { bottom: 0, right: 0, width: EDGE_SIZE, height: EDGE_SIZE, cursor: "se-resize" } },
];

export function ResizeHandles() {
  const appWindow = getCurrentWindow();

  const handleResize = (direction: ResizeDirection) => (e: React.MouseEvent) => {
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      appWindow.startResizeDragging(direction).catch(console.error);
    }
  };

  return (
    <>
      {edges.map(({ direction, style }) => (
        <div
          key={direction}
          onMouseDown={handleResize(direction)}
          style={{
            position: "fixed",
            zIndex: 9999,
            ...style,
          }}
        />
      ))}
    </>
  );
}
