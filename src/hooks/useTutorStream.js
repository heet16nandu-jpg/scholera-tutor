import { useCallback, useEffect, useRef, useState } from 'react'
import { getScenario, streamResponse } from '../data/mock-stream.mjs'

let counter = 0
const makeId = () => `local_${++counter}`

// Upper bound on how often the growing message is re-rendered while streaming.
const FLUSH_MS = 60

/**
 * Owns the conversation and the one in-flight tutor turn.
 *
 * Committed history lives in `messages`; the turn currently arriving lives in
 * `pending` and is moved into `messages` exactly once, when it settles.
 */
export function useTutorStream(initialMessages) {
  const [messages, setMessages] = useState(initialMessages)
  const [pending, setPending] = useState(null)

  // The in-flight turn is mirrored in refs as well as state so that stop() can
  // read the partial text and settle synchronously, without waiting for a
  // re-render or reading a stale closure.
  const abortRef = useRef(null)
  const turnRef = useRef(null)
  const timerRef = useRef(0)
  const lastFlushRef = useRef(0)

  /**
   * Push the accumulated text into state at most once every FLUSH_MS.
   *
   * Every render re-parses the whole markdown document and re-typesets its
   * maths, so a chunk-by-chunk render makes the stream lag its own timings.
   * Measured on a production build, `long` takes 9.4s per-chunk against the
   * 4.1s its timings ask for, and 7.8s coalesced — roughly a 17% recovery on
   * the heavy scenarios, and no measurable difference on short ones. Chunks
   * all still arrive and none are dropped; only the repaints are merged.
   *
   * Deliberately a timer rather than requestAnimationFrame: rAF is throttled
   * when the page is not painting (background tabs, headless), which stalled
   * the stream instead of speeding it up.
   */
  const scheduleFlush = useCallback(() => {
    if (timerRef.current) return
    const wait = Math.max(0, FLUSH_MS - (Date.now() - lastFlushRef.current))
    timerRef.current = setTimeout(() => {
      timerRef.current = 0
      const turn = turnRef.current
      if (!turn || turn.settled) return
      lastFlushRef.current = Date.now()
      setPending({ id: turn.id, text: turn.text, phase: 'streaming' })
    }, wait)
  }, [])

  /**
   * Move the in-flight turn into history. Idempotent: whichever of stop() and
   * the stream loop gets here first wins, the other becomes a no-op.
   */
  const settle = useCallback((status, error) => {
    const turn = turnRef.current
    if (!turn || turn.settled) return
    turn.settled = true
    turnRef.current = null
    abortRef.current = null
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = 0
    }
    setPending(null)

    // turn.text is the accumulator itself, so any chunk not yet flushed to
    // state is still captured here.

    // Cancelled before a single chunk landed — there is nothing to show, and an
    // empty bubble would be noise. The question stays; the answer never began.
    if (status === 'stopped' && !turn.text) return

    setMessages((prev) => [
      ...prev,
      {
        id: turn.id,
        role: 'assistant',
        content: turn.text,
        status,
        error,
        // Citations belong to a complete answer. A truncated one has not
        // necessarily reached the material it would have cited.
        citations:
          status === 'complete' ? getScenario(turn.scenarioId).citations : [],
      },
    ])
  }, [])

  const send = useCallback(
    async (question, scenarioId) => {
      if (abortRef.current) return // one turn at a time

      const controller = new AbortController()
      abortRef.current = controller
      const turn = { id: makeId(), scenarioId, text: '', settled: false }
      turnRef.current = turn

      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: 'user', content: question },
      ])
      setPending({ id: turn.id, text: '', phase: 'waiting' })

      try {
        for await (const chunk of streamResponse(scenarioId, {
          signal: controller.signal,
        })) {
          // stop() may have settled this turn while we were awaiting a chunk.
          if (turn.settled) break
          turn.text += chunk
          scheduleFlush()
        }
        // The generator returns (rather than throws) on abort, so the signal is
        // what distinguishes a cancelled stream from a finished one.
        settle(controller.signal.aborted ? 'stopped' : 'complete')
      } catch (err) {
        if (controller.signal.aborted) settle('stopped')
        // No chunks arrived: there is no half-written message to preserve, so
        // this renders as a bare error rather than a bubble.
        else settle('failed', err.message)
      }
    },
    [settle, scheduleFlush],
  )

  const stop = useCallback(() => {
    const controller = abortRef.current
    if (!controller) return
    controller.abort()
    // Settle here rather than letting the loop do it. mock-stream's sleep() is
    // not interruptible, so the generator can take up to first_token_delay_ms
    // (4.2s for `slow`) to notice the signal — far too long for a button.
    settle('stopped')
  }, [settle])

  // A stream outliving the component would setState on an unmounted tree.
  useEffect(
    () => () => {
      abortRef.current?.abort()
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  return { messages, pending, isStreaming: pending !== null, send, stop }
}
