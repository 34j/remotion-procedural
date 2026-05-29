import { describe, expect, it } from 'vitest'
import { runInterpolate } from '../src/index'

describe('index', () => {
  it('should export runInterpolate', () => {
    expect(runInterpolate).toBeDefined()
  })
})
