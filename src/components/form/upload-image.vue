<template>
	<el-upload
		class="cp-upload-image"
		:action="getUploadImageUrl()"
		name="file"
		:accept="accept"
		:data="{ TOKEN: getToken() }"
		:show-file-list="false"
		:file-list="file_list"
		:on-change="onChange"
		:on-success="onSuccess"
		:on-progress="onProgress"
		:on-error="onError"
	>
		<div class="flex-box flex-wrap">
			<slot name="file-list">
				<div
					class="image-item"
					v-for="(it, index) in file_list"
					:key="index"
					:style="{
						...imageStyle,
						width: typeof imageStyle.width == 'string' ? imageStyle.width : `${imageStyle.width}px`,
						height: typeof imageStyle.height == 'string' ? imageStyle.height : `${imageStyle.height}px`,
					}"
				>
					<img class="h-full w-full" v-if="it.url" :src="it.url" :style="{ objectFit: props.objectFit }" />

					<div
						class="image-action"
						v-if="it.status != 'uploading'"
						:style="{ fontSize: iconSize }"
						@click.stop
					>
						<IconFont
							v-if="file_list.length != 1"
							eicon="ArrowLeft"
							@click.stop="onClickMove(-1, it, index)"
						/>
						<div class="flex h-full w-full flex-col items-center justify-between">
							<IconFont eicon="View" @click.stop="onClickPreview(it, index)" />
							<IconFont eicon="Delete" @click.stop="onClickDel(it, index)" />
						</div>
						<IconFont
							v-if="file_list.length != 1"
							eicon="ArrowRight"
							@click.stop="onClickMove(1, it, index)"
						/>
					</div>

					<div class="image-state" v-if="it.status == 'uploading'">
						<el-progress
							type="circle"
							:percentage="it.percentage"
							:width="progress_width"
							:show-text="false"
						></el-progress>
					</div>
				</div>
			</slot>
			<slot>
				<div
					class="upload-btn image-item"
					v-if="show_upload"
					:style="{
						...imageStyle,
						width: typeof imageStyle.width == 'string' ? imageStyle.width : `${imageStyle.width}px`,
						height: typeof imageStyle.height == 'string' ? imageStyle.height : `${imageStyle.height}px`,
					}"
				>
					<IconFont eicon="Picture" />
				</div>
			</slot>
		</div>
		<slot name="tip"></slot>

		<ElImageViewer
			v-if="preview.show"
			:url-list="preview.file_list"
			:initial-index="preview.index"
			:zIndex="3000"
			@close="preview.show = false"
			@click.stop
		/>
	</el-upload>
</template>
<script setup lang="ts">
import { ref, reactive, nextTick, PropType, computed, watch } from 'vue'
import { cloneDeep, findIndex } from 'lodash'
import { getUploadImageUrl } from '@/api/other'
import { getToken } from '@/libs/local-store'
import type { UploadFile, ElUploadProgressEvent, ElFile } from 'element-plus/es/components/upload/src/upload.type'
import { ElMessage, ElImageViewer } from 'element-plus'
import { uniqueId } from 'lodash'
import IconFont from '../icon-font'

const props = defineProps({
	/**
	 * 图片值
	 * 当count是1时是图片的url，否则是图片url的数组，为空是是空字符串或空数组
	 * 注意: 在count != 1的模式下
	 * 本组件只在created时才会根据value设置file_list数组，其余时候不会主动监听value的变化
	 * 如需从外部修改value引起file_list变化，应调用setValue()方法
	 */
	modelValue: {
		type: [String, Object] as PropType<string | string[]>,
		default: '',
	},
	/** 图片数量，0不限 */
	count: {
		type: Number,
		default: 0,
	},
	accept: {
		type: String,
		default: 'image/*',
	},
	/** 图片和上传框的样式，通常只设置尺寸 */
	imageStyle: {
		type: Object,
		default() {
			return {
				width: 120,
				height: 120,
			}
		},
	},
	/** 图片的object-fit */
	objectFit: {
		type: String,
		default: 'cover',
	},
	/** 操作图标的尺寸 */
	iconSize: {
		type: String,
		default: '24px',
	},
})

const emit = defineEmits(['update:modelValue'])

const file_list = ref<UploadFile[]>([])

const preview = reactive({
	show: false,
	index: 0,
	file_list: computed(() => file_list.value.filter((it) => it.url).map((it) => (it as UploadFile).url ?? '')),
})

const progress_width = computed(() => Math.min(props.imageStyle.width, props.imageStyle.height) * 0.9)
const show_upload = computed(() => {
	if (props.count == 0) return true
	return file_list.value.filter((it) => it.status != 'fail').length < props.count
})

const setValue = () => {
	if (props.count == 1) {
		if (file_list.value[0]?.url != props.modelValue)
			file_list.value = props.modelValue
				? [
						{
							uid: parseInt(uniqueId()),
							size: 0,
							raw: null as any,
							name: '',
							status: 'success',
							url: props.modelValue as string,
						},
				  ]
				: []
	} else {
		file_list.value = (props.modelValue as string[]).map((url) => ({
			uid: parseInt(uniqueId()),
			size: 0,
			raw: null as any,
			name: '',
			status: 'success',
			url,
		}))
	}
}
watch(
	() => props.modelValue,
	(val) => setValue(),
	{ deep: true, immediate: true }
)

const onChange = (file, list) => {
	file_list.value = list
}
const emitInput = () => {
	if (props.count == 1) {
		let find = file_list.value.find((it) => it.status == 'success')
		emit('update:modelValue', find?.url ?? '')
	} else {
		emit(
			'update:modelValue',
			file_list.value.filter((it) => it.status == 'success').map((it) => it.url)
		)
	}
}
const onClickDel = (file, index) => {
	file_list.value.splice(index, 1)
	emitInput()
}
const onSuccess = (response, file) => {
	if (response.code != 0) {
		const index = file_list.value.findIndex((it) => (it as any).uid == file.uid)
		ElMessage.error(response?.msg ?? '图片上传错误，请重试')
		nextTick(() => {
			onClickDel({}, index)
		})
	}

	file.url = response.data.url
	let findIndex = file_list.value.findIndex((i) => i.uid == file.uid)
	if (file_list.value[findIndex]) file_list.value[findIndex] = file
	emitInput() //不应该在onchange中进行emitInput 应该在onsuccess函数中进行emit
}

const onProgress = (event, file) => {
	let findIndex = file_list.value.findIndex((i) => i.uid == file.uid)
	if (file_list.value[findIndex]) file_list.value[findIndex] = file
}

const onError = (response) => {
	ElMessage.error(response?.msg ?? '图片上传错误，请重试')
}
const onClickMove = (step, file, index) => {
	let next = cloneDeep(file_list.value[index + step])
	if (!next) return

	file_list.value[index + step] = file
	file_list.value[index] = next
	emitInput()
}

const onClickPreview = (file, index) => {
	preview.index = index
	preview.show = true
}
</script>
<style scoped lang="less">
.cp-upload-image {
	.image-item {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 4px;
		border-radius: 8px;
		overflow: hidden;
		&:hover {
			.image-action {
				display: flex;
				color: #fff;
			}
		}
	}
	.image-action {
		position: absolute;
		padding: 8px;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		justify-content: space-between;
		align-items: center;
		color: #fff;
		display: none;
		.icon:hover {
			transform: scale(1.2);
		}
	}
	.image-state {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.upload-btn {
		border: 1px dashed #9f9f9f;
		border-radius: 8px;
		font-size: 30px;
		&:hover {
			border-color: #66b1ff;
			color: #66b1ff;
		}
	}
}
</style>
