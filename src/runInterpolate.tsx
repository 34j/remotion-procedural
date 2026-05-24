import type { createTrack, Ref } from 'procedural-to-declarative'
import { runDeclarative, runProcedural } from 'procedural-to-declarative'

export function runInterpolate<TRef extends number>(track: ReturnType<typeof createTrack>, ref: Ref<TRef>, to: TRef, duration: number) {
  function* animation() {
    const from = ref.current
    yield runDeclarative(track, (progress) => {
      ref.current = ((to - from) * progress / duration + from) as TRef
    }, duration).wait()
    ref.current = to
  }
  return runProcedural(track, animation())
}
