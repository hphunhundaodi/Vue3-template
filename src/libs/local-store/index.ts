export const TOKEN_KEY = `${import.meta.env.VITE_STORAGE_PREFIX}user-token_`

/**
 * 设置用户Token
 * @param token token值
 */
export const setToken = (token?: string | null | number) => {
	window?.localStorage.setItem(
		TOKEN_KEY,
		JSON.stringify({
			value: token?.toString() ?? '',
			create_time: new Date().valueOf(),
		})
	)
}

/**
 * 获取用户Token
 * @param drop 是否获取后移除
 * @returns
 */
export const getToken = (drop = false): string => {
	try {
		let data = JSON.parse(window?.localStorage.getItem(TOKEN_KEY) ?? '')
		const { value, create_time } = data
		if (drop) window?.localStorage.removeItem(TOKEN_KEY)
		return value
	} catch (e) {
		return ''
	}
}
