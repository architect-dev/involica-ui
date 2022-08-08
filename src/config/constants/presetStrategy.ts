import memoize from "fast-memoize"

export enum PresetStrategyName {
    YankeeDegen = 'The Yankee Degen',
    Hedger = 'The Hedger',
    Loyalist = 'The Loyalist',
}

interface PresetStrategyTotem {
    totem: number | null
    crowned: boolean
    loyalty: number | null
}

interface PresetStrategyStruct {
    titleOwnerDesc: {
        title: string,
        owner: string,
        description: string,
    },
    totems: {
        OASIS: PresetStrategyTotem
        PLAINS: PresetStrategyTotem
        MESA: PresetStrategyTotem
        SUMMIT: PresetStrategyTotem
    },
    farming: {
        avgStakingDuration: number | null
        contributions: {
            OASIS: number | null
            PLAINS: number | null
            MESA: number | null
            SUMMIT: number | null
        }
    },
    everest: {
        lockDuration: number | null
        lockPerc: string | null
    },
    expedition: {
        deity: number | null
        faith: number | null
        loyalty: number | null
    }
}

export const getPresetStrategy = memoize((strategy: PresetStrategyName): PresetStrategyStruct => {
    switch (strategy) {
        case PresetStrategyName.Hedger: return {
            titleOwnerDesc: {
                title: 'The Hedger',
                owner: 'anon',
                description: `The Hedger cascades his risk as the elevation climbs, prioritizing consistency. Still can't help dipping his toes into the elevations. For an unknown reason, has developed a propensity to the speedsters. Remains anonymous so friends don't find out about his $500usd crypto portfolio.`,
            },
            totems: {
                OASIS: {
                    totem: 0,
                    crowned: false,
                    loyalty: 0,
                },
                PLAINS: {
                    totem: 1,
                    crowned: false,
                    loyalty: 52,
                },
                MESA: {
                    totem: 3,
                    crowned: false,
                    loyalty: 30,
                },
                SUMMIT: {
                    totem: 7,
                    crowned: false,
                    loyalty: 30,
                }
            },
            farming: {
                avgStakingDuration: 889920,
                contributions: {
                    OASIS: 40,
                    PLAINS: 30,
                    MESA: 20,
                    SUMMIT: 10,
                },
            },
            everest: {
                lockDuration: 270,
                lockPerc: '50.0%',
            },
            expedition: {
                deity: 0,
                faith: 50,
                loyalty: 3,
            }
        }
        case PresetStrategyName.Loyalist: return {
            titleOwnerDesc: {
                title: 'The Loyalist',
                owner: '< Unknown, name Forgotten >',
                description: `After climbing Everest, consulting with the Cosmic Dieties, and doing copious amounts of Payote, the Loyalist's ordained totems were chosen for now and for all eternity. Remains faithful to both Cosmic Dieties.`,
            },
            totems: {
                OASIS: {
                    totem: 0,
                    crowned: false,
                    loyalty: 75,
                },
                PLAINS: {
                    totem: 0,
                    crowned: false,
                    loyalty: 75,
                },
                MESA: {
                    totem: 2,
                    crowned: false,
                    loyalty: 75,
                },
                SUMMIT: {
                    totem: 0,
                    crowned: false,
                    loyalty: 75,
                }
            },
            farming: {
                avgStakingDuration: 2816640,
                contributions: {
                    OASIS: 25,
                    PLAINS: 25,
                    MESA: 25,
                    SUMMIT: 25,
                },
            },
            everest: {
                lockDuration: 365,
                lockPerc: '75.0%',
            },
            expedition: {
                deity: 0,
                faith: 100,
                loyalty: 3,
            }
        }
        default:
        case PresetStrategyName.YankeeDegen: return {
            titleOwnerDesc: {
                title: 'The Yankee Degen',
                owner: 'Yankee Ruin X',
                description: `The Yankee Degen jumps on any Totem arb opportunity > 0.01%. Max Everest lock is the only way. Always 100% Faith in the Bear. He doesn't always win, but when he does, the payouts are Euphoric.`,
            },
            totems: {
                OASIS: {
                    totem: 0,
                    crowned: false,
                    loyalty: 0,
                },
                PLAINS: {
                    totem: 0,
                    crowned: false,
                    loyalty: 2,
                },
                MESA: {
                    totem: 4,
                    crowned: false,
                    loyalty: 2,
                },
                SUMMIT: {
                    totem: 6,
                    crowned: false,
                    loyalty: 2,
                }
            },
            farming: {
                avgStakingDuration: 12800,
                contributions: {
                    OASIS: 0,
                    PLAINS: 0,
                    MESA: 30,
                    SUMMIT: 70,
                },
            },
            everest: {
                lockDuration: 301,
                lockPerc: '100.0%',
            },
            expedition: {
                deity: 1,
                faith: 100,
                loyalty: -1,
            }
        }
    }
})