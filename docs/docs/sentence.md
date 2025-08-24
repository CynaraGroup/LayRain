# 语句接口

## 接口说明
::: tip
雷语的源码全栈开源，并允许自行部署，效果我们提供的服务完全一致。
:::

雷语是一个公益性服务，我们没有具备充足的资金和资源应对超高并发的请求 ~~，但是效率比hitokoto强~~ 。如果您的站点流量较大、请求数较多，从稳定性、可控性考虑，我们都建议您自行部署 API，或在程序中使用缓存减轻请求压力。

如果您对我们的项目感兴趣，不妨[赞助我们](https://cynara.my/sponsor),或为我们[提供更加稳定的服务器](mailto:support@cynara.my)

详细的部署指南请参考 [接口部署](./deploy.md)

## 请求地址
|地址|协议|方法|线路|
|---|---|---|---|
|`alayrain.zhngjah.space:2096`|HTTPS|Any|全球|

## 请求参数

|参数|类型|值|说明|
|---|---|---|---|
|/api/hitokoto/category|string|励志 哲学 诗词 影视 来自网络 原创 文学游戏 漫画 动画 其他|根据标签获取一言|
|/api/hitokoto/|| |随机获取一言|
|/api/hitokoto/|int|1到∞|根据 ID 获取指定一言|
|/api/hitokoto/list|| |获取一言列表|
|/api/categories|||获取分类列表|


## 返回信息
``` json
{
  "code": 200,
  "data": {
    "author": "",
    "category": "影视",
    "content": "你要不会唠嗑能不能别硬唠。",
    "created_at": "Thu, 21 Aug 2025 15:13:20 GMT",
    "id": 7,
    "like": 0,
    "source": "缝纫机乐队"
  },
  "message": "获取成功"
}
```
|返回参数名称|描述|
|---|---|
|id|一言标识|
|content|一言正文 编码方式unicode 使用 utf-8|
|author|一言的作者|
|source|一言的出处|
|category|一言分类|
|like|喜欢数|
|created_at|提交时间|
|code|连接状态|
|message|获取状态|

## 错误处理
API 使用 HTTP 状态码和 JSON 格式返回错误信息：

```json
{
  "code": 状态码,
  "message": "错误描述"
}
```
常见状态码：
- 200: 请求成功
- 201: 创建成功
- 400: 请求参数错误
- 404: 资源不存在
- 500: 服务器内部错误

