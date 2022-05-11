<template>
	<el-breadcrumb :separator="breadcrumb.separator" :separator-icon="breadcrumb.separator_icon">
		<el-breadcrumb-item v-for="(it, index) in breadcrumb.list" :key="index" :to="it.to">{{
			it.name
		}}</el-breadcrumb-item>
	</el-breadcrumb>
</template>
<script setup lang="ts">
import { useMainStateStore } from '@/store/modules/main-state'
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()

const breadcrumb = useMainStateStore().breadcrumb
</script>
