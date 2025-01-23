'use client'

interface EmojiPickerProps {
  selectedEmoji: string
  onSelect: (emoji: string) => void
}

const EMOJI_OPTIONS = [
  // Animals
  '🐱', '🐶', '🦊', '🐰', '🐼', '🦁', '🐨', '🐸',
  '🦉', '🦋', '🐢', '🦒', '🐘', '🦔', '🐝', '🐞',
  
  // Plants
  '🌱', '🌿', '🌵', '🌴', '🌳', '🍀', '🌸', '🌺',
  '🌻', '🌹', '🌷', '🌼', '🍄', '🎋', '🌾', '🪴'
]

export default function EmojiPicker({ selectedEmoji, onSelect }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {EMOJI_OPTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className={`text-2xl p-2 rounded-lg transition-all duration-200
            ${selectedEmoji === emoji 
              ? 'bg-green-100 dark:bg-green-900 scale-110' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110'
            }`}
          title="Select emoji"
        >
          {emoji}
        </button>
      ))}
    </div>
  )
} 