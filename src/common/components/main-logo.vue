<template>
	<div class="flex h-full w-full items-center justify-center" :style="{ height }">
		<transition name="el-zoom-in-center">
			<div v-if="!isCollapsed">{{ app_store.name }}</div>
			<div v-else>{{ app_store.sort_name }}</div>
		</transition>
	</div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

const props = defineProps({
	height: {
		type: String,
		default: '56px',
	},
	isCollapsed: {
		type: Boolean,
		default: false,
	},
})
const app_store = useAppStore()
</script>
