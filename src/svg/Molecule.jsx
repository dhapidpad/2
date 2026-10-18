import React from 'react';
import Atom from './Atom';

/**
 * Molecule Component (GEMINI_FULL_SPEC_ACID_V4 §6.2)
 * Renders scientific molecules with proper geometry, realistic cylindrical bonds, and annotations.
 */
export default function Molecule({
  type = 'NO2',
  scale = 1,
  cx = 0,
  cy = 0,
  showFormula = true,
  className = '',
}) {
  const mol = type.toUpperCase();

  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`} className={className}>
      {/* 1. N2 Molecule: N ≡ N (Triple bond) */}
      {mol === 'N2' && (
        <g>
          {/* Triple cylindrical bonds with gradient thickness */}
          <line x1="-30" y1="-7" x2="30" y2="-7" stroke="#54D7E8" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.95" />
          <line x1="-30" y1="7" x2="30" y2="7" stroke="#54D7E8" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          <Atom element="N" radius={25} cx={-32} cy={0} />
          <Atom element="N" radius={25} cx={32} cy={0} />
          {showFormula && (
            <text x="0" y="48" textAnchor="middle" fill="#54D7E8" fontSize="13.5" fontWeight="900" fontFamily="monospace">
              N₂ (N ≡ N)
            </text>
          )}
        </g>
      )}

      {/* 2. O2 Molecule: O = O (Double bond) */}
      {mol === 'O2' && (
        <g>
          {/* Double bond */}
          <line x1="-26" y1="-4.5" x2="26" y2="-4.5" stroke="#FF875F" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-26" y1="4.5" x2="26" y2="4.5" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
          <Atom element="O" radius={23} cx={-28} cy={0} />
          <Atom element="O" radius={23} cx={28} cy={0} />
          {showFormula && (
            <text x="0" y="46" textAnchor="middle" fill="#FF875F" fontSize="13.5" fontWeight="900" fontFamily="monospace">
              O₂ (O = O)
            </text>
          )}
        </g>
      )}

      {/* 3. NO Molecule: N = O (Radical with bond order 2.5) */}
      {mol === 'NO' && (
        <g>
          {/* Bonds */}
          <line x1="-28" y1="-5" x2="28" y2="-5" stroke="#54D7E8" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-28" y1="2" x2="28" y2="2" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="-28" y1="9" x2="28" y2="9" stroke="#FF875F" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.8" />
          <Atom element="N" radius={25} cx={-30} cy={0} charge="+2" />
          <Atom element="O" radius={23} cx={30} cy={0} />
          {/* Radical unpaired electron dot */}
          <circle cx={-30} cy={-28} r="3.5" fill="#D8F36A" stroke="#050E17" strokeWidth="1" />
          {showFormula && (
            <text x="0" y="48" textAnchor="middle" fill="#54D7E8" fontSize="13.5" fontWeight="900" fontFamily="monospace">
              •NO (Bậc 2,5)
            </text>
          )}
        </g>
      )}

      {/* 4. NO2 Molecule: Bent geometry with 134° angle */}
      {mol === 'NO2' && (
        <g>
          {/* Cylindrical resonant bonds */}
          <line x1="0" y1="-12" x2="-40" y2="30" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="0" y1="-12" x2="-40" y2="30" stroke="#FF875F" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="0" y1="-12" x2="40" y2="30" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="0" y1="-12" x2="40" y2="30" stroke="#FF875F" strokeWidth="2" strokeDasharray="4 3" />

          {/* Angle arc */}
          <path d="M -18 3 Q 0 16 18 3" fill="none" stroke="#D8F36A" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Atoms */}
          <Atom element="O" radius={21} cx={-40} cy={30} />
          <Atom element="O" radius={21} cx={40} cy={30} />
          <Atom element="N" radius={25} cx={0} cy={-12} charge="+4" />

          {/* Radical dot on Nitrogen */}
          <circle cx={0} cy={-39} r="3" fill="#D8F36A" />

          {showFormula && (
            <text x="0" y="68" textAnchor="middle" fill="#FF875F" fontSize="13" fontWeight="900" fontFamily="monospace">
              NO₂ (134°)
            </text>
          )}
        </g>
      )}

      {/* 5. HNO3 Molecule: Planar structure */}
      {mol === 'HNO3' && (
        <g>
          {/* Nitrogen center bonds */}
          <line x1="0" y1="-14" x2="-42" y2="18" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <line x1="0" y1="-14" x2="42" y2="18" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <line x1="0" y1="-14" x2="0" y2="-52" stroke="#FF875F" strokeWidth="4.5" strokeLinecap="round" />
          {/* H-O bond */}
          <line x1="42" y1="18" x2="68" y2="38" stroke="#D8F36A" strokeWidth="3" strokeLinecap="round" />

          <Atom element="O" radius={20} cx={0} cy={-52} />
          <Atom element="O" radius={20} cx={-42} cy={18} />
          <Atom element="O" radius={20} cx={42} cy={18} />
          <Atom element="H" radius={14} cx={70} cy={40} />
          <Atom element="N" radius={26} cx={0} cy={-14} charge="+5" />

          {showFormula && (
            <text x="0" y="64" textAnchor="middle" fill="#D8F36A" fontSize="13.5" fontWeight="900" fontFamily="monospace">
              HNO₃ (Phẳng)
            </text>
          )}
        </g>
      )}

      {/* 6. H2O Molecule: Bent 104.5° */}
      {mol === 'H2O' && (
        <g>
          <line x1="0" y1="-8" x2="-28" y2="18" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="0" y1="-8" x2="28" y2="18" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          <Atom element="O" radius={23} cx={0} cy={-8} />
          <Atom element="H" radius={14} cx={-28} cy={18} />
          <Atom element="H" radius={14} cx={28} cy={18} />
          {showFormula && (
            <text x="0" y="48" textAnchor="middle" fill="#54D7E8" fontSize="13" fontWeight="900" fontFamily="monospace">
              H₂O (104,5°)
            </text>
          )}
        </g>
      )}
    </g>
  );
}
