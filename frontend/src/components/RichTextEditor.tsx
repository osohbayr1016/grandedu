"use client";

import { useRef, useState } from "react";

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Энд бичнэ үү...",
  disabled = false,
  className = "",
  rows = 6,
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Simple markdown-like formatting helpers
  const formatText = (type: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let formattedText = "";

    switch (type) {
      case "bold":
        formattedText = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        formattedText = `*${selectedText || "italic text"}*`;
        break;
      case "heading":
        formattedText = `# ${selectedText || "Heading"}`;
        break;
      case "link":
        formattedText = `[${selectedText || "link text"}](url)`;
        break;
      case "list":
        formattedText = `- ${selectedText || "list item"}`;
        break;
      default:
        return;
    }

    const newValue = beforeText + formattedText + afterText;
    onChange(newValue);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Insert text at cursor position
  const insertText = (text: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    const newValue = beforeText + text + afterText;
    onChange(newValue);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Simple markdown preview renderer
  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^# (.*$)/gm, '<h2 class="text-lg font-bold mb-2">$1</h2>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
      )
      .replace(/\n/g, "<br />");
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-t-lg border border-gray-200">
        <button
          type="button"
          onClick={() => formatText("bold")}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded text-sm font-semibold disabled:opacity-50"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => formatText("italic")}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded italic disabled:opacity-50"
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => formatText("heading")}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded text-sm disabled:opacity-50"
          title="Heading"
        >
          H
        </button>
        <button
          type="button"
          onClick={() => formatText("link")}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded text-sm disabled:opacity-50"
          title="Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => formatText("list")}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded text-sm disabled:opacity-50"
          title="List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => insertText("\n\n---\n\n")}
          disabled={disabled}
          className="p-2 hover:bg-gray-200 rounded text-sm disabled:opacity-50"
          title="Horizontal Rule"
        >
          ──
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          disabled={disabled}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            isPreview
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {isPreview ? "Засах" : "Урьдчилан харах"}
        </button>
      </div>

      {/* Editor/Preview Area */}
      <div className="border border-gray-200 rounded-b-lg">
        {isPreview ? (
          <div className="p-4 bg-gray-50 min-h-[200px] prose prose-sm max-w-none">
            <div
              className="text-gray-900"
              dangerouslySetInnerHTML={{
                __html: value
                  ? renderPreview(value)
                  : "<p class='text-gray-500 italic'>Хоосон байна...</p>",
              }}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className="w-full p-4 border-0 resize-none focus:ring-0 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Форматлах заавар:</strong>
        </p>
        <p>
          • <strong>**bold**</strong> - Тодруулах
        </p>
        <p>
          • <em>*italic*</em> - Налуу
        </p>
        <p>
          • <code># Heading</code> - Гарчиг
        </p>
        <p>
          • <code>- List item</code> - Жагсаалт
        </p>
        <p>
          • <code>[text](url)</code> - Холбоос
        </p>
      </div>
    </div>
  );
}
