# 使用示例
- [https://alayrain.zhngjah.space:2096/api/hitokoto](https://alayrain.zhngjah.space:2096/api/hitokoto) (随机一言)
- [https://alayrain.zhngjah.space:2096/api/hitokoto?category=励志](https://alayrain.zhngjah.space:2096/api/hitokoto?category=励志) (随机一句励志话)

## 网页
以下内容改编自[https://developer.hitokoto.cn/sentence/demo.html](https://developer.hitokoto.cn/sentence/demo.html)

#### 演示
> 请注意：
> 本例所有用法均使用 ES6 语法。如果您想考虑兼容非现代浏览器（如：IE），需要您自行转换。
我们假设您的网页中存在一个块级元素用于显示一言的文本内容，且我们想让它能跳转到一言的指定页面用于后续的收藏、反馈。
``` html
<!-- 请注意，以下的示例包含超链接，您可能需要手动配置样式使其不变色。如果您嫌麻烦，可以移除。 -->
<p id="hitokoto">
  <a href="#" id="hitokoto_text">:D 获取中...</a>
</p>
```
那我们可以在`<script></script>`中 或者`.js`文件中使用我们的接口：
::: code-group
``` 接口选择器 [接口选择器]
<!-- 本例不能添加链接内容，放在此处只是因为此接口比较方便，也许能够解决大部分的需求-->
<script src="https://alayrain.zhngjah.space:2096/api/hitokoto" defer></script>
```
:::

#### 完整示例（以 Fetch API 为例）
``` html
<p id="hitokoto">
  <a href="#" id="hitokoto_text">:D 获取中...</a>
</p>
<script>
  fetch('https://alayrain.zhngjah.space:2096/api/hitokoto')
    .then(response => response.json())
    .then(data => {
      const hitokoto = document.querySelector('#hitokoto_text')
      hitokoto.innerText = data.content
    })
    .catch(console.error)
</script>