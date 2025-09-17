/**
 * pnpm 配置文件
 * 用于自定义 pnpm 的行为和钩子
 */

module.exports = {
  hooks: {
    // 在安装前运行
    readPackage(pkg, context) {
      // 可以在这里修改 package.json
      return pkg;
    },

    // 在安装后运行
    afterAllResolved(lockfile, context) {
      // 可以在这里修改 lockfile
      return lockfile;
    },
  },

  // 包覆盖配置
  overrides: {
    // 可以在这里覆盖特定包的版本
  },

  // 包别名配置
  packageExtensions: {
    // 可以在这里扩展包的配置
  },
};
