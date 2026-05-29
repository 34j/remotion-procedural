import { compile, createTrack, runDeclarative, runProcedural, useCompiled, useRef } from 'procedural-to-declarative'
import { useMemo } from 'react'
import { AbsoluteFill, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion'

export const ExampleProcedural: React.FC = () => {
  const { fps } = useVideoConfig()
  const { track, color, x, compiled } = useMemo(() => {
    const track = createTrack()
    const color = useRef<string>(track, '#e6a700')
    const x = useRef<number>(track, 0)
    function* animation() {
      yield runDeclarative(track, (progress) => {
        color.current = interpolateColors(progress, [0, 2], ['#e6a700', '#e13238'])
      }, 2)
      color.current = '#e13238'
      yield runDeclarative(track, (progress) => {
        x.current = 300 * spring({ frame: progress * fps, fps })
      }, 1)
    }
    runProcedural(track, animation())
    const compiled = compile(track)
    return { track, color, x, compiled }
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
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: color.current,
          transform: `translateX(${x.current}px)`,
        }}
      />
    </AbsoluteFill>
  )
}
