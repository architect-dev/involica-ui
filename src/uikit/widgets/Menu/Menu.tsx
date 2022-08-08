import React from "react";
import styled from "styled-components";
import Flex from "../../components/Box/Flex";
import UserBlock from "./components/UserBlock";
import { NavProps } from "./types";
import { MENU_HEIGHT } from "./config";
import NavLinks from "./components/NavLinks";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledNav = styled.nav<{ showMenu: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  transition: top 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  width: 100vw;
  max-width: 100vw;
  height: ${MENU_HEIGHT}px;
  z-index: 20;
  transform: translate3d(0, 0, 0);
  flex-direction: row;
  max-width: 800px;
  margin: auto;
`;



const BodyWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{ showMenu: boolean }>`
  flex-grow: 1;
  margin-top: ${MENU_HEIGHT}px;
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`;

const Menu: React.FC<NavProps> = ({
  account,
  login,
  logout,
  isDark,
  toggleTheme,
  links,
  children,
}) => {

  return (
    <Wrapper>
      <StyledNav showMenu>
        <Flex height='100%' alignItems='center' justifyContent='center' gap='10px'>
          <NavLinks links={links} mobileNav={false}/>
        </Flex>
        <Flex alignItems='center' justifyContent='center' gap='10px'>
          <UserBlock account={account} login={login} logout={logout} isDark={isDark} toggleTheme={toggleTheme} />
        </Flex>
      </StyledNav>
      <BodyWrapper>
        <Inner showMenu>
          {children}
        </Inner>
      </BodyWrapper>
    </Wrapper>
  );
};

export default Menu;
