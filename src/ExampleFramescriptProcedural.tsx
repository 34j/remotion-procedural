import { any, compile, createTrack, runProcedural, sleep, useCompiled, useRef } from 'procedural-to-declarative'
import { useMemo } from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { runInterpolate } from './runInterpolate'

export const ExampleFramescript: React.FC = () => {
  const { fps } = useVideoConfig()
  const { track, y, scale, opacity, glow, compiled } = useMemo(() => {
    const track = createTrack()
    const y = useRef<number>(track, 80)
    const scale = useRef<number>(track, 0.96)
    const opacity = useRef<number>(track, 0)
    const glow = useRef<number>(track, 0.2)

    function* animation() {
      yield any(
        [runInterpolate(track, y, 0, 0.9), runInterpolate(track, scale, 1, 0.9), runInterpolate(track, opacity, 1, 0.9)],
      )

      yield runInterpolate(track, glow, 0.45, 0.4)

      yield sleep(0.7)

      yield any(
        [runInterpolate(track, y, 40, 0.6), runInterpolate(track, scale, 0.97, 0.6), runInterpolate(track, opacity, 0, 0.6)],
      )
    }

    runProcedural(track, animation())
    const compiled = compile(track)
    return { track, y, scale, opacity, glow, compiled }
  }, [fps])

  const frame = useCurrentFrame()
  useCompiled(track, compiled, frame / fps)

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 300,
          height: 200,
          backgroundColor: '#fff',
          borderRadius: 16,
          transform: `translateY(${y.current}px) scale(${scale.current})`,
          opacity: opacity.current,
          boxShadow: `0 0 24px rgba(56, 189, 248, ${glow.current})`,
        }}
      />
    </AbsoluteFill>
  )
}
