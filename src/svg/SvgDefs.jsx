import React from 'react';

/**
 * SvgDefs (GEMINI_FULL_SPEC_ACID_V4 §6.1)
 * Shared gradients, filters, and markers mounted at app level.
 * Prefixed with 'sx-' to prevent duplicate SVG ID conflicts across slides.
 */
export default function SvgDefs() {
  return (
    <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <defs>
        {/* === 1. CPK 3D Sphere Atom Shading with Specular Glint & Fresnel Rim === */}
        {/* Nitrogen (N) */}
        <radialGradient id="sx-atom-n" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#C4FAFF" />
          <stop offset="25%" stopColor="#54D7E8" />
          <stop offset="65%" stopColor="#1B4965" />
          <stop offset="100%" stopColor="#07192A" />
        </radialGradient>

        {/* Oxygen (O) */}
        <radialGradient id="sx-atom-o" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFD3C4" />
          <stop offset="25%" stopColor="#FF875F" />
          <stop offset="65%" stopColor="#C0392B" />
          <stop offset="100%" stopColor="#54160E" />
        </radialGradient>

        {/* Hydrogen (H) */}
        <radialGradient id="sx-atom-h" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E2E8F0" />
          <stop offset="75%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>

        {/* Calcium (Ca) */}
        <radialGradient id="sx-atom-ca" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FEF9E7" />
          <stop offset="30%" stopColor="#F9E79F" />
          <stop offset="70%" stopColor="#B7950B" />
          <stop offset="100%" stopColor="#5B4502" />
        </radialGradient>

        {/* Sulfur (S) */}
        <radialGradient id="sx-atom-s" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="35%" stopColor="#EAB308" />
          <stop offset="75%" stopColor="#A16207" />
          <stop offset="100%" stopColor="#422006" />
        </radialGradient>

        {/* Carbon (C) */}
        <radialGradient id="sx-atom-c" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="35%" stopColor="#64748B" />
          <stop offset="75%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>

        {/* Aluminum (Al) */}
        <radialGradient id="sx-atom-al" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#E0E7FF" />
          <stop offset="35%" stopColor="#A5B4FC" />
          <stop offset="70%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#312E81" />
        </radialGradient>

        {/* Liquid Water Droplet Shading */}
        <radialGradient id="sx-droplet-3d" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#E0F9FF" stopOpacity="0.8" />
          <stop offset="35%" stopColor="#54D7E8" stopOpacity="0.6" />
          <stop offset="75%" stopColor="#1B4965" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#061A28" stopOpacity="0.98" />
        </radialGradient>

        {/* === 2. Glow Filters === */}
        <filter id="sx-glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="sx-glow-lime" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="sx-glow-coral" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="sx-glow-amber" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* === 3. Directional Markers === */}
        <marker
          id="sx-arrow-cyan"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#54D7E8" />
        </marker>

        <marker
          id="sx-arrow-lime"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#D8F36A" />
        </marker>

        <marker
          id="sx-arrow-coral"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#FF875F" />
        </marker>

        <marker
          id="sx-arrow-white"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#FFFFFF" />
        </marker>
      </defs>
    </svg>
  );
}
