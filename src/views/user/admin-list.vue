<template>
	<div class="p-4">
		<el-page-header class="px-2 pt-2 pb-4" content="管理员列表" @back="router.go(-1)" />
		<TableHead></TableHead>
	</div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { TableHead } from '@/components/table'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
