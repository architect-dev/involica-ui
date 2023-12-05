import { Interface } from '@ethersproject/abi'
import BigNumber from 'bignumber.js'
import { getMulticallContract } from './contractHelpers'
import { ABI } from './types'

export interface Call {
	address: string // Address of the contract
	name: string // Function name on the contract (example: balanceOf)
	params?: any[] // Function params
}

const multicall = async (abi: ABI, calls: Call[]) => {
	const multi = getMulticallContract()
	const itf = new Interface(abi)

	const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
	const { returnData } = await multi.aggregate(calldata)
	const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call))

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
	numberBp,
	gwei,
	number,
	numberPrice,
	numberRaw,
	numberArr,
	bool,
}

export interface ParseFieldConfig {
	type: ParseFieldType
	stateField?: string
	customParse?: (any: any) => any
	nestedFields?: Record<string, ParseFieldConfig>
}

const multicallAndParse = async (abi: ABI, calls: Call[], parseFields: Record<string, ParseFieldConfig>) => {
	let res = null
	try {
		res = await multicall(abi, calls)
	} catch (error: any) {
		console.error('Error in multicall', error.message)
		return null
	}
	try {
		return res.map((item: any) => parseFieldRecord(item, parseFields))
	} catch (error: any) {
		console.error('Error in multicall parse', error.message)
		return null
	}
}

const parseFieldRecord = (value: any, fields: Record<string, ParseFieldConfig>) => {
	const itemData: Record<string, any> = {}
	Object.entries(fields).forEach(([field, { type, stateField, customParse, nestedFields }]) => {
		itemData[stateField || field] = parseField(value[field], type, customParse, nestedFields)
	})
	return itemData
}

const parseField = (
	value: any,
	type: ParseFieldType,
	customParse: ((any: any) => any) | undefined,
	nestedFields: Record<string, ParseFieldConfig> | undefined
) => {
	switch (type) {
		case ParseFieldType.custom:
			if (customParse == null) {
				console.error('Missing custom parse function')
				return
			}
			return customParse(value)

		case ParseFieldType.nested: {
			if (nestedFields == null) {
				console.error('Missing nested fields')
				return
			}
			return parseFieldRecord(value, nestedFields)
		}
		case ParseFieldType.nestedArr: {
			if (nestedFields == null) {
				console.error('Missing nested fields')
				return
			}
			return value.map((nValue: any) => parseFieldRecord(nValue, nestedFields))
		}

		case ParseFieldType.bignumber:
			return new BigNumber(value._hex).toJSON()
		case ParseFieldType.numberBp:
			return Number(new BigNumber(value._hex).div(100))
		case ParseFieldType.gwei:
			return new BigNumber(value._hex).div(1e9).toJSON()
		case ParseFieldType.number:
			return Number(new BigNumber(value._hex))
		case ParseFieldType.numberPrice:
			return Number(new BigNumber(value._hex).div(1e6))
		case ParseFieldType.numberRaw:
			return value
		case ParseFieldType.bignumberArr:
			return value.map((item: any) => new BigNumber(item._hex).toJSON())
		case ParseFieldType.numberArr:
			return value.map((item: any) => Number(new BigNumber(item._hex)))
		case ParseFieldType.bool:
		case ParseFieldType.address:
		case ParseFieldType.addressArr:
		case ParseFieldType.string:
			return value
		default:
			return null
	}
}

export default multicallAndParse
