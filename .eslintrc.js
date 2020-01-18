const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier',"react-hooks"],
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      "jsx": true,
      "experimentalObjectRestSpread": true
    },
  },
  rules: {//0-禁用该规则
    'prettier/prettier': ['error', prettierOptions],
    'class-methods-use-this': 0,
    'default-case': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
    // 'import/imports-first': 0,
    'import/newline-after-import': 0,//导入语句后强制换行
    'import/no-dynamic-require': 0,//禁止require()使用表达式调用
    'import/no-extraneous-dependencies': 0,//禁止使用无关的包裹
    'import/no-named-as-default': 0,//报告使用导出的名称作为默认导出的标识符
    'import/no-unresolved': 2,//确保导入指向可以解析的文件/模块
    'import/no-webpack-loader-syntax': 0,//禁止在import中使用webpack loader语法
    'import/prefer-default-export': 0,//如果模块导出单个名称，则首选默认导出
    // indent: [
    //   2,
    //   2,
    //   {
    //     SwitchCase: 1,
    //   },
    // ],
    'jsx-a11y/aria-props': 2,//强制所有aria-*道具都有效
    'jsx-a11y/heading-has-content': 0,
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        // NOTE: If this error triggers, either disable it or add
        // your custom components, labels and attributes via these options
        // See https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
        controlComponents: ['Input'],
      },
    ],//强制标签标签具有文本标签和关联控件
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/mouse-events-have-key-events': 2,//强制onMouseOver/onMouseOut附带onFocus/onBlur，只适用于键盘用户。
    'jsx-a11y/role-has-required-aria-props': 2,//强制具有ARIA角色的元素必须具有该角色所需的所有属性。
    'jsx-a11y/role-supports-aria-props': 2,//强制定义具有显式或隐式角色的元素只包含该角色支持的aria-*属性。
    'jsx-a11y/click-events-have-key-events': 0,//强制可单击的非交互式元素至少具有一个键盘事件侦听器。
    'jsx-a11y/no-static-element-interactions': 0,//强制具有单击处理程序的非交互式、可见元素(如<div>)使用role属性。
    'jsx-a11y/no-noninteractive-element-interactions': 0,//不应该为非交互式元素分配鼠标或键盘事件侦听器。
    'max-len': 0,//强制使用最大行长度以提高代码可读性和可维护性
    'newline-per-chained-call': 0,//在方法链中的每次调用后需要换行符
    'no-confusing-arrow': 0,//不要在可能与比较运算符混淆的地方使用箭头函数语法
    'no-console': 1,
    "no-restricted-syntax": 0,//不推荐用for-in for-of
    'no-unused-vars': 2,//禁止未使用的变量
    'no-use-before-define': 0,//禁止在变量声明之前使用
    'prefer-template': 2,//建议使用模板文字而不是字符串连接
    'react/destructuring-assignment': 0,
    'react/prefer-stateless-function': 0,
    // 'react-hooks/rules-of-hooks': 'error',
    'react/jsx-closing-tag-location': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/jsx-filename-extension': 0,
    'react/jsx-no-target-blank': 0,
    'react/jsx-uses-vars': 2,
    'react/require-default-props': 0,
    'react/require-extension': 0,
    'react/self-closing-comp': 0,
    'react/sort-comp': 0,
    'react/no-access-state-in-setstate':0,
    'react/prop-types': 0,//使用PropTypes验证，0 =关闭，1 =警告，2 =错误。
    "react/button-has-type": 0,
    "react/jsx-no-bind": 0,
    // 'redux-saga/no-yield-in-race': 2,
    // 'redux-saga/yield-effects': 2,
    'require-yield': 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack/webpack.dev.js',
      },
    },
  },
};
