<template>
	<div class="vi-dashboard bg-gray-100 p-4">
		<el-row :gutter="10" class="mb-2">
			<el-col v-for="it in 4" :key="it" :xs="24" :sm="12" :md="12" :lg="6">
				<el-card class="mb-2" shadow="never" style="border-style: none">
					<template #header>
						<div class="flex items-center justify-between">
							<div>访问量</div>
							<el-tag>日</el-tag>
						</div>
					</template>
					<div>
						<div class="mb-2 text-2xl">25,846</div>
						<div class="flex items-center space-x-1 text-sm text-gray-600">
							<div>日同比 12.5%</div>
							<IconFont color="green" :size="12" eicon="CaretTop" />
						</div>
					</div>
					<el-divider style="margin: 10px 0" />
					<div class="flex items-center justify-between text-sm text-gray-600">
						<div>总访问量</div>
						<div>280万+</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="10">
			<el-col v-for="it in 8" :key="it" :xs="12" :sm="6" :md="6" :lg="3">
				<el-card shadow="hover" style="border-style: none">
					<div class="flex flex-col items-center">
						<IconFont eicon="Avatar" color="rgb(105, 192, 255)" />
						<div>用户</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import IconFont from '@/components/icon-font'
import { CaretBottom as IconCaretBottom } from '@element-plus/icons-vue'
</script>
<style scoped lang="less">
.vi-dashboard {
}
</style>
