import { compile, createTrack, runDeclarative, runProcedural, useCompiled, useRef } from 'procedural-to-declarative'
import { useMemo } from 'react'
import { AbsoluteFill, Composition, interpolate, interpolateColors, Series, spring, useCurrentFrame, useVideoConfig } from 'remotion'

export const ExampleCompOriginal: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const colorChange = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const spr = spring({
    fps,
    frame: frame - 60,
  })
  const translateX = interpolate(spr, [0, 1], [0, 300])

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
          backgroundColor: interpolateColors(
            colorChange,
            [0, 1],
            ['#e6a700', '#e13238'],
          ),
          transform: `translateX(${translateX}px)`,
        }}
      />
    </AbsoluteFill>
  )
}

const ExampleCompProcedural: React.FC = () => {
  const { fps } = useVideoConfig()
  const { track, color, x, compiled } = useMemo(() => {
    const track = createTrack()
    const color = useRef<string>(track, '#e6a700')
    const x = useRef<number>(track, 0)
    function* animation() {
      yield runDeclarative(track, (progress) => {
        color.current = interpolateColors(progress, [0, 2], ['#e6a700', '#e13238'])
      }, 2).wait()
      color.current = '#e13238'
      yield runDeclarative(track, (progress) => {
        x.current = 300 * spring({ frame: progress * fps, fps })
      }, 1).wait()
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

const ExampleCompCombined: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={90}>
        <ExampleCompOriginal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <ExampleCompProcedural />
      </Series.Sequence>
    </Series>
  )
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OddFrameAudio"
        component={ExampleCompCombined}
        durationInFrames={180}
        fps={30}
        width={640}
        height={360}
      />
    </>
  )
}
