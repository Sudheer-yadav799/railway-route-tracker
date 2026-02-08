import React, { useState } from 'react'

type SearchBarProps = {
  suggestions: string[]
  onSelect: (value: string) => void
  onSearch: (query: string) => void
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 280,
    background: 'rgba(255,255,255,0.97)',
    padding: '12px',
    borderRadius: 10,
    boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
    zIndex: 9999
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6
  },
  inputRow: {
    display: 'flex',
    gap: 6
  },
  input: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 14,
    outline: 'none'
  },
  button: {
    padding: '8px 12px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    background: '#2563eb',
    color: '#fff',
    fontSize: 14
  },
  suggestionsList: {
    listStyle: 'none',
    padding: 0,
    margin: '8px 0 0',
    maxHeight: 160,
    overflowY: 'auto',
    borderTop: '1px solid #e5e7eb'
  },
  suggestionItem: {
    padding: '6px 8px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee'
  }
}

const SearchBar: React.FC<SearchBarProps> = ({
  suggestions,
  onSelect,
  onSearch
}) => {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)

  const handleSearchClick = () => {
    if (!query) return
    onSelect(query)
    setShowSuggestions(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    setShowSuggestions(true)
    onSearch(val)
  }

  return (
    <div style={styles.container}>
      <div style={styles.label}>🔍 Search </div>

      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="Enter pole name..."
          value={query}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
          style={styles.input}
        />
        <button style={styles.button} onClick={handleSearchClick}>
          Search
        </button>
      </div>

      {query && showSuggestions && suggestions.length > 0 && (
        <ul style={styles.suggestionsList}>
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              style={styles.suggestionItem}
              onClick={() => {
                onSelect(s)
                setQuery(s)
                setShowSuggestions(false)
              }}
            >
              📍 {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
