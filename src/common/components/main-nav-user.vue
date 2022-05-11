<template>
	<el-dropdown @command="onDorpDownCommand">
		<div class="flex items-center">
			<div class="flex items-center">
				<el-avatar class="mr-2" :size="30">
					<el-icon class="flex items-center justify-center" :size="18">
						<IconUser />
					</el-icon>
				</el-avatar>
				<div>{{ user_store.info?.name }}</div>
			</div>
			<el-icon class="el-icon--right">
				<IconArrowDown />
			</el-icon>
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item command="user-center">个人中心</el-dropdown-item>
				<el-dropdown-item command="logout">退出登陆</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ArrowDown as IconArrowDown, User as IconUser } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const user_store = useUserStore()
const router = useRouter()

const onDorpDownCommand = (cmd) => {
	switch (cmd) {
		case 'user-info':
			break
		case 'logout':
			user_store.logout().then(() => {
				ElMessage.success('退出登陆成功')
				router.replace({ name: 'login' })
			})
			break
	}
}
</script>
