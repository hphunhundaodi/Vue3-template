<template>
	<el-container class="vi-main">
		<el-aside
			class="sider-box"
			:width="`${sider_real_width}px`"
			:style="{ backgroundColor: sider.color, color: sider.text_color, transition: 'width 0.2s' }"
		>
			<MainLogo
				:height="layoutStyle.navbar_height"
				:is-collapsed="layout.is_mini_mode ? true : sider.is_collapse"
			/>
			<div
				class="scroll-bar scroll-bar-white overflow-y-auto"
				:style="{ height: `${app_store.screen.height - layout.navbar_height}px` }"
			>
				<MainMenu :mini-mode="layout.is_mini_mode" :is-collapse="sider.is_collapse" />
			</div>
		</el-aside>
		<el-container
			class="right-content-box"
			:style="{ marginLeft: `${sider_real_width}px`, transition: 'margin-left 0.2s' }"
		>
			<el-header
				class="header-box sticky z-50 flex h-full items-center bg-white shadow"
				:style="{ height: layoutStyle.navbar_height, top: 0, padding: 0 }"
			>
				<div class="header-item flex h-full w-full justify-between">
					<div class="left flex items-center">
						<div class="icon-item" @click="sider.is_collapse = !sider.is_collapse">
							<el-icon class="transform transition-all" :class="{ 'rotate-180': sider.is_collapse }">
								<IconFold />
							</el-icon>
						</div>
						<div class="icon-item" @click="navbar.refresh.refreshRouterView">
							<el-icon :class="{ 'animate-spin': navbar.refresh.show_icon_animate }">
								<IconRefreshRight />
							</el-icon>
						</div>
						<Breadcrumb class="ml-2" v-if="!layout.is_mini_mode" />
					</div>
					<div class="right flex items-center">
						<div class="icon-item" @click="navbar.fullscreen.toggle()">
							<el-icon>
								<IconClose v-if="navbar.fullscreen.isFullscreen" />
								<IconFullScreen v-else />
							</el-icon>
						</div>
						<MainNavUser class="icon-item" />
					</div>
				</div>
			</el-header>
			<el-main style="padding: 0" class="main-router-view">
				<router-view v-if="navbar.refresh.show_router_view"></router-view>
			</el-main>
			<el-footer class="main-footer" :height="layoutStyle.footer_height">
				<MainFooter />
			</el-footer>
		</el-container>
	</el-container>
</template>
<script setup lang="ts">
import { computed, nextTick, reactive, watch } from 'vue'
import {
	Fold as IconFold,
	RefreshRight as IconRefreshRight,
	FullScreen as IconFullScreen,
	Close as IconClose,
} from '@element-plus/icons-vue'
import { useWindowSize, useFullscreen } from '@vueuse/core'
import MainMenu from '../components/main-menu.vue'
import Breadcrumb from '@/common/components/breadcrumb.vue'
import MainLogo from '../components/main-logo.vue'
import MainFooter from '../components/main-footer.vue'
import MainNavUser from '../components/main-nav-user.vue'

import { useAppStore } from '@/store/modules/app'

const app_store = useAppStore()

// 布局
const layout = reactive({
	/** 顶部条高度 */
	navbar_height: 56,
	/** 侧边导航宽度 */
	sider_width: 254,
	/** 侧边导航折叠后宽度 */
	sider_collapsed_width: 64,
	/** 底部footer高度 */
	footer_height: 50,
	/** 是否处于小屏模式 */
	is_mini_mode: computed(() => app_store.screen.width <= 650),
})
const layoutStyle = computed(() => ({
	/** 顶部条高度 */
	navbar_height: `${layout.navbar_height}px`,
	/** 侧边导航宽度 */
	sider_width: `${layout.sider_width}px`,
	/** 底部footer高度 */
	footer_height: `${layout.footer_height}px`,
	/** 侧边导航折叠后宽度 */
	sider_collapsed_width: `${layout.sider_collapsed_width}px`,
}))

/** 侧边导航栏 */
const sider = reactive({
	/** 背景色 */
	color: '#191A23',
	/** 文字颜色 */
	text_color: '#fff',
	/** 是否处于折叠状态 */
	is_collapse: false,
})

/** 侧边导航当前宽度 */
const sider_real_width = computed(() => {
	if (layout.is_mini_mode) {
		return sider.is_collapse ? 0 : layout.sider_collapsed_width
	} else {
		return sider.is_collapse ? layout.sider_collapsed_width : layout.sider_width
	}
})

/** 顶部工具栏 */
const navbar = reactive({
	/** 刷新功能 */
	refresh: {
		/** 刷新router-view */
		show_router_view: true,
		show_icon_animate: false,
		refreshRouterView: () => {
			navbar.refresh.show_router_view = false
			navbar.refresh.show_icon_animate = true
			nextTick(() => (navbar.refresh.show_router_view = true))
			setTimeout(() => {
				navbar.refresh.show_icon_animate = false
			}, 1000)
		},
	},
	/** 全屏功能 */
	fullscreen: useFullscreen(),
})
</script>
<style scoped lang="less">
.vi-main {
	.sider-box {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		.el-menu {
			// 去掉自带的边线
			border-right: 0;
		}
	}
	.header-box {
		.icon-item {
			@apply flex h-full cursor-pointer items-center px-4 hover:bg-gray-200;
		}
	}
	.main-router-view {
		min-height: calc(100vh - v-bind('layoutStyle.navbar_height') - v-bind('layoutStyle.footer_height'));
	}
}
</style>
