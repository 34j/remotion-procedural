import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion'

export const ExampleOriginal: React.FC = () => {
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
