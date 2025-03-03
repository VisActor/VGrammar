export const spirals: Record<string, (size: [number, number]) => (t: number) => [number, number]> = {
  archimedean: archimedeanSpiral,
  rectangular: rectangularSpiral
};

function archimedeanSpiral(size: [number, number]) {
  const e = size[0] / size[1];
  return (t: number) => {
    return [e * (t *= 0.1) * Math.cos(t), t * Math.sin(t)] as [number, number];
  };
}

function rectangularSpiral(size: [number, number]) {
  const dy = 4;
  const dx = (dy * size[0]) / size[1];
  let x = 0;
  let y = 0;
  return (t: number) => {
    const sign = t < 0 ? -1 : 1;
    // See triangular numbers: T_n = n * (n + 1) / 2.
    switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
      case 0:
        x += dx;
        break;
      case 1:
        y += dy;
        break;
      case 2:
        x -= dx;
        break;
      default:
        y -= dy;
        break;
    }
    return [x, y] as [number, number];
  };
}
