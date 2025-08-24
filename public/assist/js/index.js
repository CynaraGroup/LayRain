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

        // 音乐播放器功能 - 使用Web Audio API生成舒缓的背景音乐
        // 播放和弦进行，创建环境音乐效果
        let audioContext = null;
        let oscillators = [];
        let gainNode = null;
        let isPlaying = false;
        let musicPattern = 0;
        
        function initMusicPlayer() {
            const musicToggle = document.getElementById('musicToggle');
            const playIcon = document.getElementById('playIcon');
            const pauseIcon = document.getElementById('pauseIcon');
            const volumeSlider = document.getElementById('volumeSlider');
            
            // 创建音频上下文（用户交互后才能创建）
            function createAudioContext() {
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    gainNode = audioContext.createGain();
                    gainNode.connect(audioContext.destination);
                    gainNode.gain.value = 0.3; // 初始音量
                }
            }
            
            // 播放舒缓的背景音乐（合成音调）
            function playMusic() {
                createAudioContext();
                
                stopMusic(); // 停止之前的音乐
                
                // 创建多层次的和弦音乐
                const chordProgression = [
                    [261.63, 329.63, 392.00], // C大调 (C, E, G)
                    [293.66, 369.99, 440.00], // D小调 (D, F#, A)
                    [329.63, 415.30, 493.88], // E小调 (E, G#, B)
                    [349.23, 440.00, 523.25]  // F大调 (F, A, C)
                ];
                
                let chordIndex = 0;
                
                function playChord() {
                    if (!isPlaying) return;
                    
                    const currentChord = chordProgression[chordIndex];
                    oscillators = [];
                    
                    currentChord.forEach((freq, index) => {
                        const osc = audioContext.createOscillator();
                        const oscGain = audioContext.createGain();
                        
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                        
                        // 创建音量包络，淡入淡出效果
                        oscGain.gain.setValueAtTime(0, audioContext.currentTime);
                        oscGain.gain.exponentialRampToValueAtTime(0.1 * (1 / (index + 1)), audioContext.currentTime + 1);
                        oscGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3.5);
                        
                        osc.connect(oscGain);
                        oscGain.connect(gainNode);
                        
                        osc.start();
                        osc.stop(audioContext.currentTime + 4);
                        
                        oscillators.push(osc);
                    });
                    
                    chordIndex = (chordIndex + 1) % chordProgression.length;
                }
                
                // 开始播放
                isPlaying = true;
                playChord();
                
                // 每4秒播放下一个和弦
                musicPattern = setInterval(() => {
                    if (isPlaying) {
                        playChord();
                    }
                }, 4000);
                
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                musicToggle.classList.add('playing');
            }
            
            function stopMusic() {
                isPlaying = false;
                
                if (musicPattern) {
                    clearInterval(musicPattern);
                    musicPattern = 0;
                }
                
                // 淡出所有振荡器
                if (gainNode && audioContext) {
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
                    
                    setTimeout(() => {
                        oscillators.forEach(osc => {
                            try {
                                osc.stop();
                            } catch (e) {
                                // 振荡器可能已经停止
                            }
                        });
                        oscillators = [];
                        
                        if (gainNode) {
                            gainNode.gain.value = volumeSlider.value / 100;
                        }
                    }, 500);
                }
                
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
                    alert('音频播放失败，可能是浏览器不支持Web Audio API');
                }
            });
            
            // 音量控制
            volumeSlider.addEventListener('input', (e) => {
                if (gainNode) {
                    gainNode.gain.value = e.target.value / 100;
                }
            });
        }