import { calculateVersions } from '../src/version'

describe('calculateVersions', () => {
  it('increments patch version correctly', () => {
    const versions = calculateVersions('patch', 'v1.0.0', 'v1.0.1-beta.1')
    expect(versions.nextProductionVersion).toBe('v1.0.1')
    expect(versions.nextBetaVersion).toBe('v1.0.1-beta.2')
  })

  it('increments minor version correctly', () => {
    const versions = calculateVersions('minor', 'v1.2.3', 'v1.3.0-beta.4')  
    expect(versions.nextProductionVersion).toBe('v1.3.0')
    expect(versions.nextBetaVersion).toBe('v1.3.0-beta.5')
  })

  it('increments major version correctly', () => {  
    const versions = calculateVersions('major', 'v2.3.4', 'v3.0.0-beta.5')
    expect(versions.nextProductionVersion).toBe('v3.0.0')
    expect(versions.nextBetaVersion).toBe('v3.0.0-beta.6') 
  })

  it('increments patch version correctly when new beta base version', () => {
    const versions = calculateVersions('patch', 'v1.0.0', 'v1.0.0-beta.1')
    expect(versions.nextProductionVersion).toBe('v1.0.1')
    expect(versions.nextBetaVersion).toBe('v1.0.1-beta.1')
  })

  it('increments minor version correctly when new beta base version', () => {
    const versions = calculateVersions('minor', 'v1.2.3', 'v1.2.7-beta.4')  
    expect(versions.nextProductionVersion).toBe('v1.3.0')
    expect(versions.nextBetaVersion).toBe('v1.3.0-beta.1')
  })

  it('increments major version correctly when new beta base version', () => {  
    const versions = calculateVersions('major', 'v2.3.4', 'v2.4.0-beta.5')
    expect(versions.nextProductionVersion).toBe('v3.0.0')
    expect(versions.nextBetaVersion).toBe('v3.0.0-beta.1') 
  })

  // new test when no beta version provided
  it('increments patch version correctly when no beta version provided', () => {
    const versions = calculateVersions('minor', 'v1.0.0', undefined)
    expect(versions.nextProductionVersion).toBe('v1.1.0')
    expect(versions.nextBetaVersion).toBe('v1.1.0-beta.1')
  })

  // new test to privide an initial version if no versions provided
  it('increments patch version correctly when no versions provided', () => {
    const versions = calculateVersions('patch', undefined, undefined)
    expect(versions.nextProductionVersion).toBe('v0.0.1')
    expect(versions.nextBetaVersion).toBe('v0.0.1-beta.1')
  })

  it('throws error for invalid release level', () => {
    expect(() => calculateVersions('invalid', 'v1.0.0', 'v1.0.0-beta.1')).toThrow('Invalid release level')
  })

  it('throws error for invalid production version format', () => {
    expect(() => calculateVersions('major', 'invalid', 'v1.0.0-beta.1')).toThrow('Invalid production version') 
  })
  
  it('throws error for invalid beta version format', () => {
    expect(() => calculateVersions('major', 'v1.0.0', 'invalid')).toThrow('Invalid beta version')
  })
})
