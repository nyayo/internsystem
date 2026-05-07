import React from "react";

export default function StatusFilterTabs({ activeFilter, options, onChange }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {options.map((option) => (
        <button
          key={option.value}
          className="btn-view"
          onClick={() => onChange(option.value)}
          style={
            activeFilter === option.value
              ? { background: "var(--color-primary)", color: "white" }
              : {}
          }
        >
          {option.label}
          {typeof option.count === "number" ? ` (${option.count})` : ""}
        </button>
      ))}
    </div>
  );
}
