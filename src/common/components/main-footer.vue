<template>
	<div class="flex h-full items-center justify-center text-xs text-gray-600">
		Copyright 2022 - 2026 {{ app_store.sort_name }}. All Rights Reserved
	</div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

const app_store = useAppStore()
</script>
