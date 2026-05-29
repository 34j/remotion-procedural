
# remotion-procedural

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

---

**📘Documentation**: [https://34j.github.io/remotion-procedural/](https://34j.github.io/remotion-procedural/)

**📦️NPM Package**: [https://www.npmjs.com/package/remotion-procedural](https://www.npmjs.com/package/remotion-procedural)

---

Procedural animation for Remotion.

## Installation

```bash
npm install remotion-procedural
```

## Usage

```tsx
import { compile, createTrack, runDeclarative, runProcedural, useCompiled, useRef } from 'procedural-to-declarative'
import { useMemo } from 'react'
import { AbsoluteFill, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion'

export const ExampleProcedural: React.FC = () => {
  const { fps } = useVideoConfig()

  // Memorize the compiled track
  const { track, color, x, compiled } = useMemo(() => {
    const track = createTrack()

    // Refs to hold the current values of parameters that will be animated
    const color = useRef<string>(track, '#e6a700')
    const x = useRef<number>(track, 0)

    // Procedural function that defines the animation sequence
    function* animation() {
      // First, change the color
      yield runDeclarative(track, (progress) => {
        color.current = interpolateColors(progress, [0, 2], ['#e6a700', '#e13238'])
      }, 2)
      color.current = '#e13238'

      // Then, move the circle horizontally
      yield runDeclarative(track, (progress) => {
        x.current = 300 * spring({ frame: progress * fps, fps })
      }, 1)
    }

    // Top-level call
    runProcedural(track, animation())

    // Compile the track
    const compiled = compile(track)
    return { track, color, x, compiled }
  }, [fps])

  // Use the compiled track at current time
  // Ref.current is (re)set to the desired value at the current time
  const frame = useCurrentFrame()
  useCompiled(track, compiled, frame / fps)

  // Return the React component with parameters
  // specified using `Ref.current`
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
```

```shell
pnpm render
```

[build-img]:https://github.com/34j/remotion-procedural/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/34j/remotion-procedural/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/remotion-procedural
[downloads-url]:https://www.npmtrends.com/remotion-procedural
[npm-img]:https://img.shields.io/npm/v/remotion-procedural
[npm-url]:https://www.npmjs.com/package/remotion-procedural
[issues-img]:https://img.shields.io/github/issues/34j/remotion-procedural
[issues-url]:https://github.com/34j/remotion-procedural/issues
[codecov-img]:https://codecov.io/gh/34j/remotion-procedural/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/34j/remotion-procedural
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
