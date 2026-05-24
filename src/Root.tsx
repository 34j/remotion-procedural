import { compile, createTrack, runDeclarative, runProcedural, useCompiled, useRef } from 'procedural-to-declarative'
import { AbsoluteFill, Composition, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion'

const ExampleComparison: React.FC = () => {
  const track = createTrack()
  const color = useRef<string>(track, '#e6a700')
  const x = useRef<number>(track, 0)
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  function* animation() {
    yield runDeclarative(track, (progress) => {
      color.current = interpolateColors(progress, [0, 2], ['#e6a700', '#00a7e6'])
    }, 2).wait()
    yield runDeclarative(track, (progress) => {
      x.current = spring({ frame: 1 - progress, fps: 1 })
    }, 1).wait()
  }
  runProcedural(track, animation())
  const compiled = compile(track)
  useCompiled(track, compiled, frame / fps)
  console.log('x', x.current)
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

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OddFrameAudio"
        component={ExampleComparison}
        durationInFrames={60}
        fps={30}
        width={640}
        height={360}
      />
    </>
  )
}
