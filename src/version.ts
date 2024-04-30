const prodVersionRegex = /^v(\d+)\.(\d+)\.(\d+)$/
const betaVersionRegex = /^v(\d+)\.(\d+)\.(\d+)-beta\.(\d+)$/

// write this version thing as a new class version
export class Version {
    major: number
    minor: number
    patch: number
    preReleaseType?: string | null
    preReleaseIteration?: number | null

    constructor(major: number, minor: number, patch: number, preReleaseType?: string | null, preReleaseIteration?: number | null) {
        this.major = major
        this.minor = minor
        this.patch = patch
        this.preReleaseType = preReleaseType ?? null
        this.preReleaseIteration = preReleaseIteration ?? null
    }

    // add function to parse a production version from a string
    static parseProductionVersion(version: string): Version {
        const match = prodVersionRegex.exec(version)
        if (!match) {
            throw new Error('Invalid production version')
        }
        const [, major, minor, patch] = match
        return new Version(parseInt(major), parseInt(minor), parseInt(patch))
    }

    // add function to parse a beta version from a string
    static parseBetaVersion(version: string): Version {
        const match = betaVersionRegex.exec(version)
        if (!match) {
            throw new Error('Invalid beta version')
        }
        const [, major, minor, patch, iteration] = match
        return new Version(parseInt(major), parseInt(minor), parseInt(patch), 'beta', parseInt(iteration))
    }

    incrementByType(releaseLevel: string): Version {
        switch (releaseLevel) {
            case 'major':
                return this.incrementMajor()
            case 'minor':
                return this.incrementMinor()
            case 'patch':
                return this.incrementPatch()
            default:
                throw new Error('Invalid release level')
        }
    }

    isPreRelease(): boolean {
      // check if type and iteration are not null or undefined

        return this.preReleaseType !== null && this.preReleaseIteration !== null
    }

    // add function to check is this version is higher than anthor
    isHigherThan(other: Version): boolean {
        if (this.major > other.major) {
            return true
        } else if (this.major < other.major) {
            return false
        } else if (this.minor > other.minor) {
            return true
        } else if (this.minor < other.minor) {
            return false
        } else if (this.patch > other.patch) {
            return true
        } else {
            return false
        }
    }

    incrementMajor(): Version {
        return new Version(this.major + 1, 0, 0)
    }
    
    incrementMinor(): Version {
        return new Version(this.major, this.minor + 1, 0)
    }
    
    incrementPatch(): Version {
        return new Version(this.major, this.minor, this.patch + 1)
    }

    incrementPreRelease(): Version {
      if(!this.isPreRelease()) {
        throw new Error('Invalid pre-release version')
      }
      return new Version(this.major, this.minor, this.patch, this.preReleaseType, (this.preReleaseIteration ?? 0) + 1)
    }

    toBeta(): Version {
        return new Version(this.major, this.minor, this.patch, 'beta', 1)
    }

    toString(): string {
        if (this.isPreRelease()) {
            return `v${this.major}.${this.minor}.${this.patch}-${this.preReleaseType}.${this.preReleaseIteration}`
        } else {
            return `v${this.major}.${this.minor}.${this.patch}`
        }
    }
}

export function calculateVersions(releaseLevel: string, latestProductionVersion?: string, latestBetaVersion?: string): { nextProductionVersion: string, nextBetaVersion: string } {
  const prod =  latestProductionVersion ? Version.parseProductionVersion(latestProductionVersion) : new Version(0, 0, 0)
  const newProd = prod.incrementByType(releaseLevel)

  const beta = latestBetaVersion ? Version.parseBetaVersion(latestBetaVersion) : new Version(0, 0, 0, 'beta', 1)
  const newBeta = newProd.isHigherThan(beta) ? newProd.toBeta() : beta.incrementPreRelease()

  return {
    nextProductionVersion: newProd.toString(),
    nextBetaVersion: newBeta.toString(),
  }
}
