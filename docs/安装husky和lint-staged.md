## lint-stage 配合 husky 使用说明

[lint-staged](https://www.npmjs.com/package/lint-staged) 是一个开发依赖，用于在 git commit 时仅针对被修改的文件执行 prettier 或 eslint，从而规范提交的代码格式

lint-staged 依赖 husky 提供的 git hook，所以一并安装

使用过程中有可能遇到如下问题，请参阅

#### git commit 遇到报错

```
Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only file and data URLs are supported by the default ESM loader
```

这是由于 husky 12+版本需要 node.js 版本在 12.20 以上，参考[官网说明](https://www.npmjs.com/package/lint-staged)

如果你的环境允许，直接官网下载新版本的 [node.js](http://nodejs.cn/) 即可

如果你的某些项目必须依赖特定版本的 node.js，建议使用 nvm 自动安装、管理和切换多个版本的 node.js

[nvm linux 版](https://github.com/hakobera/nvmw)
[nvm window 版](https://github.com/coreybutler/nvm-windows)
[nvm 使用说明](https://www.runoob.com/w3cnote/nvm-manager-node-versions.html)

#### 其他报错

如果你 git clone 本项目，然后删除.git 目录，之后重新初始化 git 并关联到自己的仓库，就可能在 git commit 时出现 husky 相关问题

在某些情况下，git commit 可以正常执行，但 husky 其实并没有正确的添加 git hook，这会导致 lint-staged 和 husky 的功能完全失效

如果你想让 lint-staged 和 husky 正常工作，可以尝试卸载 lint-staged 和 husky，并删除 .husky 目录，然后重装

```
npm uninstall husky lint-staged
```

删除.husky 目录

```
# 这个指令会自动在开发依赖中安装 husky 和 lint-staged，并配置好 husky 的 pre-commit 钩子
npx mrm@2 lint-staged
```
