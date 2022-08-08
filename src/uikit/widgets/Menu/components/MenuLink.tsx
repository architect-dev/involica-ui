import React, { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

const MenuLink: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ href, ...otherProps }) => {
  const isHttpLink = href?.startsWith('http')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag: any = isHttpLink ? 'a' : Link
  const props = isHttpLink ? { href } : { to: href, replace: true }
  return <Tag {...props} {...otherProps} />
}

export default MenuLink
