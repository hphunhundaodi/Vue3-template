<template>
	<el-menu
		:collapse="props.miniMode ? true : props.isCollapse"
		:background-color="props.backgroundColor"
		:text-color="props.textColor"
		:collapse-transition="false"
		:default-active="default_active_index"
		@select="onMenuSelect"
	>
		<template v-for="(it, index) in menu_list" :key="index">
			<el-sub-menu v-if="it?.children?.length > 0" :index="`${index}`">
				<template #title>
					<div v-if="it.icon" class="mr-2 flex h-full items-center">
						<component class="flex-strink-0 flex-shrink-0" :is="it.icon" />
					</div>
					<span>{{ it.name }}</span>
				</template>
				<el-menu-item
					v-for="(sub_it, sub_index) in it.children"
					:key="sub_index"
					:index="`${index}-${sub_index}`"
				>
					<div v-if="sub_it.icon" class="mr-2 flex h-full items-center">
						<component class="flex-strink-0 flex-shrink-0" :is="sub_it.icon" />
					</div>
					<template #title>{{ sub_it.name }}</template>
				</el-menu-item>
			</el-sub-menu>
			<el-menu-item v-else :index="`${index}`">
				<div v-if="it.icon" class="mr-2 flex h-full items-center">
					<component class="flex-strink-0 flex-shrink-0" :is="it.icon" />
				</div>
				<template #title>{{ it.name }}</template>
			</el-menu-item>
		</template>
	</el-menu>
</template>
<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStateStore } from '@/store/modules/main-state'
import { Fold as IconFold } from '@element-plus/icons-vue'

const props = defineProps({
	miniMode: {
		type: Boolean,
		default: false,
	},
	isCollapse: {
		type: Boolean,
		default: false,
	},
	backgroundColor: {
		type: String,
		default: '#191A23',
	},
	textColor: {
		type: String,
		default: '#fff',
	},
})

const menu_list = useMainStateStore().main_menu_list

const router = useRouter()
const route = useRoute()

/** 递归展开后的menu列表 */
const spread_menu_list = computed(() => {
	let reslist = [] as any[]
	menu_list.forEach((menu, index) => {
		if (Array.isArray(menu.children)) {
			menu.children.forEach((sub_menu, sub_index) => {
				reslist.push({
					...sub_menu,
					_index: `${index}-${sub_index}`,
					_deep: 0,
				})
			})
		} else {
			reslist.push({
				...menu,
				_index: `${index}`,
				_deep: 1,
			})
		}
	})
	return reslist
})

const default_active_index = computed(() => {
	if (!route) return null
	for (let menu of spread_menu_list.value) {
		if (menu.route) {
			let resolve = router.resolve(typeof menu.route == 'string' ? { name: menu.route } : menu.route)
			if (resolve && resolve.path == route.path) {
				return menu._index
			}
		}
	}
})

const onMenuSelect = (index, indexPath) => {
	let menu = spread_menu_list.value.find((i) => i._index == index)
	if (menu && menu.route) {
		router.push(typeof menu.route == 'string' ? { name: menu.route } : menu.route)
	}
}
</script>
