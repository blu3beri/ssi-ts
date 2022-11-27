import base from './jest.config.base'

const config = {
  ...base,
  roots: ['<rootDir>'],
  projects: ['<rootDir>/packages/*'],
}

export default config
