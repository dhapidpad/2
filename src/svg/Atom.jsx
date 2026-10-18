import React from 'react';

/**
 * Atom Component (GEMINI_FULL_SPEC_ACID_V4 §6.2)
 * Pseudo-3D sphere atom with scientific CPK colors, specular lighting, and rim glint.
 */
export default function Atom({
  element = 'N',
  radius = 28,
  cx = 0,
  cy = 0,
  charge = '',
  showLabel = true,
  className = '',
}) {
  const el = element.toUpperCase();
  let fillId = 'url(#sx-atom-n)';
  let strokeColor = '#54D7E8';
  let textColor = '#FFFFFF';

  if (el === 'O') {
    fillId = 'url(#sx-atom-o)';
    strokeColor = '#FF875F';
  } else if (el === 'H') {
    fillId = 'url(#sx-atom-h)';
    strokeColor = '#E2E8F0';
    textColor = '#0F172A';
  } else if (el === 'CA') {
    fillId = 'url(#sx-atom-ca)';
    strokeColor = '#F4D03F';
  } else if (el === 'S') {
    fillId = 'url(#sx-atom-s)';
    strokeColor = '#FACC15';
    textColor = '#050E17';
  } else if (el === 'C') {
    fillId = 'url(#sx-atom-c)';
    strokeColor = '#94A3B8';
  } else if (el === 'AL') {
    fillId = 'url(#sx-atom-al)';
    strokeColor = '#818CF8';
  }

  return (
    <g transform={`translate(${cx}, ${cy})`} className={className}>
      {/* Outer ambient glow ring */}
      <circle
        r={radius + 3}
        fill={strokeColor}
        opacity="0.12"
      />

      {/* Main Specular 3D Sphere */}
      <circle
        r={radius}
        fill={fillId}
        stroke={strokeColor}
        strokeWidth={radius > 20 ? 2 : 1.2}
      />

      {/* Primary Specular Highlight glint (Top-Left) */}
      <ellipse
        cx={-radius * 0.35}
        cy={-radius * 0.35}
        rx={radius * 0.32}
        ry={radius * 0.22}
        transform={`rotate(-25 ${-radius * 0.35} ${-radius * 0.35})`}
        fill="#FFFFFF"
        opacity="0.55"
      />

      {/* Secondary soft bounce highlight (Bottom-Right) */}
      <circle
        cx={radius * 0.32}
        cy={radius * 0.35}
        r={radius * 0.18}
        fill="#FFFFFF"
        opacity="0.16"
      />

      {/* Symbol label with dark stroke outline for crystal readability */}
      {showLabel && (
        <text
          x="0"
          y={radius * 0.35}
          textAnchor="middle"
          fill={textColor}
          fontSize={Math.round(radius * 0.76)}
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          paintOrder="stroke"
          stroke="#050E17"
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="select-none pointer-events-none"
        >
          {element}
        </text>
      )}

      {/* Oxidation state or ionic charge indicator badge */}
      {charge && (
        <g transform={`translate(${radius * 0.72}, ${-radius * 0.45})`}>
          <text
            x="0"
            y="0"
            fill={strokeColor}
            fontSize={Math.round(radius * 0.55)}
            fontWeight="900"
            paintOrder="stroke"
            stroke="#050E17"
            strokeWidth="3"
            className="select-none pointer-events-none font-mono"
          >
            {charge}
          </text>
        </g>
      )}
    </g>
  );
}
