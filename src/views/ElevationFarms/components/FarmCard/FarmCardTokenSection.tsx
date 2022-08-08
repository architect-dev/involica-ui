import React from 'react'
import { Flex, TooltipModalType } from 'uikit'
import BoundedProgressBar from '../BoundedProgressBar'
import { timestampToDate } from 'utils'
import { useFarmUserTokenSectionInfo } from 'state/hooksNew'
import { useCurrentTimestampOnce } from 'state/hooks'
import { clamp } from 'lodash'

interface Props {
  symbol: string
}

const week = (3600 * 24 * 7)
const maxBonusBP = 700

const FarmCardTokenSection: React.FC<Props> = ({ symbol }) => {  
  const {
    depositFeeBP,

    maxTaxBP,
    minTaxBP,
    currentTaxBP,
    taxResetTimestamp = 0,

    currentBonusBP,
    bonusResetTimestamp = 0,
  } = useFarmUserTokenSectionInfo(symbol)
  const currentTimestamp = useCurrentTimestampOnce()

  const sanitizedTaxResetTimestamp = taxResetTimestamp || currentTimestamp
  const taxStartDate = timestampToDate(sanitizedTaxResetTimestamp)
  const taxEndDate = timestampToDate(sanitizedTaxResetTimestamp + week)
  const taxPositionPerc = clamp(100 * ((currentTimestamp - sanitizedTaxResetTimestamp) / week), 0, 100)
  
  const sanitizedBonusResetTimestamp = bonusResetTimestamp || currentTimestamp
  const bonusStartTimestamp = sanitizedBonusResetTimestamp
  const bonusGrowthStartTimestamp = sanitizedBonusResetTimestamp + week
  const bonusStartDate = timestampToDate(bonusStartTimestamp)
  const bonusGrowthStartDate = timestampToDate(bonusGrowthStartTimestamp)
  const bonusEndDate = timestampToDate(bonusStartTimestamp + week + week)
  const bonusPositionPerc = clamp(100 * ((currentTimestamp - sanitizedBonusResetTimestamp) / (week * 2)), 0, 100)

  const withdrawalFeeTitle = maxTaxBP === minTaxBP ? 'WITHDRAWAL FEE' : 'DECAYING WITHDRAWAL FEE'
  const withdrawalFeePositionPerc = maxTaxBP === minTaxBP ? 100 : taxPositionPerc

  return (
    <Flex flexWrap='wrap' justifyContent='center' flexDirection='row' width='100%' mb='18px' mt='6px' style={{gap: '24px'}}>
      { depositFeeBP > 0 && false &&
        <BoundedProgressBar
          tooltipType={TooltipModalType.DepositFee}
          title='DEP. FEE'
          marks={[]}
          currDisplayPerc={depositFeeBP / 100}
        />
      }

      { maxTaxBP > 0 &&
        <BoundedProgressBar
          tooltipType={TooltipModalType.DecayingWithdrawalFee}
          title={withdrawalFeeTitle}
          marks={[
            {
              title: taxStartDate,
              displayPerc: maxTaxBP / 100,
              positionPerc: 0
            },
            {
              title: taxEndDate,
              displayPerc: minTaxBP / 100,
              positionPerc: 100
            }
          ]}
          currDisplayPerc={(taxResetTimestamp === 0 ? maxTaxBP : currentTaxBP) / 100}
          currPositionPerc={withdrawalFeePositionPerc}
        />
      }

      <BoundedProgressBar
        tooltipType={TooltipModalType.LoyaltyBonus}
        title='LOYALTY BONUS'
        marks={[
          {
            title: bonusStartDate,
            displayPerc: 0,
            positionPerc: 0
          },
          {
            title: bonusGrowthStartDate,
            displayPerc: 0,
            positionPerc: 50
          },
          {
            title: bonusEndDate,
            displayPerc: maxBonusBP / 100,
            positionPerc: 100
          }
        ]}
        currDisplayPerc={(bonusResetTimestamp === 0 ? 0 : currentBonusBP) / 100}
        currPositionPerc={bonusPositionPerc}
      />
    </Flex>
  )
}

export default React.memo(FarmCardTokenSection)
