import React from 'react';

export default function FilterChip({ active, inactive, color, onClick, label, icon: Icon }) {
    return (
        <button
            onClick={onClick}
            className={`
        px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 text-[11px] sm:text-xs font-semibold
        inline-flex items-center gap-1 sm:gap-1.5 m-[2px] sm:m-[3px] transition-all duration-200
        hover:scale-[1.03] active:scale-[0.97]
        ${inactive ? 'opacity-40 saturate-50' : ''}
      `}
            style={{
                borderColor: active ? color : '#333',
                backgroundColor: active ? `${color}22` : 'transparent',
                color: active ? color : '#888',
            }}
        >
            {Icon && <Icon size={14} className={active ? '' : 'opacity-60'} />}
            {label}
        </button>
    );
}
