<template>
	<div class="vi-login flex min-h-screen items-start justify-center bg-gray-100">
		<div
			class="login-form mx-4 w-full rounded-lg bg-white py-6 shadow-lg sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12"
			style="margin-top: 20vh"
		>
			<div class="logo-box flex-box mx-2 justify-center">
				<div class="mt-2 mb-8 text-center">{{ app_store.name }}</div>
			</div>
			<div class="form-box px-10">
				<el-form
					ref="formRef"
					:model="login_form.formdata"
					:rules="login_form.rules"
					size="large"
					@keydown.enter="onClickLogin"
				>
					<el-form-item prop="account">
						<el-input
							v-model="login_form.formdata.account"
							:prefix-icon="IconUser"
							placeholder="请输入账号"
						/>
					</el-form-item>
					<el-form-item prop="pswd">
						<el-input
							v-model="login_form.formdata.pswd"
							:type="login_form.is_hover_pswd ? 'text' : 'password'"
							:prefix-icon="IconLock"
							placeholder="请输入密码"
						>
							<template #suffix>
								<el-icon
									class="cursor-pointer"
									style="height: 100%"
									@mouseenter="login_form.is_hover_pswd = true"
									@mouseleave="login_form.is_hover_pswd = false"
								>
									<IconView />
								</el-icon>
							</template>
						</el-input>
					</el-form-item>
					<el-form-item class="mt-4">
						<el-button class="w-full" block type="primary" @click="onClickLogin">登陆</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { User as IconUser, Lock as IconLock, View as IconView } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { login } from '@/api/admin'
import { setToken } from '@/libs/local-store'
import { useAppStore } from '@/store/modules/app'

const router = useRouter()

const user_store = useUserStore()
const app_store = useAppStore()

const formRef = ref<InstanceType<typeof ElForm>>()

const login_form = reactive({
	formdata: {
		account: 'admin',
		pswd: '123456',
	},
	is_hover_pswd: false,
	rules: {
		account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
		pswd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
	},
})

const onClickLogin = () => {
	formRef.value
		?.validate()
		?.then(() => {
			// 请求API 验证账号密码
			login(login_form.formdata)
				.then((res) => {
					setToken(res.data)
					return user_store.updateInfo().then((info) => {
						ElMessage.success('登陆成功')
						router.push({ name: 'control_dashboard' })
					})
				})
				.catch((e) => ElMessage.error(e.message))
		})
		.catch((err) => {
			// 表单验证失败
		})
}
</script>
