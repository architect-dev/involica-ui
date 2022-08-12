import { chunk } from "lodash"
import { bnZero } from "./bigNum"

export const chunkArray = <T>(chunkSize: number, array: T[]): T[][] => {
  const groups: T[][] = []
  let i = 0
  for (i = 0; i < array.length; i += chunkSize) {
    groups.push(array.slice(i, i + chunkSize))
  }
  return groups
}

export const promiseSequenceForEach = async <T, R>(
  inputArray: T[],
  callback: (element: T, index: number, array: T[]) => Promise<R>,
) => {
  for (let i = 0; i < inputArray.length; i++) {
    await callback(inputArray[i], i, inputArray)
  }
}

type IfTrueThenNotNull<BoolOrNothing extends boolean | undefined, R> = BoolOrNothing extends true
  ? Exclude<R, null | undefined>
  : R

export const mapValues = <T, U, V extends boolean | undefined>(
  input: Map<string | number, T>,
  valueTransformer: (value: T) => U,
  filterValues?: V,
): Map<string | number, IfTrueThenNotNull<V, U>> => {
  const newMap: Map<string | number, IfTrueThenNotNull<V, U>> = {} as Map<string | number, IfTrueThenNotNull<V, U>>
  Object.keys(input).forEach((key) => {
    const newValue = valueTransformer(input[key])
    if (!!newValue || !filterValues) {
      newMap[key] = newValue as IfTrueThenNotNull<V, U>
    }
  })
  return newMap
}

export const mapKeysAndValues = <T, U, V extends boolean | undefined>(
  input: Map<string | number, T>,
  valueTransformer: (key: string, value: T) => U,
  filterValues?: true,
): Map<string | number, IfTrueThenNotNull<V, U>> => {
  const newMap: Map<string | number, IfTrueThenNotNull<V, U>> = {} as Map<string | number, IfTrueThenNotNull<V, U>>
  Object.keys(input).forEach((key) => {
    const newValue = valueTransformer(key, input[key])
    if (!!newValue || !filterValues) {
      newMap[key] = newValue as IfTrueThenNotNull<V, U>
    }
  })
  return newMap
}

export const groupBy = <T>(
  fromArray: T[],
  keyExtractor: (item: T, index: number) => string | number,
): Map<string | number, T> => {
  const grouped: Map<string | number, T> = {} as Map<string | number, T>
  fromArray.forEach((item, index) => {
    grouped[keyExtractor(item, index)] = item
  })
  return grouped
}

export const groupByAndMap = <T, U>(
  fromArray: T[],
  keyExtractor: (item: T, index: number) => string,
  transform: (item: T, index: number) => U,
): Record<string, U> => {
  const grouped: Record<string, U> = {} as Record<string, U>
  fromArray.forEach((item, index) => {
    grouped[keyExtractor(item, index)] = transform(item, index)
  })
  return grouped
}
export const nFormatter = (num: number, digits = 2): string => {
  const si = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    // { value: 1e3, symbol: 'K' },
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toExponential(digits).split('e')[0] + si[i].symbol
    }
  }
  return num.toFixed(digits)
}

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const parseJSON = (inputString, fallback) => {
  if (inputString) {
    try {
      return JSON.parse(inputString) || fallback
    } catch (e) {
      return fallback
    }
  }
  return fallback
}


export const promiseSequenceMap = async <T, R>(inputArray: T[], transformer: (element: T, index: number, array: T[]) => Promise<R>): Promise<R[]> => {
  const newArray: R[] = []
  for (let i = 0; i < inputArray.length; i++) {
      newArray[i] = await transformer(inputArray[i], i, inputArray)
  }
  return newArray
}

export const variableChunk = (chunkable: any, variableChunkSizes: number[], baseChunkSize = 1) => {
  const baseChunked = baseChunkSize > 1 ? 
    chunk(chunkable, baseChunkSize) :
    chunkable

  const finalChunked = []

  let chunkStart = 0
  for (let i = 0; i < variableChunkSizes.length; i++) {
    finalChunked.push(baseChunked.slice(chunkStart,chunkStart + variableChunkSizes[i]))
    chunkStart += variableChunkSizes[i]
  }

  return finalChunked
}

export const lowerCaseEqual = (a: string, b: string): boolean => {
  return a.toLowerCase() === b.toLowerCase()
}
export const addressArrayIndexOf = (arr: string[], add: string): number => {
  for (let i = 0; i < arr.length; i++) {
    if (lowerCaseEqual(arr[i], add)) return i
  }
  return -1
}

export const sumBigNumbersByKey = (objs: any[], key: string) => {
  return objs.reduce((acc, obj) => acc.plus(obj[key] || bnZero), bnZero)
}
export const maxBigNumberByKey = (objs: any[], key: string) => {
  return objs.reduce((acc, obj) => acc.isGreaterThan((obj[key] || bnZero)) ? acc : (obj[key] || bnZero), bnZero)
}
