import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '@ssi-ts/(.+)': ['<rootDir>/../../packages/$1/src', '<rootDir>/../packages/$1/src', '<rootDir>/packages/$1/src'],
  },
  testEnvironment: 'node',
}

export default config
