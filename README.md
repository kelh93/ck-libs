# 功能实现
1. 开发环境，本地包引用。
2. 子包升级后，自动关联父包更新版本。
3. 大版本更新
4. 测试用例集成
5. tsconfig.json
6. .npmrc

# 准备工作
1. git仓库（lerna publish会检测本地文件修改）
2. .npmrc 
3. pnpm-workspace.yaml

# lerna 常用命令
**1. lerna init**
生成lerna json。
```json
// lerna.json
{
  "packages": [
    "packages/*"
  ],
  // 使用workspace
  "useWorkspaces": true,
  "version": "independent",
  "npmClient": "pnpm", // 使用pnpm管理依赖
  "command": {
    "publish": {
      "conventionalCommits": true, // 自动提交
      "message": "chore(release): release"
    }
  },
  // 忽略文件更改
  "ignoreChanges": ["**/node_modules/**", "**/dist/**", "**/__tests__/**"]
}

```
**2. lerna create xxx**
自动生成文件目录,可以根据个人习惯修改文件夹名称。
```bash
├── README.md
├── __tests__
│   └── babel-presets.test.js
├── lib
│   └── babel-presets.js
└── package.json
```
> 1. 运行 lerna create xxx,报错: "The git binary was not found, or this is not a git repository.",lerna 需要项目有git地址。
> 2. 使用`lerna init`会自动生成 `.gitignore`文件。 之后再使用 `lerna create xxx`就不会报错。

**3. lerna add**
**4. lerna publish**

**5. lerna version**

# pnpm常用命令

**1. pnpm i xxx -w**
安装全局依赖.

**2. pnpm i xxx -r**
为每个packages都安装同一个依赖。

# 设置npmrc
```bash
# 防止公共依赖包过大，提升pnpm install/add 安装速度
shared-workspace-lockfile=false
# https://pnpm.io/zh/npmrc#link-workspace-packages
link-workspace-packages=true
```

# 开发环境依赖
- typescript
- @tsconfig/recommended
- microbundle

# 场景
1. packages/babel-presets 引用 packages/utils
> packages/babel-presets和packages/utils，均未发布。

使用lerna， `lerna add @ck/utils packages/babel-presets` 

```bash
## `lerna add @ck/utils packages/babel-presets` 报错：❌
info cli using local version of lerna
lerna notice cli v6.0.3
lerna info versioning independent
lerna ERR! EPNPMNOTSUPPORTED Add is not supported when using `pnpm` workspaces. Use `pnpm` directly to add dependencies to packages: https://pnpm.io/cli/add
```

使用`pnpm add`，执行`pnpm add @ck/utils --filter @ck/babel-presets`.安装成功🎉。安装成功后，会在packages/babel-presets的package.json中新增
```json
{
  "name": "@ck/babel-presets",
  // ...
  "dependencies": {
    "@ck/utils": "workspace:^1.0.0"
  }
}
```
@ck/utils 版本号会带有 `workspace:`协议。这会导致`lerna publish`失败。 
切换到packages/babel-presets,运行`lerna publish`. 
`lerna publish` 
```bash
info cli using local version of lerna
lerna notice cli v6.0.3
lerna info versioning independent
lerna ERR! ENOCOMMIT No commits in this repository. Please commit something before using version
```
需要先提交本地代码。建立git repo，提交代码✅。再次尝试`lerna publish`
```bash
# 报错❌
lerna notice cli v6.0.3
lerna info versioning independent
lerna ERR! Error: Command failed with exit code 1: git remote update
lerna ERR! fatal: unable to access 'https://github.com/kelh93/ck-libs.git/': LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to github.com:443
lerna ERR! error: Could not fetch origin
lerna ERR! Fetching origin
lerna ERR!     at makeError (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/execa/lib/error.js:60:11)
lerna ERR!     at Function.module.exports.sync (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/execa/index.js:194:17)
lerna ERR!     at Object.execSync (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/@lerna/child-process/index.js:39:16)
lerna ERR!     at updateRemote (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/@lerna/version/lib/is-behind-upstream.js:34:16)
lerna ERR!     at isBehindUpstream (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/@lerna/version/lib/is-behind-upstream.js:16:3)
lerna ERR!     at VersionCommand.initialize (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/@lerna/version/index.js:156:9)
lerna ERR! Error: Command failed with exit code 1: git remote update
lerna ERR! fatal: unable to access 'https://github.com/kelh93/ck-libs.git/': LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to github.com:443
lerna ERR! error: Could not fetch origin
lerna ERR! Fetching origin
lerna ERR!     at makeError (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/execa/lib/error.js:60:11)
lerna ERR!     at Function.module.exports.sync (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/execa/index.js:194:17)
lerna ERR!     at Object.execSync (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/@lerna/child-process/index.js:39:16)
lerna ERR!     at updateRemote (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/@lerna/version/lib/is-behind-upstream.js:34:16)
lerna ERR!     at isBehindUpstream (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/@lerna/version/lib/is-behind-upstream.js:16:3)
lerna ERR!     at VersionCommand.initialize (/Users/rain/.nvm/versions/node/v16.18.0/lib/node_modules/lerna/node_modules/@lerna/version/index.js:156:9)
lerna ERR! lerna Command failed with exit code 1: git remote update
lerna ERR! lerna fatal: unable to access 'https://github.com/kelh93/ck-libs.git/': LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to github.com:443
lerna ERR! lerna error: Could not fetch origin
lerna ERR! lerna Fetching origin

```
