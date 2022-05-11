<template>
	<div class="vi-empty py-20 text-center">
		<el-result :icon="icon" :title="title" :sub-title="description">
			<template #extra>
				<el-button type="primary" @click="onClickBtn">返回首页</el-button>
			</template>
		</el-result>
	</div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = withDefaults(
	defineProps<{
		title: string
		description?: string
		icon?: 'success' | 'error' | 'info' | 'warning'
		onClickBack?: Function
	}>(),
	{
		icon: 'error',
		title: '页面找不到啦',
		description: '',
		onClickBack: undefined,
	}
)

const router = useRouter()

const onClickBtn = () => {
	if (props.onClickBack) props.onClickBack()
	else router.go(-1)
}
</script>
