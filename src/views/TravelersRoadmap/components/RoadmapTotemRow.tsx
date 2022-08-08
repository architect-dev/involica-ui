import { Elevation, elevationUtils, SummitPalette } from "config/constants"
import React, { useCallback } from "react"
import { Link } from "react-router-dom"
import { useMediaQuery } from "state/hooks"
import { useExpeditionRoadmapInfoWithPreset, useExpeditionUserData, useUserTotemCrownsLoyaltiesWithPreset } from "state/hooksNew"
import styled, { css } from "styled-components"
import { textGold } from "theme/colors"
import { ArtworkTotem, BadgeRibbonIcon, ElevationImage, Flex, HighlightedText, SummitButton, Text } from "uikit"
import { paletteLinearGradientBackground, pressableMixin } from "uikit/util/styledMixins"
import useTotemWinnersModal from "uikit/widgets/TotemWinnersModal/useTotemWinnersModal"
import { getFormattedBigNumber } from "utils"
import { InverseDeity } from "views/ElevationFarms/components/InverseDeity"
import { ExpeditionWinnings } from "views/Expeditions/components/ExpeditionWinnings"

const RoadmapTotemRowWrapper = styled.div`
    display: flex;
    width: 100%;
    max-width: 850px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    margin-bottom: 42px;

    ${({ theme }) => theme.mediaQueries.nav} {
        margin-bottom: 0px;
    }
`

const PressableFlex = styled(Flex)`
    ${pressableMixin}
`


const BadgeWrapper = styled.div`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transform: rotate(46deg);
    margin-top: 6px;
    display: flex;
    margin-top: 5px;
    margin-left: 4px;
    
    ${({ theme }) => theme.mediaQueries.nav} {
        transform: rotate(3deg);
        display: flex;
        margin-left: 0px;
        margin-top: 12px;
    }
`
const RibbonWrapper = styled.div<{ isLetThereBeLight: boolean }>`
    left: 0;
    background-color: #F2F2F2;
    box-shadow: 1px 1px 2px ${({ theme }) => theme.colors.textShadow};
    border-radius: 50px;
    padding: 8px;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;

    ${({ isLetThereBeLight, theme }) => isLetThereBeLight && css`
        ${paletteLinearGradientBackground({ theme, secondary: false, summitPalette: SummitPalette.EXPEDITION })}
    `}
`
const BadgeText = styled(Text)`
    margin-left: -16px;
    height: 32px;
    padding: 4px 6px 4px 24px;
    line-height: 12px;
    background-color: #F2F2F2;
`

const StyledBadgeRibbonIcon = styled(BadgeRibbonIcon)<{ isLetThereBeLight: boolean }>`
    fill: ${({ theme, isLetThereBeLight }) => isLetThereBeLight ? 'white' : theme.colors.textGold};
    transform: rotate(-15deg);
    ${({ theme }) => theme.mediaQueries.nav} {
        transform: rotate(15deg);
    }
`

const getBadgeRaw = (totemIndex, loyalty, totemName) => {
    if (totemIndex === 0 || loyalty === -1) return null
    
    if (loyalty === -2) return `LET THERE|br|BE LIGHT`

    if (loyalty === 1) return `KNIFE IN THE|br|BACK-ER`
    if (loyalty === 2) return `YIELD|br|CHASER`

    if (loyalty < 12) return null
    if (loyalty < 24) return '24 HOUR|br|MAXI'
    if (loyalty < 36) return `UNSHAKABLE|br|${totemName}IST`
    if (loyalty < 72) return `THE ${totemName}|br|ABOVE ALL`
    return `${totemName}|br|LOYALIST`
}
const getBadge = (totemIndex, loyalty, totemName) => {
    const badgeRaw = getBadgeRaw(totemIndex, loyalty, totemName)
    return badgeRaw != null ? badgeRaw.split(' ').join(' ') : null
}
const getLoyaltyText = (totem, isMobile, loyalty, elevation) => {
    if (totem == null) return <>NO TOTEM<br/>SELECTED</>
    if (elevation === Elevation.OASIS) return 'FOREVER SAFE'
    if (isMobile) {
        if (loyalty === -2) return 'INF'
        if (loyalty === -1) return 'N/A'
        if (loyalty === 0) return 'INF'
        return loyalty
    }
    if (loyalty === -2) return 'INFINITE'
    if (loyalty === -1) return 'NOT YET TESTED'
    if (loyalty === 0) return 'INFINITE'
    return `${loyalty} ROUNDS`
}

const TotemAndElevWrapper = styled.div`
    position: relative;
    width: 100px;
    height: 160px;
    
    ${({ theme }) => theme.mediaQueries.nav} {
        width: 190px;
        height: 192px;
    }
`

const ElevationImagePosition = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0px;
    top: 0px;
`
const TotemPosition = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0px;
    top: 40px;
`

const TextBackground = styled(Flex)`
    max-width: 100%;
    /* background: linear-gradient(to right, transparent -50%, white, white, transparent); */
    /* overflow: visible; */
`

const LoyaltyText = styled(Text)<{ hasBadge: boolean }>`
    font-size: 11px;
    line-height: 11px;
    margin-bottom: 4px;
    padding-right: ${({ hasBadge }) => hasBadge ? 12 : 0}px;
    text-align: ${({ hasBadge }) => hasBadge ? 'right' : 'center'};


    ${({ theme }) => theme.mediaQueries.nav} {
        font-size: 11px;
        line-height: 11px;
        padding-right: 0px;
        text-align: center;
    }
`
const MobileSmallText = styled(Text)<{ hasBadge: boolean }>`
    font-size: 16px;
    line-height: 16px;
    padding-right: ${({ hasBadge }) => hasBadge ? 12 : 0}px;
    text-align: ${({ hasBadge }) => hasBadge ? 'right' : 'center'};


    ${({ theme }) => theme.mediaQueries.nav} {
        font-size: 16px;
        line-height: 16px;
        padding-right: 0px;
        text-align: center;
    }
`

const RoadmapTotem: React.FC<{ userTotem: number | null, crowned: boolean, loyalty: number, totemIndex: number, isMobile: boolean }> = React.memo(({ userTotem, crowned, loyalty, totemIndex, isMobile }) => {
    const elevation = elevationUtils.fromInt(totemIndex)
    const totemName = elevationUtils.getElevationTotemName(elevation, userTotem, false)

    const loyaltyText = getLoyaltyText(userTotem, isMobile, loyalty, elevation)
    const badge = getBadge(totemIndex, loyalty, totemName)
    const isLetThereBeLight = loyalty === -2

    const { onPresentTotemWinnersModal } = useTotemWinnersModal()

    const handlePresentSelectTotemModal = useCallback(
        () => onPresentTotemWinnersModal({ elevation }),
        [onPresentTotemWinnersModal, elevation]
    )

    return (
        <PressableFlex onClick={handlePresentSelectTotemModal} key={elevation} width='25%' position='relative' flexDirection='column' alignItems='center' justifyContent='center'>
            <TotemAndElevWrapper>
                <ElevationImagePosition>
                    <ElevationImage elevation={elevation} size={128} mobileSize={76} />
                </ElevationImagePosition>
                <TotemPosition>
                    <ArtworkTotem
                        elevation={elevation}
                        totem={userTotem}
                        crowned={crowned}
                        desktopSize="112"
                        mobileSize="76"
                    />
                </TotemPosition>
            </TotemAndElevWrapper>

            <HighlightedText mt='-24px' fontSize="16px" gold={crowned} header summitPalette={elevation}>
                {elevationUtils.getElevationTotemName(elevation, userTotem, false)}
            </HighlightedText>

            { userTotem != null &&
                <TextBackground flexDirection='column' alignItems='column' justifyContent='center'>
                        <LoyaltyText bold monospace hasBadge={badge != null}>
                            LOYALTY
                            {isMobile ? <br/> : ''}
                            {isMobile ? 'ROUNDS' : ''}:
                        </LoyaltyText>
                    <MobileSmallText bold monospace hasBadge={badge != null}>
                        {loyaltyText}
                    </MobileSmallText>
                    {badge != null &&
                        <BadgeWrapper>
                            <RibbonWrapper isLetThereBeLight={isLetThereBeLight}>
                                <StyledBadgeRibbonIcon width='24px' height='24px' isLetThereBeLight={isLetThereBeLight}/>
                            </RibbonWrapper>
                            <BadgeText bold gold monospace textAlign='center'>
                                {badge.split('|').map((text) => text === 'br' ? <br key='br' /> : text)}
                            </BadgeText>
                        </BadgeWrapper>
                    }
                </TextBackground>
            }
        </PressableFlex>
    )
})


export const RoadmapTotemRow: React.FC = React.memo(() => {
    const {
        totemsCrownsLoyalties
    } = useUserTotemCrownsLoyaltiesWithPreset()
    const isMobile = useMediaQuery('(max-width: 968px)')

    return (
        <RoadmapTotemRowWrapper>
            <Flex width='100%' alignItems='flex-start' justifyContent='space-around' maxWidth='850px'>
                {elevationUtils.all.map((elevation, elevIndex) => {
                    const { userTotem, crowned, loyalty } = totemsCrownsLoyalties[elevIndex]
                    return (
                        <RoadmapTotem
                            key={elevation}
                            userTotem={userTotem}
                            crowned={crowned && elevation !== Elevation.OASIS}
                            loyalty={loyalty}
                            totemIndex={elevIndex}
                            isMobile={isMobile}
                        />
                    )
                })}
            </Flex>
        </RoadmapTotemRowWrapper>
    )
})






export const ExpeditionLifetimeWinnings: React.FC = React.memo(() => {
    const {
        entered,
        summitLifetimeWinnings,
        usdcLifetimeWinnings,
    } = useExpeditionUserData()

    const rawSummitLifetimeWinnings = getFormattedBigNumber(summitLifetimeWinnings, 3)
    const rawUsdcLifetimeWinnings = getFormattedBigNumber(usdcLifetimeWinnings, 3, 6)

    if (!entered) return null

    return (
        <Flex width='100%' gap='6px' flexDirection='column' alignItems='center' justifyContent='center'>
            <Text mt='12px' style={{ width: '100%' }} textAlign='left' color='white' bold monospace small>LIFETIME WINNINGS:</Text>
            <Flex width='100%' flexDirection='row' alignItems='center' justifyContent='space-around'>
                <Flex flexDirection='column' alignItems='center' justifyContent='center'>
                    <DeityText bold italic monospace fontSize='22px'>{rawSummitLifetimeWinnings}</DeityText>
                    <Text color='white' bold italic monospace small>SUMMIT</Text>
                </Flex>
                <Flex flexDirection='column' alignItems='center' justifyContent='center'>
                    <DeityText bold italic monospace fontSize='22px'>{rawUsdcLifetimeWinnings}</DeityText>
                    <Text color='white' bold italic monospace small>USDC</Text>
                </Flex>
            </Flex>
        </Flex>
    )
})


const DeityWrapper = styled.div`
    position: relative;
    margin-top: -12px;
`

const DeityCrown = styled.div`
    position: absolute;
    background-image: url('/images/totemArtwork/CROWN.png');
    background-size: cover;

    width: calc(${50}px / 1.5);
    height: calc(${50}px / 1.5);

    ${({ theme }) => theme.mediaQueries.nav} {
        width: calc(${75}px / 1.25);
        height: calc(${75}px / 1.25);
    }
`

const BearCrown = styled(DeityCrown)`
    top: calc(36px + (${50}px * -0.35));
    left: calc(${50}px * 0.15);

    ${({ theme }) => theme.mediaQueries.nav} {
        top: calc(36px + (${75}px * -0.425));
        left: calc(${75}px * -0.025);
    }

    animation: pulseMirror 3s ease-in-out infinite;
    @keyframes pulseMirror {
        0% {
            -webkit-transform: translateY(0) scaleX(-1);
            transform: translateY(0) scaleX(-1);
        }
        50% {
            -webkit-transform: translateY(5px) rotate(5deg) scaleX(-1);
            transform: translateY(5px) rotate(5deg) scaleX(-1);
        }
        to {
            -webkit-transform: translateY(0) scaleX(-1);
            transform: translateY(0) scaleX(-1);
        }
    }
`

const DeityNameText = styled(HighlightedText)`
    z-index: 4;
    position: relative;
    margin-top: -24px;
    text-shadow: 1px 1px 2px ${textGold};
`
const DeityText = styled(Text)`
    z-index: 4;
    position: relative;
    text-shadow: 1px 1px 2px ${textGold};
    color: white;
`

export const RoadmapExpedition: React.FC = React.memo(() => {
    const { deity, crowned, faith, loyalty } = useExpeditionRoadmapInfoWithPreset()
    const totemName = elevationUtils.getElevationTotemName(Elevation.EXPEDITION, deity, false)
    const loyaltyText = getLoyaltyText(deity, false, loyalty, Elevation.EXPEDITION)
    const isLetThereBeLight = loyalty === -2
    const badge = getBadge(4, loyalty, totemName)
    return (
        <Flex width='100%' gap='24px' flexDirection='column' alignItems='center' justifyContent='flex-start' height='100%'>
            <DeityWrapper>
                <InverseDeity deity={deity} selected inverted width={192} />
                {crowned || true && <BearCrown />}
                <DeityNameText color='white'>
                    {totemName}
                </DeityNameText>
            </DeityWrapper>
            <TextBackground flexDirection='column' alignItems='column' justifyContent='center'>
                <DeityText italic bold monospace small textAlign='center' fontSize='11px'>
                    LOYALTY
                </DeityText>
                <DeityText italic bold monospace fontSize='26' textAlign='center' lineHeight='16px'>
                    {loyaltyText}
                </DeityText>
                <DeityText italic bold monospace small textAlign='center'>
                    FAITH: {faith}%
                </DeityText>
                {badge != null &&
                    <BadgeWrapper>
                        <RibbonWrapper isLetThereBeLight={isLetThereBeLight}>
                            <StyledBadgeRibbonIcon width='24px' height='24px' isLetThereBeLight={isLetThereBeLight}/>
                        </RibbonWrapper>
                        <BadgeText bold gold monospace textAlign='center'>
                            {badge.split('|').map((text) => text === 'br' ? <br /> : text)}
                        </BadgeText>
                    </BadgeWrapper>
                }
            </TextBackground>

            <ExpeditionWinnings/>
            <ExpeditionLifetimeWinnings/>


            <SummitButton
                summitPalette={SummitPalette.EXPEDITION}
                as={Link}
                to='/expedition'
                replace
                marginTop='18px'
            >
                OPEN EXPEDITION PAGE
            </SummitButton>
        </Flex>
    )
})
