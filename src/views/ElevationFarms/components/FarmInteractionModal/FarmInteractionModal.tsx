import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, Text, Modal, ChevronRightIcon, MobileColumnFlex, ExternalLinkButton, TokenSymbolImage, SummitButton } from 'uikit'
import TokenInput from '../../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../../utils/formatBalance'
import { Elevation, elevationUtils, elevToPalette, SummitPalette } from 'config/constants/types'
import ElevationSelector from '../ElevationSelector'
import { isNumber } from 'lodash'
import { useElevationsInteractionsLocked, useElevationUserTotem, useFarmUserTokenFairnessTaxBP, useSymbolElevateModalInfo } from 'state/hooksNew'
import { useWeb3React } from '@web3-react/core'
import FarmInteractionTypeSelector, { FarmInteractionType } from '../FarmCard/FarmInteractionTypeSelector'
import styled from 'styled-components'
import { WalletIcon } from 'uikit/widgets/Menu/icons'
import DesktopVerticalDivider from 'uikit/components/DesktopVerticalDivider'
import FarmInteractionModalElevStats from './FarmInteractionModalElevStats'
import FarmInteractionActionButton from './FarmInteractionActionButton'
import FarmIconAndAllocation from '../FarmCard/FarmIconAndAllocation'
import { registerToken } from 'utils/wallet'

const WalletIconWrapper = styled.div<{ noBackground?: boolean }>`
  background-color: ${({ theme, noBackground }) => noBackground === true ? 'none' : theme.colors.selectorBackground};
  width: 140px;
  height: 116px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const HeaderTokenWrapper = styled.div`
  position: absolute;
  top: -60px;
`

const StyledWalletIcon = styled(WalletIcon)`
  width: 32px;
  height: 32px;
`

const BaseElevFlare = styled.div<{ elevation: Elevation }>`
  display: flex;
  position: absolute;
  bottom: -38px;
  height: 50px;
  background-color: ${({ theme, elevation }) => theme.colors[elevation]};
  left: 0px;
  right: 0px;
  opacity: 0.15;
  z-index: -1;

  &:after {
      content: ' ';
      border: 0;
      position: absolute;
      width: 20px;
      bottom: 20px;
      top: 0px;
      border-radius: 0 0 20px 20px;
      background: ${({ theme }) => theme.colors.background};
  }
`
const TargetElevFlare = styled(BaseElevFlare)`
  left: -20px;

  &:after {
    left: 0px;
    border-radius: 0 0 20px 0;
  }
`
const SourceElevFlare = styled(BaseElevFlare)`
  right: -20px;

  &:after {
    right: 0px;
    border-radius: 0 0 0 20px;
  }
`
const ExploreElevFlare = styled(BaseElevFlare)`
  left: -20px;
  right: -20px;

  &:before {
    content: ' ';
    border: 0;
    position: absolute;
    width: 20px;
    bottom: 20px;
    top: 0px;
    left: 0px;
    border-radius: 0 0 20px 0;
    background: ${({ theme }) => theme.colors.background};
  }

  &:after {
    right: 0px;
    border-radius: 0 0 0 20px;
  }
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.textSubtle};
  height: 1px;
  margin-top: 18px;
  margin-bottom: 12px;
  width: 100%;
`

interface FarmInteractionModalProps {
  symbol: string
  onDismiss?: () => void
}

const FarmInteractionModal: React.FC<FarmInteractionModalProps> = ({
  symbol,
  onDismiss,
}) => {
  const { account } = useWeb3React()
  const {
    elevStaked,
    decimals,
    farmToken,
    depositFeeBP,

    farmAllowance,
    walletBalance,

    name,
    lpSource,
    allocation,
    getUrl,
  } = useSymbolElevateModalInfo(symbol)
  const userFairnessTaxBP = useFarmUserTokenFairnessTaxBP(symbol)
  const elevationsInteractionsLocked = useElevationsInteractionsLocked()

  const isApproved = account && farmAllowance && farmAllowance.isGreaterThan(0)
  const [farmInteractionType, setFarmInteractionType] = useState(FarmInteractionType.Deposit)

  const interactionTypeDescription = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return `Select an Elevation and Amount of ${symbol} to Deposit.`
          return `Approve ${symbol} to Stake it in our Farms`
        case FarmInteractionType.Elevate: return `Transfer ${symbol} directly between Elevations (no Deposit or Withdrawal Fee)`
        case FarmInteractionType.Withdraw: return `Select an elevation and Withdraw your ${symbol}`
        default: return ''
      }
    },
    [isApproved, symbol, farmInteractionType]
  )
  
  const interactionTypeText = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return 'Deposit'
          return 'Approve'
        case FarmInteractionType.Elevate: return `Elevate`
        case FarmInteractionType.Withdraw: return `Withdraw`
        default: return ''
      }
    },
    [isApproved, farmInteractionType]
  )


  const sisterElevations = [Elevation.OASIS, Elevation.PLAINS, Elevation.MESA, Elevation.SUMMIT]

  const sourceElevations = sisterElevations
  const targetElevations = sisterElevations

  const [selectedSourceElevation, setSelectedSourceElevation] = useState<Elevation | null>(null)
  const [selectedTargetElevation, setSelectedTargetElevation] = useState<Elevation | null>(null)
  const [exploreElevation, setExploreElevation] = useState<Elevation | null>(null)
  const uiElevation = selectedTargetElevation ?? selectedSourceElevation

  const handleSetFarmInteractionType = useCallback(
    (type: FarmInteractionType) => {
      setFarmInteractionType(type)
      if (type === FarmInteractionType.Deposit) setSelectedSourceElevation(null)
      if (type === FarmInteractionType.Withdraw) setSelectedTargetElevation(null)
    },
    [setFarmInteractionType, setSelectedSourceElevation, setSelectedTargetElevation]
  )

  const uiPalette = elevToPalette(uiElevation)
  const totem = useElevationUserTotem(selectedTargetElevation)

  const [fullBalance, setFullBalance] = useState('0')
  const [val, setVal] = useState('')
  const [invalidVal, setValInvalid] = useState(true)

  const validElevateVal = (testVal, stakedBal) => {
    return isNumber(parseFloat(testVal)) && parseFloat(testVal) > 0 && parseFloat(testVal) <= parseFloat(stakedBal)
  }

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
      setValInvalid(!validElevateVal(e.currentTarget.value, fullBalance))
    },
    [setVal, setValInvalid, fullBalance],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
    setValInvalid(!validElevateVal(fullBalance, fullBalance))
  }, [fullBalance, setVal, setValInvalid])

  const handleSelectSourceElevation = useCallback(
    (newElevation: Elevation) => {
      setSelectedSourceElevation(newElevation)
    },
    [setSelectedSourceElevation],
  )

  useEffect(
    () => {
      let newFullBalance
      if (farmInteractionType === FarmInteractionType.Deposit) {
        // Deposit Full balance is wallet balance
        newFullBalance = getFullDisplayBalance(
          walletBalance,
          decimals,
        )
      } else if (selectedSourceElevation === null) {
        return
      } else {
        // Elevate / Withdraw full balance is Elevation Balance (only if source elev selected)
        newFullBalance = getFullDisplayBalance(
          elevStaked[selectedSourceElevation],
          decimals,
        )
      }

      setFullBalance(newFullBalance)
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletBalance, selectedSourceElevation]
  )

  const handleSelectTargetElevation = useCallback(
    (newElevation: Elevation) => {
      setSelectedTargetElevation(newElevation)
    },
    [setSelectedTargetElevation],
  )


  const [tokenInputFeeText, tokenInputFeeBP] = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (isApproved) return [`Deposit Fee (${(depositFeeBP / 100).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })}%)`, depositFeeBP]
          return [null, null]
        case FarmInteractionType.Elevate: return [null, null]
        case FarmInteractionType.Withdraw: return [`Decaying Withdrawal Fee (${(userFairnessTaxBP / 100).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
      })}%)`, userFairnessTaxBP]
        default: return [null, null]
      }
    },
    [isApproved, farmInteractionType, depositFeeBP, userFairnessTaxBP]
  )


  const invalidElevationErr = useMemo(
    () => {
      switch (farmInteractionType) {
        case FarmInteractionType.Deposit:
          if (!isApproved) return null
          if (selectedTargetElevation == null) return 'Must select an Elevation to Deposit into'
          if (elevationsInteractionsLocked[elevationUtils.toInt(selectedTargetElevation)]) return `The ${selectedTargetElevation} is locked until the Round Ends`
          return null
        case FarmInteractionType.Elevate:
          if (selectedTargetElevation == null && selectedSourceElevation == null) return 'Select Elevations to transfer funds between'  
          if (selectedSourceElevation == null) return 'Must select a source Elevation'
          if (elevationsInteractionsLocked[elevationUtils.toInt(selectedSourceElevation)]) return `The ${selectedSourceElevation} is locked until the Round Ends`
          if (selectedTargetElevation == null) return 'Must select a target Elevation'
          if (elevationsInteractionsLocked[elevationUtils.toInt(selectedTargetElevation)]) return `The ${selectedTargetElevation} is locked until the Round Ends`
          if (selectedSourceElevation === selectedTargetElevation) return 'Must Elevate between two different Elevations'
          return null
        case FarmInteractionType.Withdraw:
          if (selectedSourceElevation == null) return 'Must select an Elevation to Withdraw from'
          if (elevationsInteractionsLocked[elevationUtils.toInt(selectedSourceElevation)]) return `The ${selectedSourceElevation} is locked until the Round Ends`
          return null
        default: return null
      }
    },
    [isApproved, elevationsInteractionsLocked, farmInteractionType, selectedSourceElevation, selectedTargetElevation]
  )

  const watchToken = useCallback(
    () => {
      registerToken(farmToken, symbol, symbol, decimals)
    },
    [farmToken, symbol, decimals]
  )

  return (
    <Modal
      title={`${interactionTypeText}|br|${symbol}`}
      onDismiss={onDismiss}
      headerless
    >
      <Flex justifyContent="center" flexDirection="column" alignItems="center" gap='18px' mt='40px'>

        <HeaderTokenWrapper>
          <TokenSymbolImage symbol={symbol} width={120} height={120} />
        </HeaderTokenWrapper>

        <Flex marginBottom='12px' width='330px' alignItems='center' justifyContent='space-between'>
          <FarmIconAndAllocation noIcon symbol={symbol} lpSource={lpSource} name={name} allocation={allocation} live={allocation > 0}/>
          <Flex flex='1' height='100%' gap='2px' flexDirection='column' alignItems='flex-end' justifyContent='space-around'>
            <ExternalLinkButton summitPalette={uiElevation} href={getUrl}>
              Get {symbol}
            </ExternalLinkButton>
            <SummitButton
              onClick={watchToken}
              height={24}
              padding={22}
              style={{ marginLeft: '8px' }}
              summitPalette={SummitPalette.BASE}
            >
              + <img style={{ marginLeft: 8 }} width={16} src="/images/wallet/metamask.png" alt="metamask logo" />
            </SummitButton>
          </Flex>
        </Flex>

        <FarmInteractionTypeSelector
          isApproved={isApproved}
          elevation={uiElevation}
          farmInteractionType={farmInteractionType}
          setFarmInteractionType={handleSetFarmInteractionType}
        />


        <Text textAlign="center" monospace small bold>
          {interactionTypeDescription}
        </Text>


        <MobileColumnFlex gap='24px' alignItems='flex-start' justifyContent='space-between'>

          { isApproved &&
            <Flex width='360px' maxWidth='100%' justifyContent="center" flexDirection="column" alignItems="center" gap='18px'>

              <Flex justifyContent="space-between" alignItems="center" width="100%">
                <Flex position='relative' flexDirection="column" alignItems="center">
                  <Text bold monospace small>
                    FROM:
                  </Text>
                  { farmInteractionType === FarmInteractionType.Deposit ?
                    <WalletIconWrapper>
                      <StyledWalletIcon/>
                      <Text bold monospace>WALLET</Text>
                    </WalletIconWrapper> :
                    <ElevationSelector
                      selected={selectedSourceElevation}
                      elevations={sourceElevations}
                      lockedElevations={elevationsInteractionsLocked}
                      selectElevation={handleSelectSourceElevation}
                      vertical
                    />
                  }
                  { (farmInteractionType === FarmInteractionType.Withdraw && selectedSourceElevation != null) &&
                    <SourceElevFlare elevation={selectedSourceElevation}/>
                  }
                </Flex>

                <Flex mt='24px'>
                  <ChevronRightIcon width="24px" mr="-8px" key="a" />
                  <ChevronRightIcon width="24px" ml="-8px" key="b" />
                </Flex>

                <Flex position='relative' flexDirection="column" alignItems="center">
                  <Text bold monospace small>
                    TO:
                  </Text>
                  { farmInteractionType === FarmInteractionType.Withdraw ?
                    <WalletIconWrapper>
                      <StyledWalletIcon/>
                      <Text bold monospace>WALLET</Text>
                    </WalletIconWrapper> :
                    <ElevationSelector
                      selected={selectedTargetElevation}
                      elevations={targetElevations}
                      lockedElevations={elevationsInteractionsLocked}
                      selectElevation={handleSelectTargetElevation}
                      vertical
                    />
                  }
                  { selectedTargetElevation != null && <TargetElevFlare elevation={selectedTargetElevation}/>}
                </Flex>
              </Flex>

              <FarmInteractionModalElevStats symbol={symbol} elevation={uiElevation}/>


              <Flex height='30px'>
                { invalidElevationErr != null &&
                  <Text bold monospace small textAlign='center' color='red'>
                    {invalidElevationErr}
                  </Text>
                }
              </Flex>
            </Flex>
          }

          { isApproved && <DesktopVerticalDivider/> }

          <Flex width='360px' maxWidth='100%' justifyContent="center" flexDirection="column" alignItems="center" gap='18px'>

            { isApproved &&
              <Flex flexDirection='column' alignItems='center' justifyContent='center'>
                <Text bold monospace small>
                {interactionTypeText.toUpperCase()} AMOUNT:
                </Text>

                {/* <Flex width='100%'>
                  <FarmStakingContribution symbol={symbol} elevation={selectedSourceElevation} userDataLoaded={userDataLoaded} elevationsStaked={elevStaked} pricePerToken={pricePerToken} decimals={decimals}/> :
                </Flex> */}

                <TokenInput
                  summitPalette={uiPalette}
                  balanceText={`${selectedSourceElevation ?? 'WALLET'} BALANCE`}
                  feeText={tokenInputFeeText}
                  feeBP={tokenInputFeeBP}
                  value={val}
                  onSelectMax={handleSelectMax}
                  onChange={handleChange}
                  disabled={totem == null}
                  max={fullBalance}
                  symbol={symbol}
                />
              </Flex>
            }

            <FarmInteractionActionButton
              symbol={symbol}
              uiElevation={uiElevation}
              sourceElevation={selectedSourceElevation}
              targetElevation={selectedTargetElevation}
              farmInteractionType={farmInteractionType}
              decimals={decimals}
              farmToken={farmToken}
              isApproved={isApproved}
              val={val}
              invalidVal={invalidVal}
              invalidElevationErr={invalidElevationErr != null}
              totem={totem}
              onDismiss={onDismiss}
            />

            {!isApproved &&
              <>
                <Divider/>
                <Flex justifyContent="center" alignItems="center" width="100%">
                  <Flex position='relative' flexDirection="column" alignItems="center">
                    <WalletIconWrapper noBackground>
                      <Text bold monospace textAlign='center' small>Explore the Elevations:</Text>
                    </WalletIconWrapper>
                  </Flex>

                  {/* <Flex mt='24px' width='24px'/> */}

                  <Flex position='relative' flexDirection="column" alignItems="center">
                    <ElevationSelector
                      selected={exploreElevation}
                      lockedElevations={[]}
                      elevations={targetElevations}
                      selectElevation={setExploreElevation}
                      vertical
                    />
                    { exploreElevation != null && <ExploreElevFlare elevation={exploreElevation}/>}
                  </Flex>
                </Flex>
                <FarmInteractionModalElevStats symbol={symbol} elevation={exploreElevation}/>
              </>
            }
          </Flex>
        </MobileColumnFlex>
      </Flex>
    </Modal>
  )
}

export default FarmInteractionModal
