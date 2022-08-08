/* eslint-disable react/no-array-index-key */
import { Elevation, elevationUtils } from 'config/constants/types'
import { darken } from 'polished'
import React, { useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex } from 'uikit'
import { HighlightedText, Text } from 'uikit/components/Text'
import { chunkArray, getPaletteGradientFarmCardBackground } from 'utils'
import ArtworkTotem from 'uikit/components/Totem/ArtworkTotem'
import Totem from 'views/ElevationFarms/components/Totem'
import { Modal } from '../Modal'
import { elevationPalette } from 'theme/colors'
import chroma from 'chroma-js'
import WinningNumberTotemIndicator from './WinningNumberTotemIndicator'
import { RoundStatus, useElevationRoundStatus, useElevationUserTotem } from 'state/hooksNew'
import { useTotemHistoricalData } from 'state/hooks'
import { SummitButton } from 'uikit/components/Button'
import { useSelectTotemModal } from 'components/SelectTotemModal'

interface Props {
  elevation?: Elevation
  onDismiss?: () => void
}

const ModalLayoutFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  gap: 32px;

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    margin-top: 100px;
  }
`

const MobileOnlyGap = styled.div`
  height: 1px;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`
const MobileOnlyFlex = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`

const RainbowLight = keyframes`
0% {
  background-position: 0% 50%;
}
50% {
  background-position: 100% 50%;
}
100% {
  background-position: 0% 50%;
}
`

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    width: 50%;
    min-width: 375px;
  }
`

const StyledCardAccent = styled.div<{ elevationBackground: string }>`
  background: ${({ elevationBackground }) => elevationBackground};

  background-size: 200% 200%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 200px;
  filter: blur(30px);
  position: absolute;
  top: 3px;
  right: 3px;
  bottom: 3px;
  left: 3px;
  z-index: -1;
`

const TotemLabel = styled(Text)<{ elevation: Elevation; header?: boolean; color?: string }>`
  font-weight: bold;
  font-style: italic;
  text-align: center;
  font-size: ${({ header }) => (header ? '22' : '16')}px;
  color: ${({ elevation, theme, header, color }) =>
    darken(header ? 0.2 : 0, color !== 'text' ? color : theme.colors[elevation])};
  text-shadow: 1px 1px 2px
    ${({ theme, elevation, header, color }) =>
      darken(header ? 0.2 : 0, color !== 'text' ? color : theme.colors[elevation])};
`

const WinMultiplierLabel = styled(HighlightedText)`
  z-index: 1;
  margin-top: -16px;
  font-size: 28px;
`

const TotemBreakdownRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const TotemWithStatsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;

  ${({ theme }) => theme.mediaQueries.nav} {
    padding: 2px;
  }
`

const getRecentWinnerStreak = (recentWinners: number[]): number => {
  for (let i = 0; i < recentWinners.length; i++) {
    if (recentWinners[i] !== recentWinners[0]) return i
  }
  return 10
}
const getBiggestWinnerAndLoser = (winsAccum: number[], elevation: Elevation): [number, number] => {
  const { winner, loser } = winsAccum.slice(0, elevationUtils.totemsArray(elevation).length).reduce(
    (accum, wins, index) => ({
      winner: wins > winsAccum[accum.winner] ? index : accum.winner,
      loser: wins < winsAccum[accum.loser] ? index : accum.loser,
    }),
    { winner: 0, loser: 0 },
  )
  return [winner, loser]
}
const getWinsPerc = (winsAccum: number[]): string[] => {
  const rounds = winsAccum.reduce((roundsAccum, wins) => roundsAccum + wins, 0)
  return winsAccum.map((wins) => `${Math.round((wins * 10000) / rounds) / 100}%`)
}

const HeaderRowFlex = styled(Flex)`
  position: absolute;
  flex-direction: row;
  align-items: center;
  height: 250px;
  position: absolute;
  top: -125px;
  width: 100%;
  padding: 0px 60px;
  z-index: 10;
`
const TotemPadding = styled.div`
  display: flex;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`
const HeaderRecentWinners = styled.div<{ mobileOnly?: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 24px;
  display: ${({ mobileOnly }) => mobileOnly === true ? 'none' : 'flex'};

  ${({ theme }) => theme.mediaQueries.nav} {
    display: flex;
  }
`

interface BiggestWinnerAndLoserProps {
  elevation?: Elevation
  biggestWinner: number
  biggestWinnerWinPerc: string
  biggestLoser: number
  biggestLoserWinPerc: string
}
const MobileCardContentBiggestWinners: React.FC<BiggestWinnerAndLoserProps> = React.memo(({ elevation, biggestWinner, biggestWinnerWinPerc, biggestLoser, biggestLoserWinPerc }) => {
  const elevationBackground = getPaletteGradientFarmCardBackground(elevation)
  const biggestWinnerName = elevationUtils.getElevationTotemName(elevation, biggestWinner, false)
  const biggestLoserName = elevationUtils.getElevationTotemName(elevation, biggestLoser, false)
  
  return (
    <MobileOnlyFlex gap='24px'>
      <Flex flexDirection="column" alignItems="center">
        <TotemPadding>
          <StyledCardAccent elevationBackground={elevationBackground} />
          <ArtworkTotem elevation={elevation} totem={biggestWinner} desktopSize="120" mobileSize="120" />
        </TotemPadding>
        <TotemLabel elevation={elevation} header={false} gold mt='16px'>
          LUCKIEST
          <br />
          TOTEM
        </TotemLabel>
        <Text bold fontStyle="italic" gold mt='16px'>
          {biggestWinnerName}
        </Text>
        <Text monospace bold fontStyle="italic" gold>
          {biggestWinnerWinPerc} WIN
        </Text>
      </Flex>
      <Flex flexDirection="column" alignItems="center">
        <TotemPadding>
          <StyledCardAccent elevationBackground={elevationBackground} />
          <ArtworkTotem elevation={elevation} totem={biggestLoser} desktopSize="120" mobileSize="120" />
        </TotemPadding>
        <TotemLabel elevation={elevation} header={false} color="#CE0000" mt='16px'>
          UNLUCKIEST
          <br />
          TOTEM
        </TotemLabel>
        <Text bold fontStyle="italic" color="#CE0000" mt='16px'>
          {biggestLoserName}
        </Text>
        <Text monospace bold fontStyle="italic" color="#CE0000">
          {biggestLoserWinPerc} WIN
        </Text>
      </Flex>
    </MobileOnlyFlex>
  )
})

interface HeaderPuckRowProps extends BiggestWinnerAndLoserProps {
  winningTotem: number
  lockedOrFinalizing: boolean
}
const HeaderPuckRow: React.FC<HeaderPuckRowProps> = React.memo(({ elevation, lockedOrFinalizing, winningTotem, biggestWinner, biggestWinnerWinPerc, biggestLoser, biggestLoserWinPerc }) => {
  const elevationBackground = getPaletteGradientFarmCardBackground(elevation)
  const biggestWinnerName = elevationUtils.getElevationTotemName(elevation, biggestWinner, false)
  const biggestLoserName = elevationUtils.getElevationTotemName(elevation, biggestLoser, false)
  

  return (
    <HeaderRowFlex>
      <HeaderRecentWinners>
        <TotemPadding>
          <StyledCardAccent elevationBackground={elevationBackground}/>
          <ArtworkTotem crowned elevation={elevation} totem={lockedOrFinalizing ? null : winningTotem} desktopSize="200" mobileSize="200" />
        </TotemPadding>
      </HeaderRecentWinners>
      <HeaderRecentWinners mobileOnly>
        <Flex flexDirection="column" alignItems="center" mt='116px'>
          <TotemPadding>
            <StyledCardAccent elevationBackground={elevationBackground} />
            <ArtworkTotem elevation={elevation} totem={biggestWinner} desktopSize="120" mobileSize="120" />
          </TotemPadding>
          <TotemLabel elevation={elevation} header={false} gold mt='16px'>
            LUCKIEST
            <br />
            TOTEM
          </TotemLabel>
          <Text bold fontStyle="italic" gold mt='16px'>
            {biggestWinnerName}
          </Text>
          <Text monospace bold fontStyle="italic" gold>
            {biggestWinnerWinPerc} WIN
          </Text>
        </Flex>
        <Flex flexDirection="column" alignItems="center" mt='116px'>
          <TotemPadding>
            <StyledCardAccent elevationBackground={elevationBackground} />
            <ArtworkTotem elevation={elevation} totem={biggestLoser} desktopSize="120" mobileSize="120" />
          </TotemPadding>
          <TotemLabel elevation={elevation} header={false} color="#CE0000" mt='16px'>
            UNLUCKIEST
            <br />
            TOTEM
          </TotemLabel>
          <Text bold fontStyle="italic" color="#CE0000" mt='16px'>
            {biggestLoserName}
          </Text>
          <Text monospace bold fontStyle="italic" color="#CE0000">
            {biggestLoserWinPerc} WIN
          </Text>
        </Flex>
      </HeaderRecentWinners>
    </HeaderRowFlex>
  )
})

const TotemWinnersModal: React.FC<Props> = ({
  elevation,
  onDismiss = () => null,
}) => {
  const { recentWinners, recentWinningsMultipliers, winsAccum, winningNumberDrawn } = useTotemHistoricalData(elevation)
  const roundStatus = useElevationRoundStatus(elevation)
  const userTotem = useElevationUserTotem(elevation)
  const { onPresentSelectTotemModal } = useSelectTotemModal(elevation)
  const totemSwitchDisabled = roundStatus === RoundStatus.RolloverLockout || roundStatus === RoundStatus.RolloverAvailable

  const handlePresentSelectTotemModal = useCallback(() => {
    if (totemSwitchDisabled) return
    onPresentSelectTotemModal()
  }, [totemSwitchDisabled, onPresentSelectTotemModal])

  if (elevation == null) return null

  if (elevation === Elevation.OASIS) {
    return (
      <Modal
        title={`${elevation} TOTEM WINNERS`}
        onDismiss={onDismiss}
        headerless
        HeaderComponent={
          <HeaderRowFlex justifyContent='center'>
            <ArtworkTotem elevation={elevation} totem={0} desktopSize="180" mobileSize="180" />
          </HeaderRowFlex>
        }
      >
        <Flex alignItems="center" flexDirection="column" p="18px" mt='78px' gap='24px'>
          <Text bold monospace textAlign='center'>
            THE OTTER IS THE ONLY OASIS TOTEM,
            <br/>
            HE DOES NOT COMPETE IN YIELD WARS,
            <br />
            AND GUARANTEES YOUR SUMMIT.
          </Text>
        </Flex>
      </Modal>
    )
  }

  
  if (recentWinners.length === 0) {
    return (
      <Modal
        title={`${elevation} TOTEM WINNERS`}
        onDismiss={onDismiss}
        headerless
        HeaderComponent={
          <HeaderRowFlex justifyContent='center'>
            <ArtworkTotem elevation={elevation} totem={userTotem} desktopSize="180" mobileSize="180" />
          </HeaderRowFlex>
        }
      >
        <Flex alignItems="center" flexDirection="column" p="18px" mt='78px' gap='24px'>
          <SummitButton
            summitPalette={elevation}
            isLocked={totemSwitchDisabled}
            onClick={handlePresentSelectTotemModal}
          >
            SWITCH TOTEM
          </SummitButton>
          <Text bold monospace textAlign='center'>
            TOTEM WINNERS STATISTICS WILL BECOME
            <br />
            AVAILABLE AFTER THE FIRST ROUND ENDS
          </Text>
        </Flex>
      </Modal>
    )
  }

  const lockedOrFinalizing = [RoundStatus.RolloverLockout, RoundStatus.RolloverAvailable].includes(roundStatus)

  const recentWinnerName = elevationUtils.getElevationTotemName(elevation, recentWinners[0], false)
  const recentWinnerStreak = getRecentWinnerStreak(recentWinners)
  const winsPerc = getWinsPerc(winsAccum)
  const [biggestWinner, biggestLoser] = getBiggestWinnerAndLoser(winsAccum, elevation)
  const totemsArray = elevationUtils.totemsArray(elevation)
  const chunkedTotems = chunkArray(5, totemsArray)
  const colorGradient = chroma
    .scale([elevationPalette[elevation][2], elevationPalette[elevation][4]])
    .mode('lch')
    .colors(Math.max(totemsArray.length, 5))

  return (
    <Modal
      title="TOTEM STATS"
      onDismiss={onDismiss}
      headerless
      HeaderComponent={<HeaderPuckRow
        elevation={elevation}
        winningTotem={recentWinners[0]}
        biggestWinner={biggestWinner}
        biggestLoser={biggestLoser}
        biggestWinnerWinPerc={winsPerc[biggestWinner]}
        biggestLoserWinPerc={winsPerc[biggestLoser]}
        lockedOrFinalizing={lockedOrFinalizing}
      />}
    >
      <ModalLayoutFlex>
        <ContentColumn>

          <SummitButton
            summitPalette={elevation}
            isLocked={totemSwitchDisabled}
            onClick={handlePresentSelectTotemModal}
            marginTop='24px'
          >
            SWITCH TOTEM
          </SummitButton>
          

          <TotemLabel elevation={elevation} mt='48px'>
            { lockedOrFinalizing ? 'ROUND ENDING' : 'WINNING TOTEM:'}
          </TotemLabel>
          <TotemLabel header mb={lockedOrFinalizing || recentWinnerStreak === 1 ? '32px' : '0px'} elevation={elevation}>
            { lockedOrFinalizing ? 'WINNER TBD' : recentWinnerName}
          </TotemLabel>
          {(!lockedOrFinalizing && recentWinnerStreak > 1) &&
            <TotemLabel mb="40px" elevation={elevation} header={false}>
              {recentWinnerStreak} WIN STREAK
            </TotemLabel>
          }

          <WinMultiplierLabel summitPalette={elevation} header gold>
            {lockedOrFinalizing ? '??' : recentWinningsMultipliers[0].toFixed(1)}X
          </WinMultiplierLabel>
          <Text gold bold monospace fontSize="16px" mb="6px">
            WIN MULTIPLIER
          </Text>

          {/* Winning Number */}
          <Flex gap='12px' align-items='center' justifyContent='center' mt="46px" mb='24px' >
            { lockedOrFinalizing ?
              <Text monospace small lineHeight='12px' textAlign='center' mt='1px'>
                NEXT ROUND WINNER
                <br/>
                WILL BE REVEALED SOON
              </Text> :
              <>
                <Text monospace small lineHeight='12px' textAlign='center' mt='1px'>
                  PREV ROUND
                  <br/>
                  WINNING NUMBER DRAWN:
                </Text>
                <Text fontSize='18px' bold gold monospace>
                  {winningNumberDrawn}
                </Text>
              </>
            }
          </Flex>
          <WinningNumberTotemIndicator elevation={elevation} winningNumberDrawn={lockedOrFinalizing ? null : winningNumberDrawn}/>


          
          
        </ContentColumn>

        <MobileOnlyGap />

        <ContentColumn>
          <MobileCardContentBiggestWinners
            elevation={elevation}
            biggestWinner={biggestWinner}
            biggestLoser={biggestLoser}
            biggestWinnerWinPerc={winsPerc[biggestWinner]}
            biggestLoserWinPerc={winsPerc[biggestLoser]}
          />

          <Text mt="90px" bold monospace>
            ALL TIME WINS BREAKDOWN
          </Text>
          {chunkedTotems.map((rowTotems) => (
            <TotemBreakdownRow key={rowTotems[0]}>
              {rowTotems.map((totem) => (
                <TotemWithStatsWrapper key={totem}>
                  <Totem
                    elevation={elevation}
                    totem={totem}
                    color={colorGradient[totem]}
                    selected={totem === userTotem}
                    pressable={false}
                  />
                  <Text monospace>{winsAccum[totem]} WINS</Text>
                  <Text monospace bold>
                    {winsPerc[totem]}
                  </Text>
                </TotemWithStatsWrapper>
              ))}
            </TotemBreakdownRow>
          ))}

          <Text mt="32px" bold monospace>
            LAST 5 WINNERS
          </Text>
          <Flex align-items='flex-end'>
            {recentWinners.slice(0, Math.min(recentWinners.length, 5)).map((totem, index) => (
              <TotemWithStatsWrapper key={index}>
                <Totem
                  elevation={elevation}
                  totem={totem}
                  color={colorGradient[index]}
                  selected={totem === userTotem}
                  crowned={index === 0}
                  pressable={false}
                  size={`${60 - index * 8}`}
                  navSize={`${60 - index * 8}`}
                />
                <Text monospace bold>
                  {recentWinningsMultipliers[index].toFixed(1)}X
                </Text>
              </TotemWithStatsWrapper>
            ))}
          </Flex>
        </ContentColumn>
      </ModalLayoutFlex>
    </Modal>
  )
}

export default TotemWinnersModal
