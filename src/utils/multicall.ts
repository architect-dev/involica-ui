import { Interface } from '@ethersproject/abi'
import BigNumber from 'bignumber.js'
import { getMulticallContract } from './contractHelpers'

export interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (exemple: balanceOf)
  params?: any[] // Function params
}

const multicall = async (abi: any[], calls: Call[]) => {
  const multi = getMulticallContract()
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData } = await multi.aggregate(calldata)
  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}

export enum ParseFieldType {
  custom,
  nested,
  nestedArr,

  address,
  addressArr,
  string,
  bignumber,
  bignumberArr,
  number,
  numberRaw,
  numberArr,
  bool,
}

export interface ParseFieldConfig {
  type: ParseFieldType
  stateField?: string
  customParse?: (any) => any
  nestedFields?: Record<string, ParseFieldConfig>
}

const parseField = (value: any, type: ParseFieldType, customParse?: (any) => any) => {
  switch (type) {
    case ParseFieldType.custom:
      return customParse(value)

    case ParseFieldType.nested:
      console.log('parse nested', value)
      return value
    case ParseFieldType.nestedArr:
      console.log('parse nested array', value)
      return value

    case ParseFieldType.bignumber:
      return new BigNumber(value._hex).toJSON()
    case ParseFieldType.number:
      return Number(new BigNumber(value._hex))
    case ParseFieldType.numberRaw:
      return value
    case ParseFieldType.bignumberArr:
      return value.map((item) => new BigNumber(item._hex).toJSON())
    case ParseFieldType.numberArr:
      return value.map((item) => Number(new BigNumber(item._hex)))
    case ParseFieldType.bool:
    case ParseFieldType.address:
    case ParseFieldType.addressArr:
    case ParseFieldType.string:
      return value
    default: return null
  }
}

const parseMulticallRes = (res: any, fields: Record<string, ParseFieldConfig>) => {
  return res.map((resItem) => {
    const itemData = {}
    Object.entries(fields).forEach(([field, { type, stateField, customParse }]) => {
      itemData[stateField || field] = parseField(resItem[field], type, customParse)
    })
    return itemData
  })
}

const multicallAndParse = async (abi: any[], calls: Call[], parseFields: Record<string, ParseFieldConfig>) => {
  return parseMulticallRes(
    await multicall(abi, calls),
    parseFields
  )
}

export default multicallAndParse