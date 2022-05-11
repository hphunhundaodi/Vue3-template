# Vue3 项目启动模板

这是一个Vue3的综合项目启动模板，包含多个版本，适配PC、移动端、后台等不同应用场景
本仓库通过多个分支来维护不同的版本，不同版本之间有不同的特性，详见特性和版本差异表

### 特性

- 基础套件
	- Vite
	- Vue3
	- TypeScript
	- [Prettier](https://prettier.io/)
		格式化文件
	- [Tailwind CSS](https://tailwindcss.com/)
		v3.x版，含[prettier-plugin-tailwindcss](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier)插件，通过prettier对样式类排序。*由于tailwind近期火爆的流行程度，不得不将其作为一个基础套件来考虑*
	- husky + [lint-staged](https://www.npmjs.com/package/lint-staged)
		git提交时自动使用prettier格式化

- [Vue Router](https://router.vuejs.org/zh/) SPA 路由

- [Pinia](https://pinia.vuejs.org/) 全局状态管理

- 常用工具 (libs)
	- 全局请求封装，基于axios (libs/request)
	- local-storage 管理 (libs/local-store)

- [Element Plus](https://element-plus.org/zh-CN/) v2.x UI框架

- 全局组件 (common/components)
	- TODO

- 框架页面 (common/views)
	- 登录页 common/views/login.vue
	- 后台框架页 common/views/main.vue
	- 异常页 common/views/error.vue

### 版本差异表

|  功能 | [纯净版](https://gitee.com/lilimin/vue3-project-starter-template/tree/pure) | [基础版](https://gitee.com/lilimin/vue3-project-starter-template/tree/base) | [完整版](https://gitee.com/lilimin/vue3-project-starter-template/tree/master) |
| :----: | :----: | :----: | :----: |
| 基础插件 | √ | √ | √ |
| Vue Router | - | √ | √ |
| Pinia | - | √ | √ |
| 常用工具 | - | √ | √ |
| Element Plus | - | - | √ |
| 全局组件 | - | - | √ |
| 框架页面 | - | - | √ |
| - | - | - | - |
| **总结** | 一个仅包含了tailwind.css和husky+lint-staged的Vue3启动模板 | 一个适用于工程化的项目启动模板，做了一些工程化的规划（针对pinia、router）。没有安装任何UI框架，因此也可以走向移动端、PC端、用户或者是后台管理 | 包含了element-plus套件的**后台管理端**模板工程，包含了一些对table、form、upload组件的常用封装 |

### 注意事项

- husky 和 lint-staged 不起作用

	如果是直接从git仓库clone过去，请先删除.git目录，再使用git init实例化到自己的仓库去。由于切换了仓库，可能导致husky和lint-staged不起作用。
	
	可以先删除husky和lint-staged，然后把git关联到自己的仓库上，再重装husky和lint-staged（注意先后顺序）

	```
	# 删除 husky 和 lint-staged
	npm uninstall husky lint-staged

	# 重装
	npx mrm@2 lint-staged
	```