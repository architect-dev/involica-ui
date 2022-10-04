import React from 'react'
import Link from './Link'
import { LinkProps } from './types'
import { ExternalLink } from 'react-feather'

const LinkExternal: React.FC<LinkProps> = ({ children, ...props }) => {
  return (
    <Link external target="_blank" {...props}>
      {children}
      <ExternalLink size='14px'/>
    </Link>
  )
}

export default LinkExternal
