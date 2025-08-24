        // 获取一言并渲染
        async function fetchHitokoto() {
            try {
                // 添加随机参数防止缓存
                const timestamp = new Date().getTime();
                const response = await fetch(`https://alayrain.zhngjah.space:2096/api/hitokoto?t=${timestamp}`);
                if (!response.ok) {
                    throw new Error('网络响应异常');
                }
                const data = await response.json();
                const hitokotoData = data.data || data;
                document.getElementById('hitokoto-content').textContent = hitokotoData.content;
                
                // 保存当前一言ID到按钮属性
                document.getElementById('likeButton').setAttribute('data-hitokoto-id', hitokotoData.id);
                
                // 获取并显示点赞数
                await fetchLikeCount(hitokotoData.id);
                
                // 重置点赞按钮状态
                document.getElementById('likeButton').classList.remove('active');
                
                // 格式化作者和来源信息
                let creditText = '';
                const author = hitokotoData.author;
                const source = hitokotoData.source;
                
                if (author && source) {
                    // 检查source是否已包含《》符号
                    if (source.includes('《') && source.includes('》')) {
                        creditText = `——${author}${source}`;
                    } else {
                        creditText = `——${author}《${source}》`;
                    }
                } else if (author) {
                    creditText = `——${author}`;
                } else if (source) {
                    // 检查source是否已包含《》符号
                    if (source.includes('《') && source.includes('》')) {
                        creditText = `——${source}`;
                    } else {
                        creditText = `——《${source}》`;
                    }
                }
                
                document.getElementById('hitokoto-credit').textContent = creditText;
                console.log('一言已更新:', hitokotoData.content);
            } catch (error) {
                console.error('获取一言失败:', error);
                // 显示更具体的错误信息
                document.getElementById('hitokoto-content').textContent = `获取一言失败: ${error.message}`;
                document.getElementById('hitokoto-credit').textContent = '';
                document.getElementById('likeCount').textContent = '0';
            }
        }

        // 获取点赞数
        async function fetchLikeCount(hitokotoId) {
            try {
                const response = await fetch(`https://alayrain.zhngjah.space:2096/api/hitokoto/${hitokotoId}/like/count`);
                if (!response.ok) {
                    throw new Error('获取点赞数失败');
                }
                const data = await response.json();
                document.getElementById('likeCount').textContent = data.data.like_count;
            } catch (error) {
                console.error('获取点赞数失败:', error);
                document.getElementById('likeCount').textContent = '0';
            }
        }

        // 处理点赞
        async function handleLike() {
            const likeButton = document.getElementById('likeButton');
            const hitokotoId = likeButton.getAttribute('data-hitokoto-id');
            
            // 如果已经点赞，则不重复点赞
            if (likeButton.classList.contains('active')) {
                return;
            }
            
            try {
                const response = await fetch(`https://alayrain.zhngjah.space:2096/api/hitokoto/${hitokotoId}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('点赞失败');
                }
                
                const data = await response.json();
                document.getElementById('likeCount').textContent = data.data.like_count;
                likeButton.classList.add('active');
                console.log('点赞成功');
            } catch (error) {
                console.error('点赞失败:', error);
                alert('点赞失败，请重试');
            }
        }

        // 页面加载完成后获取一言
        window.addEventListener('DOMContentLoaded', () => {
            fetchHitokoto();
            // 绑定点赞按钮点击事件
            document.getElementById('likeButton').addEventListener('click', handleLike);
            // 初始化音乐播放器
            initMusicPlayer();
                // 自动播放音乐（部分浏览器可能需要用户交互）
                if (typeof playMusic === 'function') {
                    playMusic();
                }
        });
        
        // 每5秒自动刷新一言
        const hitokotoInterval = setInterval(fetchHitokoto, 5000);
        
        // 页面卸载时清除定时器，避免内存泄漏
        window.addEventListener('beforeunload', () => {
            clearInterval(hitokotoInterval);
        });