const express = require('express');
const cors = require('cors');
const HitokotoSystem = require('./HitokotoSystem');

const app = express();
app.use(cors());
app.use(express.json());

const hitokoto = new HitokotoSystem({
  host: '****',
  port: 24943,
  user: 'layrain',
  password: 'Cynara@123',
  database: 'postgres'
});

app.get('/api/hitokoto', async (req, res) => {
  const category = req.query.category;
  const hitokotoData = await hitokoto.getRandomHitokoto(category);

  if (hitokotoData) {
    const likeCount = await hitokoto.getLikeCount(hitokotoData.id);
    hitokotoData.like = likeCount;
    return res.json({
      code: 200,
      message: '获取成功',
      data: hitokotoData
    });
  } else {
    return res.status(404).json({
      code: 404,
      message: '没有找到一言'
    });
  }
});

app.get('/api/hitokoto/:hitokotoId', async (req, res) => {
  const hitokotoId = parseInt(req.params.hitokotoId);
  const hitokotoData = await hitokoto.getHitokotoById(hitokotoId);

  if (hitokotoData) {
    const likeCount = await hitokoto.getLikeCount(hitokotoId);
    hitokotoData.like = likeCount;
    return res.json({
      code: 200,
      message: '获取成功',
      data: hitokotoData
    });
  } else {
    return res.status(404).json({
      code: 404,
      message: '没有找到该一言'
    });
  }
});

app.post('/api/hitokoto', async (req, res) => {
  const data = req.body;
  const requiredFields = ['content'];

  for (const field of requiredFields) {
    if (!(field in data)) {
      return res.status(400).json({
        code: 400,
        message: `缺少必要字段: ${field}`
      });
    }
  }

  const hitokotoId = await hitokoto.addHitokoto(
    data.content,
    data.author,
    data.source,
    data.category
  );

  if (hitokotoId) {
    return res.status(201).json({
      code: 201,
      message: '添加成功',
      data: { id: hitokotoId }
    });
  } else {
    return res.status(500).json({
      code: 500,
      message: '添加失败'
    });
  }
});

app.put('/api/hitokoto/:hitokotoId', async (req, res) => {
  const hitokotoId = parseInt(req.params.hitokotoId);
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      code: 400,
      message: '没有提供更新数据'
    });
  }

  const success = await hitokoto.updateHitokoto(hitokotoId, data);

  if (success) {
    return res.json({
      code: 200,
      message: '更新成功'
    });
  } else {
    return res.status(404).json({
      code: 404,
      message: '没有找到该一言或更新失败'
    });
  }
});

app.delete('/api/hitokoto/:hitokotoId', async (req, res) => {
  const hitokotoId = parseInt(req.params.hitokotoId);
  const success = await hitokoto.deleteHitokoto(hitokotoId);

  if (success) {
    return res.json({
      code: 200,
      message: '删除成功'
    });
  } else {
    return res.status(404).json({
      code: 404,
      message: '没有找到该一言'
    });
  }
});

app.get('/api/hitokoto/list', async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const pageSize = parseInt(req.query.pageSize || 10);
  const category = req.query.category;
  const offset = (page - 1) * pageSize;

  console.log(`接收到的参数: page=${page}, pageSize=${pageSize}, category=${category}, offset=${offset}`);

  const hitokotoList = await hitokoto.listHitokoto(pageSize, offset, category);
  const total = await hitokoto.countHitokoto(category);

  for (const hitokotoItem of hitokotoList) {
    const likeCount = await hitokoto.getLikeCount(hitokotoItem.id);
    hitokotoItem.like = likeCount;
  }

  return res.json({
    code: 200,
    message: '获取成功',
    data: {
      list: hitokotoList,
      total,
      offset
    }
  });
});

app.get('/api/categories', async (req, res) => {
  const categories = await hitokoto.getCategories();

  return res.json({
    code: 200,
    message: '获取成功',
    data: categories
  });
});

app.post('/api/hitokoto/:hitokotoId/like', async (req, res) => {
  const hitokotoId = parseInt(req.params.hitokotoId);
  const hitokotoData = await hitokoto.getHitokotoById(hitokotoId);

  if (!hitokotoData) {
    return res.status(404).json({
      code: 404,
      message: '没有找到该一言'
    });
  }

  const newLikeCount = await hitokoto.likeHitokoto(hitokotoId);

  return res.json({
    code: 200,
    message: '点赞成功',
    data: {
      hitokoto_id: hitokotoId,
      like_count: newLikeCount
    }
  });
});

app.get('/api/hitokoto/:hitokotoId/like/count', async (req, res) => {
  const hitokotoId = parseInt(req.params.hitokotoId);
  const hitokotoData = await hitokoto.getHitokotoById(hitokotoId);

  if (!hitokotoData) {
    return res.status(404).json({
      code: 404,
      message: '没有找到该一言'
    });
  }

  const likeCount = await hitokoto.getLikeCount(hitokotoId);

  return res.json({
    code: 200,
    message: '获取成功',
    data: {
      hitokoto_id: hitokotoId,
      like_count: likeCount
    }
  });
});

const PORT = 5000;
app.listen(PORT, '::1', () => {
  console.log(`Server is running on http://[::1]:${PORT}`);
});
