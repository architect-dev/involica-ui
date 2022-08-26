import React, { useMemo } from 'react'
import useTheme from 'hooks/useTheme'
import { Menu as UikitMenu } from 'uikit'
import { getMenuItems } from './config'
import useAuth from 'hooks/useAuth'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const Menu = (props) => {
  const { login, logout } = useAuth()
  const { account } = useActiveWeb3React()

  const { isDark, toggleTheme } = useTheme()
  const menuLinks = useMemo(() => {
    return getMenuItems()
  }, [])

  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      links={menuLinks}
      {...props}
    />
  )
}

export default Menu
