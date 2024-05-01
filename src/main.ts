import * as core from '@actions/core'
import { calculateVersions } from './version'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const releaseLevel: string = core.getInput('release-level')
    const latestProductionVersion: string | null = core.getInput('latest-production-version')
    const latestBetaVersion: string | null = core.getInput('latest-beta-version')

    // if releaseLevel is not one of patch, minor or major return an error response
    if (!['patch', 'minor', 'major'].includes(releaseLevel)) {
      throw new Error(`release-level: '${releaseLevel}' invalid. Must be one of patch, minor or major`)
    }

    const {
      nextProductionVersion,
      nextBetaVersion
    } = calculateVersions(
      releaseLevel,
      latestProductionVersion,
      latestBetaVersion
    );

    console.log(`Prod: ${latestProductionVersion} => ${nextProductionVersion}`)
    console.log(`Beta: ${latestBetaVersion} => ${nextBetaVersion}`)

    core.setOutput('next-production-version', nextProductionVersion)
    core.setOutput('next-beta-version', nextBetaVersion)
    
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
