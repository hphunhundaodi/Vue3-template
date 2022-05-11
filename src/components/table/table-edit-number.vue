<template>
	<div>
		<div v-if="!mydata.is_edit_mode" class="flex items-center space-x-2">
			<slot :value="modelValue">
				<div class="min-w-max">{{ mydata.my_value }}</div>
			</slot>
			<el-button type="default" :size="props.size" :icon="IconEdit" @click="setEditMode"></el-button>
		</div>
		<div v-else class="flex items-center" ref="editDivRef">
			<el-input-number
				ref="inputNumberRef"
				:size="props.size"
				v-model="(mydata.my_value as number)"
				:min="props.min"
				:max="props.max"
				:disabled="mydata.is_loading"
				@keyup.native.esc="onEditBlur"
				@keyup.native.enter="onClickSubmit"
			/>
			<el-button-group class="ml-2" :size="props.size">
				<el-button type="primary" :icon="IconCheck" :loading="mydata.is_loading" @click.stop="onClickSubmit" />
				<el-button :icon="IconClose" @click="onEditBlur" />
			</el-button-group>
		</div>
	</div>
</template>
<script setup lang="ts">
/**
 * 配合 el-table 列插槽实现单个字段可编辑
 * 目前只支持数字
 */
import { ref, reactive, watch, PropType, nextTick } from 'vue'
import { Edit as IconEdit, Check as IconCheck, Close as IconClose } from '@element-plus/icons-vue'
import { onClickOutside } from '@vueuse/core'
import { setModelField } from '@/api/other'

type ValueType = number | string | null | undefined

const props = defineProps({
	modelValue: [Number, String] as PropType<ValueType>,
	size: {
		type: String as PropType<'small' | 'default' | 'large'>,
		default: 'default',
	},
	min: Number,
	max: Number,
	modelName: String,
	modelId: [String, Number],
	fieldName: String,
	submitMethod: {
		type: Function as PropType<(val: ValueType) => Promise<any>>,
	},
})

const editDivRef = ref()
const inputNumberRef = ref()

const emit = defineEmits(['update:modelValue', 'change'])

const mydata = reactive({
	my_value: null as ValueType,
	is_edit_mode: false,
	is_loading: false,
})

watch(
	() => props.modelValue,
	(val) => (mydata.my_value = val),
	{ immediate: true, deep: true }
)

const setEditMode = () => {
	mydata.is_edit_mode = true
	nextTick(() => inputNumberRef.value?.focus())
}

const onEditBlur = () => {
	mydata.my_value = props.modelValue
	mydata.is_edit_mode = false
}
onClickOutside(editDivRef, onEditBlur)

const onClickSubmit = () => {
	if (mydata.my_value == props.modelValue) {
		mydata.is_edit_mode = false
		return
	}
	if (props.submitMethod) {
		mydata.is_loading = true
		props
			.submitMethod(mydata.my_value)
			.then((newval: ValueType) => {
				mydata.my_value = newval
			})
			.catch((e) => {})
			.finally(() => {
				mydata.is_loading = false
			})
	} else {
		mydata.is_loading = true
		setModelField({
			model: props.modelName ?? '',
			field: props.fieldName ?? '',
			id: props.modelId ?? '',
			value: mydata.my_value,
		})
			.then((res) => {
				mydata.my_value = res.data
				mydata.is_edit_mode = false
				emit('update:modelValue', res.data)
				emit('change', res.data)
			})
			.finally(() => (mydata.is_loading = false))
	}
}
</script>
