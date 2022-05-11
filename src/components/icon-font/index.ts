import { ElIcon } from 'element-plus'
import { isNumber } from 'lodash'
import { defineComponent, h, defineProps, PropType, VNode, computed, DefineComponent, Prop } from 'vue'
import * as ElIconVue from '@element-plus/icons-vue'

/** 引入iconfont的js文件和样式 */
;(() => {
	const script = document?.createElement('script')
	script.src = import.meta.env.VITE_ICONFONT_URL
	document?.body.append(script)

	const style = document?.createElement('style')
	style.innerHTML = `.icon-font {width: 1em;height: 1em;vertical-align: -0.15em;fill: currentColor;overflow: hidden;}`
	document?.head.append(style)
})()

/**
 * @component icon-font
 * @description 可同时使用 iconfont.cn 的图标和 @element-plus/icons-vue 图标
 */

export default defineComponent({
	props: {
		prefix: {
			type: String,
			default: 'icon-font',
		},
		icon: {
			type: String,
		},
		/** element-icon 只需传入名称即可 */
		eicon: {
			type: String,
		},
		size: {
			type: [String, Number],
			default: 24,
		},
		color: {
			type: String,
		},
	},
	computed: {
		realSize() {
			return isNumber(this.size) ? `${this.size}px` : this.size
		},
	},
	render() {
		if (this.icon) {
			return h('svg', { class: [this.prefix], 'aria-hidden': true, style: { fontSize: this.realSize } }, [
				h('use', { 'xlink:href': `#${this.icon}` }),
			])
		} else if (this.eicon) {
			if (!ElIconVue[this.eicon]) throw new Error(`el-icon ${this.eicon} is not found!`)
			return h(ElIcon, { size: this.size, color: this.color }, () => ElIconVue[this.eicon as string].render())
		} else if (this.$slots.default) {
			return this.$slots.default
		}
	},
})
