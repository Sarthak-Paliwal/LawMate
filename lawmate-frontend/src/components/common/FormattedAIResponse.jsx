/**
 * FormattedAIResponse — shared component for rendering AI markdown responses
 * Handles: **bold**, ## headings, numbered lists, bullet points, cleans stray symbols.
 */

function cleanInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{boldMatch[1]}</strong>;
    }
    const cleaned = part.replace(/(?<!\w)\*(?!\*)/g, '').replace(/#+/g, '').trim();
    return cleaned ? <span key={i}>{cleaned}</span> : null;
  });
}

export default function FormattedAIResponse({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={i} className="h-2" />);
      return;
    }

    // Heading lines: ###, ##, #
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      elements.push(
        <div key={i} className="font-semibold text-[14px] mt-2.5 mb-1 text-slate-900 dark:text-white">
          {cleanInline(headingMatch[2])}
        </div>
      );
      return;
    }

    // Numbered list: 1. or 1)
    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.*)/);
    if (numberedMatch) {
      elements.push(
        <div key={i} className="flex gap-2 mt-1">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400 min-w-[1.2em] text-right">{numberedMatch[1]}.</span>
          <span>{cleanInline(numberedMatch[2])}</span>
        </div>
      );
      return;
    }

    // Bullet list: - or * or •
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)/);
    if (bulletMatch) {
      elements.push(
        <div key={i} className="flex gap-2 mt-1 pl-1">
          <span className="text-indigo-500 dark:text-indigo-400 flex-shrink-0">•</span>
          <span>{cleanInline(bulletMatch[1])}</span>
        </div>
      );
      return;
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="mt-1 leading-relaxed">
        {cleanInline(trimmed)}
      </p>
    );
  });

  return (
    <div className="text-[13.5px] space-y-0.5 text-slate-700 dark:text-slate-300">
      {elements}
    </div>
  );
}
