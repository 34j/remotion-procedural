import { Composition, Series } from 'remotion'
import { ExampleFramescript } from './ExampleFramescriptProcedural'
import { ExampleOriginal } from './ExampleOriginal'
import { ExampleProcedural } from './ExampleProcedural'

const ExampleCompCombined: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={90}>
        <ExampleOriginal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <ExampleProcedural />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <ExampleFramescript />
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
        durationInFrames={270}
        fps={30}
        width={640}
        height={360}
      />
    </>
  )
}
