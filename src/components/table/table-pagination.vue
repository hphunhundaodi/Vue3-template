<template>
	<el-pagination
		class="cp-table-pagination mt-4 flex flex-wrap justify-end"
		:total="props.state.total"
		v-model:current-page="query.index"
		v-model:page-size="query.limit"
		:small="is_mobile"
		:layout="!is_mobile ? 'total,sizes,prev,pager,next,jumper' : 'total,prev,pager,next,jumper'"
		:page-sizes="pageSize"
		@current-change="emit('current-change', $event)"
		@size-change="emit('size-change', $event)"
	/>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { PropType } from 'vue'

const props = defineProps({
	query: {
		type: Object as PropType<
			{
				/** 页码 */
				index: number
				/** 每页条数 */
				limit: number
			} & Object
		>,
		required: true,
	},
	state: {
		type: Object as PropType<{
			total: number
		}>,
		required: true,
	},
	pageSize: {
		type: Array as PropType<number[]>,
		default: () => [10, 20, 30, 50],
	},
})

const emit = defineEmits({
	'current-change': null,
	'size-change': null,
})

const is_mobile = useAppStore().is_mobile
</script>
