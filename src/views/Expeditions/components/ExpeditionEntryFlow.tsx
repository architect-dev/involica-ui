import React, { useState, useCallback } from 'react'
import { FaithSlider } from 'components/SelectTotemModal'
import { Elevation, SummitPalette } from 'config/constants'
import { useEnterExpedition } from 'hooks/useEnterExpedition'
import { useSelectTotemAndOrFaith } from 'hooks/useSelectTotem'
import styled from 'styled-components'
import { Flex, Text, SummitButton } from 'uikit'
import Divider from './Divider'
import { useExpeditionEntryFlow } from 'state/hooksNew'
import { Link } from 'react-router-dom'
import { transparentize } from 'polished'

const DivineBonus = 20

enum ExpedEntryFlowItem {
    Deity,
    Faith,
    EverestOwned,
    Entered,
}
const OrderedEntryFlow = [
    ExpedEntryFlowItem.Deity,
    ExpedEntryFlowItem.Faith,
    ExpedEntryFlowItem.EverestOwned,
    ExpedEntryFlowItem.Entered,
]
const ProgressHeaderFlowItems = [
    ExpedEntryFlowItem.Deity,
    ExpedEntryFlowItem.Faith,
    ExpedEntryFlowItem.EverestOwned,
]
const flowItemTitle = (flowItem: ExpedEntryFlowItem) => {
    switch (flowItem) {
        case ExpedEntryFlowItem.Deity:
            return 'SELECT DEITY'
        case ExpedEntryFlowItem.Faith:
            return 'SELECT FAITH'
        case ExpedEntryFlowItem.EverestOwned:
            return 'GET EVEREST'
        default: return ''
    }
}


const ActiveFlowItemUnderline = styled.div`
    position: absolute;
    width: 100%;
    bottom: -2px;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.text};
`

const FlowWrapper = styled(Flex)`
    background: ${({ theme }) => transparentize(0.7, theme.colors.text)};
    padding: 12px 36px;
`

const EntryFlowItem: React.FC<{ flowItem: ExpedEntryFlowItem, flowIndex: number, completed: boolean, active: boolean }> = ({ flowItem, flowIndex, completed, active }) => {
    return (
        <Flex gap='6px' alignItems='center' justifyContent='center' position='relative'>
            <Text gold={completed} bold={active || completed} monospace lineHeight='16px'>{completed ? '✔ ' : `${flowIndex}.`}</Text>
            <Text gold={completed} bold={active || completed} monospace textAlign='center' lineHeight='16px'>{ flowItemTitle(flowItem) }</Text>
            { active && <ActiveFlowItemUnderline/>}
        </Flex>
    )
}

interface EntryProgress {
    [ExpedEntryFlowItem.Deity]: boolean
    [ExpedEntryFlowItem.Faith]: boolean
    [ExpedEntryFlowItem.EverestOwned]: boolean
    [ExpedEntryFlowItem.Entered]: boolean
}

interface EntryFlowProgressProps {
    entryProgress: EntryProgress
    activeFlowItem: ExpedEntryFlowItem
}

const EntryFlowProgress: React.FC<EntryFlowProgressProps> = ({ entryProgress, activeFlowItem}) => {
    return (
        <FlowWrapper px='24px' gap='36px' alignItems='center' justifyContent='center'>
            { ProgressHeaderFlowItems.map((flowItem, index) =>
                <EntryFlowItem
                    key={flowItem}
                    flowIndex={index + 1}
                    flowItem={flowItem}
                    completed={entryProgress[flowItem]}
                    active={flowItem === activeFlowItem}
                />
            )}
        </FlowWrapper>
    )
}



const SelectDeityFlowItem: React.FC = () => {
    return <Flex gap='24px' flexDirection='column' alignItems='center' justifyContent='center'>
        <Text bold monospace small textAlign='center' style={{maxWidth: '500px'}}>
            SELECT ONE OF THE TWO DEITIES ABOVE
        </Text>
        <Text bold monospace small textAlign='center' fontSize='12px' style={{maxWidth: '500px'}}>
            The DEITIES above watch over each 24 hour EXPEDITION. The relative strength
            of each DEITY changes each round. Only one DEITY wins each
            round, and the winnings are distributed to only that DEITY.
            <br/>
            <br/>
            You can change your DEITY at any point without penalty.
        </Text>
    </Flex>
}

const SelectFaithFlowItem: React.FC = () => {
    const { pending: faithPending, onSelectTotemAndOrSafetyFactor: onSelectFaith } = useSelectTotemAndOrFaith()
    const [ faith, setFaith ] = useState(null)

    const handleSelectFaith = useCallback(() => {
        if (faithPending || faith == null) return
        onSelectFaith(
            Elevation.EXPEDITION,
            null,
            faith
        )
    }, [faithPending, faith, onSelectFaith])

    const faithText = faith != null ? `${faith}%` : '-'
    const invFaithText = faith != null ? `${100 - faith}%` : '-'

    return <Flex gap='24px' flexDirection='column' alignItems='center' justifyContent='center' pl='24px' pr='24px'>
        <Text bold monospace small textAlign='center' style={{maxWidth: '500px'}}>
            Betting on the DEITIES is risky, but your risk is up to you.
            Your FAITH determines how much of your winnings is risked with the gods VS guaranteed.
            Winnings from the DEITIES is given a {DivineBonus}% divine bonus.
        </Text>

        <FaithSlider
            existingFaith={null}
            setFaith={setFaith}
        />
        
        <Text bold monospace small textAlign='center' style={{maxWidth: '500px'}}>
            {faithText} of your potential winnings each round will be risked on the DEITIES, and will earn a {DivineBonus}% bonus if your DEITY wins.
            The rest ({invFaithText}) are guaranteed winnings.
        </Text>

        <SummitButton
            disabled={faith == null}
            onClick={handleSelectFaith}
            isLoading={faithPending}
            summitPalette={Elevation.EXPEDITION}
            mt='24px'
        >
            CONFIRM FAITH
        </SummitButton>
        <Text mt='-12px' bold monospace small textAlign='center' fontSize='10px' style={{maxWidth: '500px'}}>
            You can change your FAITH at any point without penalty.
        </Text>
    </Flex>
}



const GetEverestFlowItem: React.FC = () => {
    return <Flex gap='36px' flexDirection='column' alignItems='center' justifyContent='center'>
        <Text bold monospace small textAlign='center' style={{maxWidth: '500px'}}>
            EVEREST is the currency of the gods, and it is your
            entry ticket to witness their battle. Lock your SUMMIT for
            anywhere from 7 days to 1 year, and return here to enjoy the spoils.
            <br/>
            <br/>
            <br/>
            The amount of EVEREST you own determines how much you can
            win in each EXPEDITION.
            <br/>
            <br/>
            <br/>
            Is there any greater Summit than EVEREST itself?
        </Text>
        <SummitButton
            as={Link}
            summitPalette={SummitPalette.EVEREST}
            to='/everest'
            replace
            mt='12px'
        >
            GET EVEREST
        </SummitButton>
    </Flex>
}




const EnterTheExpeditionFlowItem: React.FC = () => {
    const { entryPending, onEnterExpedition } = useEnterExpedition()

    const handleEnterExpedition = useCallback(() => {
        if (entryPending) return
        onEnterExpedition()
    }, [entryPending, onEnterExpedition])

    return <Flex mt='24px' gap='24px' flexDirection='column' alignItems='center' justifyContent='center' pl='24px' pr='24px'>
        <Text bold monospace small textAlign='center' style={{maxWidth: '500px'}}>
            The Summit Awaits.
        </Text>

        <SummitButton
            onClick={handleEnterExpedition}
            isLoading={entryPending}
            summitPalette={Elevation.EXPEDITION}
        >
            ENTER THE
            <br/>
            EXPEDITION
        </SummitButton>

        <Text bold monospace small textAlign='center' mt='24px' style={{maxWidth: '500px'}}>
            You will only ever need to enter the Expedition once. This Setup Flow simply ensures that users understand and meet the Expedition requirements. You wont ever have to Exit the Expedition either.
        </Text>
    </Flex>
}



const ActiveFlowItem: React.FC<{ activeFlowItem: ExpedEntryFlowItem }> = ({ activeFlowItem }) => {
    switch (activeFlowItem) {
        case ExpedEntryFlowItem.Deity:
            return <SelectDeityFlowItem/>
        case ExpedEntryFlowItem.Faith:
            return <SelectFaithFlowItem/>
        case ExpedEntryFlowItem.EverestOwned:
            return <GetEverestFlowItem/>
        case ExpedEntryFlowItem.Entered:
            return <EnterTheExpeditionFlowItem/>
        default: return null
    }
}


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    margin-top: 36px;
    margin-bottom: 36px;

    ${({ theme }) => theme.mediaQueries.nav} {
        margin-bottom: 250px;
    }
`


const ExpeditionEntryFlow: React.FC = () => {
    const { deity, faith, everestOwned } = useExpeditionEntryFlow()

    const entryProgress: EntryProgress = {
        [ExpedEntryFlowItem.Deity]: deity != null,
        [ExpedEntryFlowItem.Faith]: faith != null,
        [ExpedEntryFlowItem.EverestOwned]: everestOwned != null && everestOwned.isGreaterThan(0),
        [ExpedEntryFlowItem.Entered]: false,
    }

    const activeFlowItem = OrderedEntryFlow.find((flowItem) => !entryProgress[flowItem])

    return (
        <Wrapper>
            <Divider/>
            <Text bold monospace fontSize='18px'>ENTER THE EXPEDITION:</Text>
            <EntryFlowProgress entryProgress={entryProgress} activeFlowItem={activeFlowItem}/>
            <ActiveFlowItem activeFlowItem={activeFlowItem}/>
            <Divider/>
        </Wrapper>
    )
}

export default React.memo(ExpeditionEntryFlow)