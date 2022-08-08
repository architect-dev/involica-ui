import { MenuEntry } from 'uikit'

export const getMenuItems = (): MenuEntry[] => [
  {
    label: 'HOME',
    href: `/`,
    external: false,
    keyPaths: ['']
  },
  {
    label: 'STATS',
    href: '/stats',
    external: false,
    keyPaths: ['stats']
  },
  {
    label: 'DOCS',
    href: '/docs',
    external: false,
    keyPaths: ['docs'],
  }
].filter((entry) => entry != null)
