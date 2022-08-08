import React from 'react'
import { Text } from '../../components/Text/Text'
import Flex from '../../components/Box/Flex'
import Modal from './Modal'
import SummitButton from '../../components/Button/SummitButton'

export enum TooltipModalType {
    DepositFee = 'DepositFee',
    DecayingWithdrawalFee = 'DecayingWithdrawalFee',
    LoyaltyBonus = 'LoyaltyBonus',
}

const modalTitle = (type: TooltipModalType): string => {
    switch (type) {
        case TooltipModalType.DepositFee: return 'Deposit Fee'
        case TooltipModalType.DecayingWithdrawalFee: return 'Decaying|br|Withdrawal Fee'
        case TooltipModalType.LoyaltyBonus: return 'Loyalty|br|Bonus'
        default: return ''
    }
}

const modalContent = (type: TooltipModalType): any => {
    switch (type) {
        case TooltipModalType.DecayingWithdrawalFee: return (
            <>
                Farms have a 7 day Decaying Withdrawal Fee that decreases from 7% to 1% (0% for the SUMMIT farm).
                <br/>
                <br/>
                The Decaying Withdrawal Fees ensures that users dont hit and run without contributing to the SUMMIT ecosystem.
                <br/>
                <br/>
                Each Farms' Decaying Withdrawal Fee is shared across all Elevations, and resets on a deposit of {'>='} 5% of current deposited value.
            </>
        )
        case TooltipModalType.LoyaltyBonus: return (
            <>
                After 7 days of staking in a Farm, you begin earning a LOYALTY BONUS
                <br/>
                (1% bonus / day)
                <br/>
                which maxes out at 7% after 7 days. 
                <br/>
                <br/>
                When you claim SUMMIT winnings from a Farm, your BONUS winnings are calculated and claimed as well.
                <br/>
                <br/>
                Your Loyalty Bonus will reset back to 0% on any withdrawal of staked funds.
            </>
        )
        case TooltipModalType.DepositFee: return (
            <>
                Deposit Fees contribute to the SUMMIT ecosystem.
                <br/>
                <br/>
                50% of Fees are distributed to EVEREST holders through the Expedition, and 50% are sent to the Summit Treasury.
            </>
        )
        default: return null
    }
}

interface Props {
    tooltipType: TooltipModalType
    onDismiss?: () => void
}

const TooltipModal: React.FC<Props> = ({ tooltipType, onDismiss = () => null }) => {

    // TODO: Add learn more external link
    return (
        <Modal title={modalTitle(tooltipType)} onDismiss={onDismiss} elevationCircleHeader="BLUE" headerless>
            <Text textAlign='center' mb='32px' style={{maxWidth: '350px'}} bold monospace small>{modalContent(tooltipType)}</Text>
            <Flex justifyContent="center">
                <SummitButton
                    secondary
                    onClick={onDismiss}
                >
                    CLOSE
                </SummitButton>
            </Flex>
        </Modal>
    )
}

export default TooltipModal