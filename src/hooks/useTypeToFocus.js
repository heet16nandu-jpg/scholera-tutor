import { useEffect } from 'react'

/**
 * A keystroke is safe to redirect only when nothing else is focused.
 *
 * Anything focusable — the chips, the citation toggles, the copy buttons, the
 * input itself — has its own keyboard behaviour (Enter and Space activate a
 * button, Tab moves on). Capturing while one of those holds focus would break
 * it, so the rule is deliberately strict: capture only from the document body.
 */
function nothingElseFocused() {
  const el = document.activeElement
  return !el || el === document.body || el === document.documentElement
}

/**
 * A printable character, not a shortcut and not a named key.
 *
 * `key.length === 1` is what separates "a", "7" and " " from "Tab", "Escape",
 * "Enter", "ArrowLeft" and every other named key — those are all longer than
 * one character, so they fall out for free. Ctrl/Cmd/Alt mean the keystroke
 * belongs to a shortcut (Ctrl+A, Ctrl+C, Ctrl+R), so it is left alone. Shift is
 * allowed through, since that is just a capital letter.
 */
function isPrintable(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return false
  // Mid-composition keystrokes belong to the IME, not to us.
  if (event.isComposing || event.keyCode === 229) return false
  return event.key.length === 1
}

/**
 * Types-anywhere and paste-anywhere for the composer, the way Slack and Discord
 * behave: start typing with nothing focused and the keystroke lands in the
 * input rather than being lost.
 *
 * @param {object} inputRef   ref to the composer's <input>
 * @param {boolean} disabled  true while streaming — no capture at all
 * @param {(text: string) => void} onPasteText  appends pasted text
 */
export function useTypeToFocus(inputRef, { disabled, onPasteText }) {
  useEffect(() => {
    if (disabled) return undefined

    const target = () => {
      const input = inputRef.current
      if (!input || input.disabled) return null
      if (document.activeElement === input) return null
      return nothingElseFocused() ? input : null
    }

    const onKeyDown = (event) => {
      if (event.defaultPrevented || !isPrintable(event)) return
      const input = target()
      if (!input) return
      // Focus only — no preventDefault. The browser delivers this same
      // keystroke to the newly focused input, so the character is not lost and
      // IME/dead-key handling stays with the browser.
      input.focus()
    }

    const onPaste = (event) => {
      if (event.defaultPrevented) return
      const input = target()
      if (!input) return
      const text = event.clipboardData?.getData('text')
      if (!text) return
      // Focusing mid-event does not redirect an in-flight paste, so this one
      // has to be applied by hand.
      event.preventDefault()
      input.focus()
      onPasteText(text)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('paste', onPaste)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('paste', onPaste)
    }
  }, [inputRef, disabled, onPasteText])
}
