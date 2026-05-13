import { CanvasElement, AnchorSide, Point, getAnchorPoint } from '../../types/canvas';

const STUB = 30; // pixels stub from anchor before routing

export function computeConnectorPath(
  from: CanvasElement,
  to: CanvasElement,
  fromAnchor: AnchorSide,
  toAnchor: AnchorSide,
  pathType: 'straight' | 'elbow' | 'curved'
): string {
  const p1 = getAnchorPoint(from, fromAnchor);
  const p2 = getAnchorPoint(to, toAnchor);

  if (pathType === 'straight') {
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  }

  if (pathType === 'curved') {
    const cp1 = stubPoint(p1, fromAnchor, STUB * 3);
    const cp2 = stubPoint(p2, toAnchor, STUB * 3);
    return `M ${p1.x} ${p1.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;
  }

  // elbow – orthogonal routing
  return elbowPath(p1, fromAnchor, p2, toAnchor);
}

function stubPoint(p: Point, side: AnchorSide, dist: number): Point {
  switch (side) {
    case 'top':    return { x: p.x, y: p.y - dist };
    case 'bottom': return { x: p.x, y: p.y + dist };
    case 'left':   return { x: p.x - dist, y: p.y };
    case 'right':  return { x: p.x + dist, y: p.y };
  }
}

function elbowPath(p1: Point, side1: AnchorSide, p2: Point, side2: AnchorSide): string {
  const s1 = stubPoint(p1, side1, STUB);
  const s2 = stubPoint(p2, side2, STUB);

  const horizontal1 = side1 === 'left' || side1 === 'right';
  const horizontal2 = side2 === 'left' || side2 === 'right';

  let midX: number, midY: number;

  if (horizontal1 && horizontal2) {
    midX = (s1.x + s2.x) / 2;
    return `M ${p1.x} ${p1.y} L ${s1.x} ${s1.y} L ${midX} ${s1.y} L ${midX} ${s2.y} L ${s2.x} ${s2.y} L ${p2.x} ${p2.y}`;
  }

  if (!horizontal1 && !horizontal2) {
    midY = (s1.y + s2.y) / 2;
    return `M ${p1.x} ${p1.y} L ${s1.x} ${s1.y} L ${s1.x} ${midY} L ${s2.x} ${midY} L ${s2.x} ${s2.y} L ${p2.x} ${p2.y}`;
  }

  if (horizontal1) {
    return `M ${p1.x} ${p1.y} L ${s1.x} ${s1.y} L ${s1.x} ${s2.y} L ${s2.x} ${s2.y} L ${p2.x} ${p2.y}`;
  }

  return `M ${p1.x} ${p1.y} L ${s1.x} ${s1.y} L ${s2.x} ${s1.y} L ${s2.x} ${s2.y} L ${p2.x} ${p2.y}`;
}

export function pathMidpoint(path: string): Point {
  // Approximate midpoint by parsing the first M and last L
  const nums = path.match(/-?\d+\.?\d*/g)?.map(Number) || [];
  if (nums.length < 4) return { x: 0, y: 0 };
  const x = (nums[0] + nums[nums.length - 2]) / 2;
  const y = (nums[1] + nums[nums.length - 1]) / 2;
  return { x, y };
}
