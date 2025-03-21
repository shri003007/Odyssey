interface Position {
  x: number;
  y: number;
}

interface Dimensions {
  width: number;
  height: number;
}

interface ViewportConstraints {
  viewportWidth: number;
  viewportHeight: number;
  editorRect: DOMRect;
}

export function calculateMenuPosition(
  selectionRect: DOMRect,
  menuDimensions: Dimensions,
  constraints: ViewportConstraints,
  offset: { x: number; y: number } = { x: 0, y: 0 }
): Position {
  // Get the center of the selection
  const selectionCenter = {
    x: selectionRect.left + selectionRect.width / 2,
    y: selectionRect.top + selectionRect.height / 2
  }

  // Initial position (centered below selection)
  let x = selectionCenter.x - menuDimensions.width / 2 + offset.x
  let y = selectionRect.bottom + 10 + offset.y // 10px gap

  // Ensure menu stays within viewport and editor horizontally
  const minX = Math.max(0, constraints.editorRect.left)
  const maxX = Math.min(
    constraints.viewportWidth - menuDimensions.width,
    constraints.editorRect.right - menuDimensions.width
  )
  x = Math.max(minX, Math.min(maxX, x))

  // Check if menu would go below viewport or editor
  const bottomOverflow = y + menuDimensions.height > Math.min(
    constraints.viewportHeight,
    constraints.editorRect.bottom
  )

  // If it overflows bottom, position above selection
  if (bottomOverflow) {
    y = selectionRect.top - menuDimensions.height - 10 // 10px gap
  }

  // Ensure menu stays within viewport and editor vertically
  const minY = Math.max(0, constraints.editorRect.top)
  const maxY = Math.min(
    constraints.viewportHeight - menuDimensions.height,
    constraints.editorRect.bottom - menuDimensions.height
  )
  y = Math.max(minY, Math.min(maxY, y))

  return { x, y }
}

export function calculateSubmenuPosition(
  mainMenuRect: DOMRect,
  submenuDimensions: Dimensions,
  constraints: ViewportConstraints
): Position {
  // Try to position submenu to the right of main menu
  let x = mainMenuRect.right + 8 // 8px gap
  let y = mainMenuRect.top

  // Check if submenu would go outside viewport or editor on the right
  const rightOverflow = x + submenuDimensions.width > Math.min(
    constraints.viewportWidth,
    constraints.editorRect.right
  )

  // If it overflows right, position to the left of main menu
  if (rightOverflow) {
    x = mainMenuRect.left - submenuDimensions.width - 8 // 8px gap
  }

  // Ensure submenu stays within viewport and editor vertically
  const maxY = Math.min(
    constraints.viewportHeight - submenuDimensions.height,
    constraints.editorRect.bottom - submenuDimensions.height
  )
  y = Math.max(constraints.editorRect.top, Math.min(maxY, y))

  return { x, y }
}

export function calculateOptimalPosition(
  targetRect: DOMRect,
  menuDimensions: Dimensions,
  editorRect: DOMRect,
  viewportHeight: number,
  viewportWidth: number
): Position {
  // Start with default position below selection
  let x = targetRect.left;
  let y = targetRect.bottom + 8; // 8px gap

  // Horizontal positioning
  if (x + menuDimensions.width > viewportWidth) {
    x = Math.max(0, viewportWidth - menuDimensions.width - 8);
  }
  x = Math.max(editorRect.left + 8, x); // Keep within editor left bound

  // Vertical positioning
  const spaceBelow = viewportHeight - y;
  const spaceAbove = targetRect.top - editorRect.top;

  // If not enough space below, try to place it above
  if (spaceBelow < menuDimensions.height && spaceAbove > menuDimensions.height) {
    y = targetRect.top - menuDimensions.height - 8;
  }

  // If still overflowing, align with editor top
  if (y < editorRect.top) {
    y = editorRect.top + 8;
  }

  return { x, y };
} 