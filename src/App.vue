<template>
	<el-config-provider :locale="elLocaleZhCN">
		<router-view></router-view>
	</el-config-provider>
</template>

<script setup lang="ts">
import elLocaleZhCN from 'element-plus/dist/locale/zh-cn'
</script>

<style>
/* 全局样式 */
@import url('@/css/common.less');
</style>
