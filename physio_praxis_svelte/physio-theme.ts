import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const physioTheme: CustomThemeConfig = {
    name: 'physio-theme',
    properties: {
		// == Theme Properties ==
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// == Theme On-X Colors ==
		"--on-primary": "0 0 0",
		"--on-secondary": "0 0 0",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "0 0 0",
		// == Theme Colors  ==
		// primary | #627dd0 
		"--color-primary-50": "231 236 248", // #e7ecf8
		"--color-primary-100": "224 229 246", // #e0e5f6
		"--color-primary-200": "216 223 243", // #d8dff3
		"--color-primary-300": "192 203 236", // #c0cbec
		"--color-primary-400": "145 164 222", // #91a4de
		"--color-primary-500": "98 125 208", // #627dd0
		"--color-primary-600": "88 113 187", // #5871bb
		"--color-primary-700": "74 94 156", // #4a5e9c
		"--color-primary-800": "59 75 125", // #3b4b7d
		"--color-primary-900": "48 61 102", // #303d66
		// secondary | #2e82c2 
		"--color-secondary-50": "224 236 246", // #e0ecf6
		"--color-secondary-100": "213 230 243", // #d5e6f3
		"--color-secondary-200": "203 224 240", // #cbe0f0
		"--color-secondary-300": "171 205 231", // #abcde7
		"--color-secondary-400": "109 168 212", // #6da8d4
		"--color-secondary-500": "46 130 194", // #2e82c2
		"--color-secondary-600": "41 117 175", // #2975af
		"--color-secondary-700": "35 98 146", // #236292
		"--color-secondary-800": "28 78 116", // #1c4e74
		"--color-secondary-900": "23 64 95", // #17405f
		// tertiary | #3ca9d7 
		"--color-tertiary-50": "226 242 249", // #e2f2f9
		"--color-tertiary-100": "216 238 247", // #d8eef7
		"--color-tertiary-200": "206 234 245", // #ceeaf5
		"--color-tertiary-300": "177 221 239", // #b1ddef
		"--color-tertiary-400": "119 195 227", // #77c3e3
		"--color-tertiary-500": "60 169 215", // #3ca9d7
		"--color-tertiary-600": "54 152 194", // #3698c2
		"--color-tertiary-700": "45 127 161", // #2d7fa1
		"--color-tertiary-800": "36 101 129", // #246581
		"--color-tertiary-900": "29 83 105", // #1d5369
		// success | #32c34a 
		"--color-success-50": "224 246 228", // #e0f6e4
		"--color-success-100": "214 243 219", // #d6f3db
		"--color-success-200": "204 240 210", // #ccf0d2
		"--color-success-300": "173 231 183", // #ade7b7
		"--color-success-400": "112 213 128", // #70d580
		"--color-success-500": "50 195 74", // #32c34a
		"--color-success-600": "45 176 67", // #2db043
		"--color-success-700": "38 146 56", // #269238
		"--color-success-800": "30 117 44", // #1e752c
		"--color-success-900": "25 96 36", // #196024
		// warning | #f3e315 
		"--color-warning-50": "253 251 220", // #fdfbdc
		"--color-warning-100": "253 249 208", // #fdf9d0
		"--color-warning-200": "252 248 197", // #fcf8c5
		"--color-warning-300": "250 244 161", // #faf4a1
		"--color-warning-400": "247 235 91", // #f7eb5b
		"--color-warning-500": "243 227 21", // #f3e315
		"--color-warning-600": "219 204 19", // #dbcc13
		"--color-warning-700": "182 170 16", // #b6aa10
		"--color-warning-800": "146 136 13", // #92880d
		"--color-warning-900": "119 111 10", // #776f0a
		// error | #cc3333 
		"--color-error-50": "247 224 224", // #f7e0e0
		"--color-error-100": "245 214 214", // #f5d6d6
		"--color-error-200": "242 204 204", // #f2cccc
		"--color-error-300": "235 173 173", // #ebadad
		"--color-error-400": "219 112 112", // #db7070
		"--color-error-500": "204 51 51", // #cc3333
		"--color-error-600": "184 46 46", // #b82e2e
		"--color-error-700": "153 38 38", // #992626
		"--color-error-800": "122 31 31", // #7a1f1f
		"--color-error-900": "100 25 25", // #641919
		// surface | #73add9 
		"--color-surface-50": "234 243 249", // #eaf3f9
		"--color-surface-100": "227 239 247", // #e3eff7
		"--color-surface-200": "220 235 246", // #dcebf6
		"--color-surface-300": "199 222 240", // #c7def0
		"--color-surface-400": "157 198 228", // #9dc6e4
		"--color-surface-500": "115 173 217", // #73add9
		"--color-surface-600": "104 156 195", // #689cc3
		"--color-surface-700": "86 130 163", // #5682a3
		"--color-surface-800": "69 104 130", // #456882
		"--color-surface-900": "56 85 106", // #38556a
	}
}