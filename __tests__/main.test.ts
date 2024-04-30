/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const prodVersionRegex = /^v\d+.\d+.\d+$/
const betaVersionRegex = /^v\d+.\d+.\d+-beta.\d+$/

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('sets the version output', async () => {
    // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'release-level':
            return 'minor'
          case 'latest-production-version':
            return 'v1.0.0'  
          case 'latest-beta-version':
            return 'v1.0.0-beta.1'
          default:
            return ''
        }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'next-production-version',
      expect.stringMatching(prodVersionRegex)
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      2,
      'next-beta-version',
      expect.stringMatching(betaVersionRegex)
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'release-level':
          return 'invalid'
        case 'latest-production-version':
          return '1.0.0'  
        case 'latest-beta-version':
          return '1.0.0-beta.1'
        default:
          return ''
      }
  })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'release-level must be one of patch, minor or major'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })
})
