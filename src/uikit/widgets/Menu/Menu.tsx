import React from "react";
import styled from "styled-components";
import Flex from "../../components/Box/Flex";
import UserBlock from "./components/UserBlock";
import { NavProps } from "./types";
import { MENU_HEIGHT } from "./config";
import SummitPrice from "./components/SummitPrice";
import { useCurrentSummitPalette } from "state/hooks";
import Logo from "./components/Logo";
import NavLinks from "./components/NavLinks";
import SummitWinnings from "./components/SummitWinnings";
import { NavSecondRow } from "./components/NavSecondRow";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledNav = styled.nav<{ showMenu: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
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
  background-color: ${({ theme }) => theme.colors.background};
  flex-direction: row;
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

const MobileOnlyFooter = styled.div`
  position: fixed;
  height: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  height: 56px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0px 0px 4px ${({ theme }) => theme.colors.textShadow};


  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`

const Menu: React.FC<NavProps> = ({
  account,
  login,
  logout,
  isDark,
  toggleTheme,
  summitPriceUsd,
  links,
  children,
}) => {
  const summitPalette = useCurrentSummitPalette()

  return (
    <Wrapper>
      <StyledNav showMenu id='popup-root'>
          <Flex height='100%' alignItems='center' justifyContent='center' gap='10px'>
            <Logo isDark={isDark} href="/" summitPalette={summitPalette}/>
            <NavLinks links={links} mobileNav={false}/>
          </Flex>
          <Flex alignItems='center' justifyContent='center' gap='10px'>
            <SummitWinnings/>
            <SummitPrice summitPriceUsd={summitPriceUsd} />
            <UserBlock account={account} login={login} logout={logout} isDark={isDark} toggleTheme={toggleTheme} />
          </Flex>
      </StyledNav>
      <BodyWrapper>
        <Inner showMenu>
          <NavSecondRow/>
          {children}
        </Inner>
        <MobileOnlyFooter>
          <Flex height='100%'>
            <NavLinks links={links} mobileNav/>
          </Flex>
        </MobileOnlyFooter>
      </BodyWrapper>
    </Wrapper>
  );
};

export default Menu;
