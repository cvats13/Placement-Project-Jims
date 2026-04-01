export function HighlightedText({ text, searchTokens }) {
  if (searchTokens.length === 0) {
    return <span>{text}</span>;
  }

  // Create a case-insensitive regex pattern for all search tokens
  const pattern = searchTokens
    .map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  
  if (!pattern) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = searchTokens.some(token => 
          part.toLowerCase() === token.toLowerCase()
        );
        
        return isMatch ? (
          <mark 
            key={index} 
            className="bg-indigo-200 text-indigo-900 px-1 rounded font-medium"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
}
