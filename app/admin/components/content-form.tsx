"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function TextField({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  type?: string
}) {
  return (
    <div>
      <label className="label-mono text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}

export function TextArea({
  label,
  value,
  onChange,
  required,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  rows?: number
}) {
  return (
    <div>
      <label className="label-mono text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={rows}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}

export function TagInput({
  label,
  tags,
  onChange,
}: {
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
}) {
  const [input, setInput] = useState("")

  function addTag() {
    const t = input.trim()
    if (t && !tags.includes(t)) {
      onChange([...tags, t])
    }
    setInput("")
  }

  function removeTag(t: string) {
    onChange(tags.filter((x) => x !== t))
  }

  return (
    <div>
      <label className="label-mono text-muted-foreground">{label}</label>
      <div className="mt-1 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addTag()
            }
          }}
          placeholder="Type and press Enter"
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded-xl border border-border px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-primary"
        >
          Add
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-background/50 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40"
          >
            {t}
            <button
              type="button"
              onClick={() => removeTag(t)}
              className="text-muted-foreground hover:text-destructive"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded-lg border-border bg-background text-primary"
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </label>
  )
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className="label-mono text-muted-foreground">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}

export function FormActions({
  loading,
  onCancel,
}: {
  loading: boolean
  onCancel: () => void
}) {
  return (
    <div className="flex gap-3">
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-primary-foreground transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="rounded-xl border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  )
}
