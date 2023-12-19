export function isHorizontal(direction: string) {
  return direction === 'horizontal';
}

export function isVertical(direction: string) {
  return direction === 'vertical';
}

export function isValidDirection(direction: string) {
  return direction === 'vertical' || direction === 'horizontal';
}

export function isValidPosition(position: string) {
  return position === 'top' || position === 'bottom' || position === 'left' || position === 'right';
}

export function isHorizontalPosition(position: string) {
  return position === 'top' || position === 'bottom';
}
