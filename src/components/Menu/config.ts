import { MenuEntry } from 'uikit'
import { Elevation } from 'config/constants/types'

export const getMenuItems = (): MenuEntry[] => [

  {
    label: 'FARM',
    href: `/elevations`,
    external: false,
    elevation: Elevation.OASIS,
    keyPaths: ['elevations', 'oasis', 'plains', 'mesa', 'summit']
  },
  {
    label: 'GLACIER',
    href: '/glacier',
    palette: 'GLACIER',
    external: false,
    keyPaths: ['glacier']
  },
  {
    label: 'EVEREST',
    href: '/everest',
    external: false,
    keyPaths: ['everest'],
  },
  {
    label: 'EXPEDITION',
    href: `/expedition`,
    external: false,
    elevation: Elevation.EXPEDITION,
    keyPaths: ['expedition'],
  },
  {
    label: 'DOCS',
    href: 'https://docs.summitdefi.com',
    external: true,
    keyPaths: ['help'],
  }
].filter((entry) => entry != null)
