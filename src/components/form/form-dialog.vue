<template>
	<el-dialog v-bind="attrs" v-model="my_visible" :title="title" :width="width">
		<slot></slot>
		<template #footer>
			<slot name="footer">
				<div class="flex-box justify-end space-x-2">
					<el-button @click="my_visible = false">取 消</el-button>
					<el-button type="primary" :loading="submit_loading" @click="onEditFormSubmit">保 存</el-button>
				</div>
			</slot>
		</template>
	</el-dialog>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { ref, reactive, computed, useAttrs, watch, PropType } from 'vue'
import { cloneDeep, assign } from 'lodash'

const props = defineProps({
	/** 模型名，会自动拼接到title上 */
	name: String,
	formdata: {
		type: Object,
		default: () => ({}),
	},
	visible: {
		type: Boolean,
		default: false,
	},
	/** 点击提交时触发 */
	onClickSubmit: {
		type: Function as PropType<(formdata: typeof props.formdata) => Promise<any>>,
	},
})
const attrs = useAttrs()

const emit = defineEmits({
	/** 更新formdata */
	'update:formdata': null,
	/** 更新可见状态 */
	'update:visible': null,
})

const screen = useAppStore().screen

const title = computed(
	() => (attrs.title as string | undefined) ?? `${props.formdata?.id ? '编辑' : '新增'}${props.name}`
)
const width = computed(() => {
	if (attrs.width) return attrs.width as string | undefined
	if (screen.width >= 1200) return '40%'
	if (screen.width >= 800) return '55%'
	else if (screen.width >= 600) return '70%'
	else return '95%'
})

const my_visible = ref(props.visible)
const submit_loading = ref(false)
const init_formdata = reactive(props.formdata)
const open = (row?, onoff = true) => {
	emit('update:formdata', row ? cloneDeep(assign({}, props.formdata, cloneDeep(row))) : cloneDeep(init_formdata))
	my_visible.value = onoff
}
const onEditFormSubmit = () => {
	if (props.onClickSubmit) {
		submit_loading.value = true
		props
			.onClickSubmit(cloneDeep(props.formdata))
			.then(() => open(undefined, false))
			.catch(() => {})
			.finally(() => (submit_loading.value = false))
	}
}

watch(
	() => my_visible.value,
	(val) => emit('update:visible', val)
)
watch(
	() => props.visible,
	(val) => {
		if (val != my_visible.value) my_visible.value = val
	}
)

defineExpose({ open })
</script>
