"use client";

import { useState } from "react";
import { X } from "lucide-react";

const TagsInput = ({
  value = [],
  onChange,
  placeholder = "Добавьте ключевое слово",
  maxTags = 12,
}) => {
  const [draft, setDraft] = useState("");

  const handleAdd = (rawValue) => {
    const trimmed = rawValue.trim();
    if (!trimmed) return;
    if (value.length >= maxTags) return;
    const lowerCaseValue = trimmed.toLowerCase();
    if (value.some((item) => item.toLowerCase() === lowerCaseValue)) {
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      handleAdd(draft);
    }
  };

  const handleBlur = () => {
    handleAdd(draft);
  };

  const handleRemove = (tag) => {
    onChange(value.filter((item) => item !== tag));
  };

  return (
    <div className="rounded-md border border-input bg-background p-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary rounded-full text-muted-foreground"
          >
            {tag}
            <button
              type="button"
              className="text-[10px] flex items-center justify-center w-4 h-4 rounded-full bg-foreground text-background"
              onClick={() => handleRemove(tag)}
              aria-label={`Удалить ключевое слово ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={value.length >= maxTags}
        placeholder={
          value.length >= maxTags
            ? "Достигнут лимит ключевых слов"
            : placeholder
        }
        className="w-full text-sm bg-transparent outline-none"
      />
      <p className="text-[11px] text-muted-foreground">
        До {maxTags} ключевых слов, разделенных Enter или запятой.
      </p>
    </div>
  );
};

export default TagsInput;
