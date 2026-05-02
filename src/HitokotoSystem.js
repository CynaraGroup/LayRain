const { Pool } = require('pg');

class HitokotoSystem {
  constructor({ host = 'localhost', user = 'postgres', password = '', database = 'hitokoto', port = 5432 }) {
    this.pool = new Pool({
      host,
      user,
      password,
      database,
      port
    });
    this._initDatabase();
  }

  async _initDatabase() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS hitokoto (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          author VARCHAR(255),
          source VARCHAR(255),
          category VARCHAR(255),
          "like" INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (error) {
      console.error('数据库初始化失败:', error);
    }
  }

  async addHitokoto(content, author = null, source = null, category = null, like = 0) {
    try {
      const result = await this.pool.query(
        'INSERT INTO hitokoto (content, author, source, category, "like") VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [content, author, source, category, like]
      );
      return result.rows[0].id;
    } catch (error) {
      console.error('添加一言失败:', error);
      return null;
    }
  }

  async getRandomHitokoto(category = null) {
    let sql = 'SELECT * FROM hitokoto';
    const params = [];
    
    if (category) {
      sql += ' WHERE category = $1';
      params.push(category);
    }
    sql += ' ORDER BY RANDOM() LIMIT 1';

    try {
      const result = await this.pool.query(sql, params);
      return result.rows[0] || null;
    } catch (error) {
      console.error('获取随机一言失败:', error);
      return null;
    }
  }

  async getHitokotoById(hitokotoId) {
    try {
      const result = await this.pool.query(
        'SELECT * FROM hitokoto WHERE id = $1',
        [hitokotoId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('获取一言失败:', error);
      return null;
    }
  }

  async updateHitokoto(hitokotoId, { content = null, author = null, source = null, category = null, like = null }) {
    const updateFields = [];
    const params = [];
    let paramIndex = 1;

    if (content !== null) {
      updateFields.push(`content = $${paramIndex}`);
      params.push(content);
      paramIndex++;
    }
    if (author !== null) {
      updateFields.push(`author = $${paramIndex}`);
      params.push(author);
      paramIndex++;
    }
    if (source !== null) {
      updateFields.push(`source = $${paramIndex}`);
      params.push(source);
      paramIndex++;
    }
    if (category !== null) {
      updateFields.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }
    if (like !== null) {
      updateFields.push(`"like" = $${paramIndex}`);
      params.push(like);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return false;
    }

    params.push(hitokotoId);
    const updateQuery = updateFields.join(', ');
    const sql = `UPDATE hitokoto SET ${updateQuery} WHERE id = $${paramIndex}`;

    try {
      const result = await this.pool.query(sql, params);
      return result.rowCount > 0;
    } catch (error) {
      console.error('更新一言失败:', error);
      return false;
    }
  }

  async deleteHitokoto(hitokotoId) {
    try {
      const result = await this.pool.query(
        'DELETE FROM hitokoto WHERE id = $1',
        [hitokotoId]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error('删除一言失败:', error);
      return false;
    }
  }

  async listHitokoto(limit = 10, offset = 0, category = null) {
    let sql = 'SELECT * FROM hitokoto';
    const params = [];
    let paramIndex = 1;

    if (category) {
      sql += ' WHERE category = $1';
      params.push(category);
      paramIndex++;
    }
    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    try {
      const result = await this.pool.query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('获取一言列表失败:', error);
      return [];
    }
  }

  async getCategories() {
    try {
      const result = await this.pool.query(
        'SELECT DISTINCT category FROM hitokoto WHERE category IS NOT NULL'
      );
      return result.rows.map(row => row.category);
    } catch (error) {
      console.error('获取分类列表失败:', error);
      return [];
    }
  }

  async countHitokoto(category = null) {
    let sql = 'SELECT COUNT(*) as count FROM hitokoto';
    const params = [];

    if (category) {
      sql += ' WHERE category = $1';
      params.push(category);
    }

    try {
      const result = await this.pool.query(sql, params);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error('统计一言数量失败:', error);
      return 0;
    }
  }

  async getLikeCount(hitokotoId) {
    try {
      const result = await this.pool.query(
        'SELECT "like" FROM hitokoto WHERE id = $1',
        [hitokotoId]
      );
      if (result.rows.length > 0) {
        return result.rows[0].like;
      }
      return 0;
    } catch (error) {
      console.error('获取点赞数失败:', error);
      return 0;
    }
  }

  async likeHitokoto(hitokotoId) {
    const success = await this.updateLikeCount(hitokotoId);
    if (success) {
      return await this.getLikeCount(hitokotoId);
    }
    return null;
  }

  async updateLikeCount(hitokotoId, increment = 1) {
    try {
      const result = await this.pool.query(
        'UPDATE hitokoto SET "like" = "like" + $1 WHERE id = $2',
        [increment, hitokotoId]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error('更新点赞数失败:', error);
      return false;
    }
  }
}

module.exports = HitokotoSystem;
