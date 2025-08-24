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
        });
        
        // 每5秒自动刷新一言
        const hitokotoInterval = setInterval(fetchHitokoto, 5000);
        
        // 页面卸载时清除定时器，避免内存泄漏
        window.addEventListener('beforeunload', () => {
            clearInterval(hitokotoInterval);
        });

        // 音乐播放器功能 - 播放背景音乐文件
        let audioElement = null;
        let isPlaying = false;
        
        function initMusicPlayer() {
            const musicToggle = document.getElementById('musicToggle');
            const playIcon = document.getElementById('playIcon');
            const pauseIcon = document.getElementById('pauseIcon');
            const volumeSlider = document.getElementById('volumeSlider');
            
            // 创建音频元素
            function createAudioElement() {
                if (!audioElement) {
                    audioElement = new Audio('./assist/music.mp3');
                    audioElement.loop = true; // 循环播放
                    audioElement.volume = volumeSlider.value / 100; // 设置初始音量
                    
                    // 处理音频加载错误
                    audioElement.addEventListener('error', (e) => {
                        console.error('音频加载失败:', e);
                        alert('音频文件加载失败，请检查文件是否存在');
                    });
                    
                    // 音频播放结束事件（虽然设置了loop，但以防万一）
                    audioElement.addEventListener('ended', () => {
                        if (isPlaying) {
                            audioElement.play();
                        }
                    });
                }
            }
            
            // 播放音乐
            function playMusic() {
                createAudioElement();
                
                audioElement.play().then(() => {
                    isPlaying = true;
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                    musicToggle.classList.add('playing');
                }).catch((error) => {
                    console.error('音频播放失败:', error);
                    alert('音频播放失败，请重试');
                });
            }
            
            function stopMusic() {
                if (audioElement) {
                    audioElement.pause();
                    audioElement.currentTime = 0; // 重置播放位置
                }
                
                isPlaying = false;
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                musicToggle.classList.remove('playing');
            }
            
            // 播放/暂停切换
            musicToggle.addEventListener('click', () => {
                try {
                    if (!isPlaying) {
                        playMusic();
                    } else {
                        stopMusic();
                    }
                } catch (error) {
                    console.error('音频播放错误:', error);
                    alert('音频播放失败，请重试');
                }
            });
            
            // 音量控制
            volumeSlider.addEventListener('input', (e) => {
                if (audioElement) {
                    audioElement.volume = e.target.value / 100;
                }
            });
        }