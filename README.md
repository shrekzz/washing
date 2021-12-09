# washing

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 使用

### 产线数据处理

第二步：选择行/列指原始表格是行排列还是列排列的

第四步：无论原始表格是行还是列，内部统一将表格转置为行类型方便处理数据，故原始表格为列的也是按照行来取；

### AP数据处理

将AP导出的xlsx直接拖进来即可处理

### 自动输入FAQ

选择ANC工具的类型，默认BES，可选wuqi、Airoda

将窗口置顶，鼠标放在第一个输出窗口按下ctrl+Q即可开始