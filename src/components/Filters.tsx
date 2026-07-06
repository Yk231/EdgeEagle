'use client'

import { useState } from 'react'

interface Props {
  options: string[]
  label: string
  selected: Set<string>
  onToggle: (value: string) => void
  onToggleAll?: (allSelected: boolean) => void
  names?: Record<string, string>
}

export default function Filter({ options, label, selected, onToggle, onToggleAll, names }: Props) {
  const [search, setSearch] = useState('')

  const filtered = options.filter(o =>
    (names?.[o] ?? o).toLowerCase().includes(search.toLowerCase())
  )

  const allSelected = options.every(o => selected.has(o))

  return (
    <div className="relative">
      <details className="group">
        <summary className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 border border-gray-800 rounded cursor-pointer hover:border-gray-600 hover:text-white transition-colors list-none">
          <span>{label}</span>
          <span className="text-gray-600">({selected.size})</span>
          <svg className="w-3 h-3 text-gray-600 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>

        <div className="absolute top-full left-0 mt-1 bg-[#0D1321] border border-gray-800 rounded-lg shadow-xl z-20 py-1 min-w-[180px]">
          
          {/* Search */}
          <div className="px-3 py-2 border-b border-gray-800">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600"
            />
          </div>

          {/* Toggle all */}
          {onToggleAll && (
            <label className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-gray-800/50 border-b border-gray-800/50 transition-colors">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onToggleAll(allSelected)}
                className="accent-emerald-400 w-3 h-3 shrink-0"
              />
              <span className="text-xs text-gray-500 font-medium">
                {allSelected ? 'Deselect all' : 'Select all'}
              </span>
            </label>
          )}

          {/* Options */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-600 px-3 py-2">No results</p>
            ) : (
              filtered.map(option => (
                <label key={option} className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-gray-800/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selected.has(option)}
                    onChange={() => onToggle(option)}
                    className="accent-emerald-400 w-3 h-3 shrink-0"
                  />
                  <span className="text-xs text-gray-300">{names?.[option] ?? option}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </details>
    </div>
  )
}