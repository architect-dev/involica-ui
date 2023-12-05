import { getSymbol } from '@config/tokens'
import React, { memo } from 'react'
import { TokenSymbolImage } from '@uikit'

const TokenIconAndSymbol: React.FC<{ token: string }> = ({ token }) => {
	return (
		<>
			<TokenSymbolImage symbol={getSymbol(token)} width={24} height={24} />
			{getSymbol(token)}
		</>
	)
}

export default memo(TokenIconAndSymbol)
