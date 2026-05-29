import type { Ref, Track } from 'procedural-to-declarative'
import { runDeclarative, runProcedural } from 'procedural-to-declarative'

export function runInterpolate<TNumber extends number, TRef extends number>(track: Track<TNumber>, ref: Ref<TRef>, to: TRef, duration: TNumber) {
  function* animation() {
    const from = ref.current
    yield runDeclarative(track, (progress) => {
      ref.current = ((to - from) * progress / duration + from) as TRef
    }, duration)
    ref.current = to
  }
  return runProcedural(track, animation())
}
