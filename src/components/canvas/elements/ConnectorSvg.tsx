import { CanvasElement, ConnectorElement } from '../../../types/canvas';
import { computeConnectorPath, pathMidpoint } from '../../../utils/canvas/connectorPath';

interface ConnectorSvgProps {
  connector: ConnectorElement;
  elements: CanvasElement[];
  isSelected: boolean;
  scale: number;
}

export function ConnectorSvg({ connector, elements, isSelected, scale }: ConnectorSvgProps) {
  const from = elements.find(e => e.id === connector.fromId);
  const to = elements.find(e => e.id === connector.toId);
  if (!from || !to) return null;

  const d = computeConnectorPath(from, to, connector.fromAnchor, connector.toAnchor, connector.pathType);
  const mid = pathMidpoint(d);
  const arrowId = `arrow-${connector.id}`;
  const sw = connector.strokeWidth;

  return (
    <g>
      <defs>
        <marker
          id={arrowId}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={connector.strokeColor}
          />
        </marker>
      </defs>

      {/* Hit area */}
      <path d={d} fill="none" stroke="transparent" strokeWidth={(sw + 12) / scale} />

      {/* Connector line */}
      <path
        d={d}
        fill="none"
        stroke={connector.strokeColor}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#${arrowId})`}
      />

      {isSelected && (
        <path
          d={d}
          fill="none"
          stroke="#4A90E2"
          strokeWidth={(sw + 4) / scale}
          opacity={0.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {connector.label && (
        <text
          x={mid.x}
          y={mid.y - 8}
          textAnchor="middle"
          fontSize={12}
          fill="#474747"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {connector.label}
        </text>
      )}
    </g>
  );
}
