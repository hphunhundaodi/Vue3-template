<template>
	<div>
		<div v-if="!isEditMode" class="flex items-center space-x-2">
			<slot></slot>
			<el-button type="default" :size="props.size" :icon="IconEdit" @click="openEditMode"></el-button>
		</div>
		<div
			v-else
			class="flex items-center"
			ref="editDivRef"
			@keyup.native.enter="onClickSubmit"
			@keyup.native.esc="closeEditMode"
		>
			<slot name="input" :loading="isLoading"></slot>
			<el-button-group class="ml-2" :size="props.size">
				<el-button type="primary" :icon="IconCheck" :loading="isLoading" @click.stop="onClickSubmit" />
				<el-button :icon="IconClose" @click="closeEditMode" />
			</el-button-group>
		</div>
	</div>
</template>
<script setup lang="ts">
/**
 * 配合 el-table 列插槽实现单个字段可编辑
 * 通过插槽自己实现显示和输入框
 */
import { ref, reactive, watch, PropType, nextTick } from 'vue'
import { Edit as IconEdit, Check as IconCheck, Close as IconClose } from '@element-plus/icons-vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
	size: {
		type: String as PropType<'small' | 'default' | 'large'>,
		default: 'default',
	},
	/** 设置一个提交事件，返回Promise，then时自动触发emit change，finally时自动关闭loading */
	submitMethod: {
		type: Function as PropType<() => Promise<any>>,
		required: true,
	},
})

const isEditMode = ref(false)
const isLoading = ref(false)

const editDivRef = ref()

const emit = defineEmits(['change'])

onClickOutside(editDivRef, () => closeEditMode())

const openEditMode = () => {
	isEditMode.value = true
}
const closeEditMode = () => {
	isEditMode.value = false
}
const onClickSubmit = () => {
	isLoading.value = true
	props
		.submitMethod()
		.then(() => {
			emit('change')
			closeEditMode()
		})
		.finally(() => (isLoading.value = false))
}
</script>
