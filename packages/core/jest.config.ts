import base from '../../jest.config.base'

import packageJson from './package.json'

const config = {
  ...base,
  displayName: packageJson.name,
}

export default config
