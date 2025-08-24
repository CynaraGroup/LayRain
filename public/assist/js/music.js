 // 音乐播放器功能 - 增强版本支持歌词、封面和进度条
        let audioElement = null;
        let isPlaying = false;
        let lyricsData = [];
        let currentLyricIndex = -1;
        let isDragging = false;

        function initMusicPlayer() {
            const musicToggle = document.getElementById('musicToggle');
            const playIcon = document.getElementById('playIcon');
            const pauseIcon = document.getElementById('pauseIcon');
            const volumeSlider = document.getElementById('volumeSlider');
            const expandButton = document.getElementById('expandButton');
            const musicPanel = document.getElementById('musicPanel');
            const playButtonPanel = document.getElementById('playButtonPanel');
            const playIconPanel = document.getElementById('playIconPanel');
            const pauseIconPanel = document.getElementById('pauseIconPanel');
            const progressBar = document.getElementById('progressBar');
            const currentTime = document.getElementById('currentTime');
            const totalTime = document.getElementById('totalTime');
            const volumeSliderPanel = document.getElementById('volumeSliderPanel');
            const lyricsContainer = document.getElementById('lyricsContainer');

            // 创建音频元素
            function createAudioElement() {
                if (!audioElement) {
                    audioElement = new Audio('./assist/music/music.mp3');
                    audioElement.loop = true;
                    audioElement.volume = volumeSlider.value / 100;
                    
                    // 处理音频加载错误
                    audioElement.addEventListener('error', (e) => {
                        console.error('音频加载失败:', e);
                        alert('音频文件加载失败，请检查文件是否存在');
                    });
                    
                    // 音频元数据加载完成
                    audioElement.addEventListener('loadedmetadata', () => {
                        const duration = audioElement.duration;
                        totalTime.textContent = formatTime(duration);
                        progressBar.max = duration;
                    });
                    
                    // 播放时间更新
                    audioElement.addEventListener('timeupdate', () => {
                        if (!isDragging) {
                            const current = audioElement.currentTime;
                            currentTime.textContent = formatTime(current);
                            progressBar.value = current;
                            updateLyrics(current);
                        }
                    });
                    
                    // 音频播放结束事件
                    audioElement.addEventListener('ended', () => {
                        if (isPlaying) {
                            audioElement.play();
                        }
                    });
                }
            }

            // 格式化时间显示
            function formatTime(seconds) {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            }

            // 播放音乐
            function playMusic() {
                createAudioElement();
                
                audioElement.play().then(() => {
                    isPlaying = true;
                    updatePlayButtons(true);
                }).catch((error) => {
                    console.error('音频播放失败:', error);
                    alert('音频播放失败，请重试');
                });
            }
            
            function stopMusic() {
                if (audioElement) {
                    audioElement.pause();
                }
                
                isPlaying = false;
                updatePlayButtons(false);
            }

            // 更新播放按钮状态
            function updatePlayButtons(playing) {
                if (playing) {
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                    playIconPanel.style.display = 'none';
                    pauseIconPanel.style.display = 'block';
                    musicToggle.classList.add('playing');
                    playButtonPanel.classList.add('playing');
                } else {
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                    playIconPanel.style.display = 'block';
                    pauseIconPanel.style.display = 'none';
                    musicToggle.classList.remove('playing');
                    playButtonPanel.classList.remove('playing');
                }
            }
            
            // 播放/暂停切换
            function togglePlay() {
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
            }

            // 加载歌词
            async function loadLyrics() {
                try {
                    const response = await fetch('./assist/music/lyric.lrc');
                    const lrcText = await response.text();
                    lyricsData = parseLRC(lrcText);
                    displayLyrics();
                } catch (error) {
                    console.error('歌词加载失败:', error);
                    lyricsContainer.innerHTML = '<div class="lyrics-line">歌词加载失败</div>';
                }
            }

            // 解析LRC格式歌词
            function parseLRC(lrcText) {
                const lyrics = [];
                const lines = lrcText.split('\n');
                const seenTexts = new Set(); // 用于去重
                
                lines.forEach(line => {
                    // 匹配时间戳 [mm:ss.xxx] 或 [mm:ss]
                    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{3})\]/g;
                    let matches = [];
                    let match;
                    
                    // 获取所有时间戳
                    while ((match = timeRegex.exec(line)) !== null) {
                        matches.push({
                            minutes: parseInt(match[1]),
                            seconds: parseInt(match[2]),
                            milliseconds: parseInt(match[3])
                        });
                    }
                    
                    if (matches.length > 0) {
                        // 获取歌词文本（去除所有时间戳和空白符）
                        const text = line.replace(/\[\d{2}:\d{2}\.\d{3}\]/g, '').replace(/\s+\[00:00\.000\]/g, '').trim();
                        
                        if (text.length > 0 && !seenTexts.has(text)) {
                            seenTexts.add(text);
                            
                            // 使用第一个时间戳
                            const firstTime = matches[0];
                            const totalSeconds = firstTime.minutes * 60 + firstTime.seconds + firstTime.milliseconds / 1000;
                            
                            lyrics.push({
                                time: totalSeconds,
                                text: text
                            });
                        }
                    }
                });
                
                // 按时间排序并过滤重复
                return lyrics.sort((a, b) => a.time - b.time);
            }

            // 显示歌词
            function displayLyrics() {
                lyricsContainer.innerHTML = '';
                lyricsData.forEach((lyric, index) => {
                    const lyricElement = document.createElement('div');
                    lyricElement.className = 'lyrics-line';
                    lyricElement.textContent = lyric.text;
                    lyricElement.setAttribute('data-index', index);
                    lyricsContainer.appendChild(lyricElement);
                });
            }

            // 更新歌词高亮
            function updateLyrics(currentTime) {
                if (lyricsData.length === 0) return;

                let newCurrentIndex = -1;
                
                // 找到当前应该高亮的歌词
                for (let i = 0; i < lyricsData.length; i++) {
                    if (currentTime >= lyricsData[i].time) {
                        newCurrentIndex = i;
                    } else {
                        break;
                    }
                }

                // 如果当前歌词索引改变，更新高亮
                if (newCurrentIndex !== currentLyricIndex) {
                    // 清除之前的高亮
                    const allLines = lyricsContainer.querySelectorAll('.lyrics-line');
                    allLines.forEach((line, index) => {
                        line.classList.remove('current', 'past');
                        if (index < newCurrentIndex) {
                            line.classList.add('past');
                        } else if (index === newCurrentIndex) {
                            line.classList.add('current');
                        }
                    });

                    currentLyricIndex = newCurrentIndex;

                    // 滚动到当前歌词
                    if (newCurrentIndex >= 0) {
                        const currentLine = allLines[newCurrentIndex];
                        if (currentLine) {
                            currentLine.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                            });
                        }
                    }
                }
            }

            // 事件监听器
            musicToggle.addEventListener('click', togglePlay);
            playButtonPanel.addEventListener('click', togglePlay);
            
            // 展开/收起面板
            expandButton.addEventListener('click', () => {
                musicPanel.classList.toggle('active');
            });

            // 点击面板外部关闭
            document.addEventListener('click', (e) => {
                if (!musicPanel.contains(e.target) && !expandButton.contains(e.target) && !musicToggle.contains(e.target)) {
                    musicPanel.classList.remove('active');
                }
            });
            
            // 音量控制
            volumeSlider.addEventListener('input', (e) => {
                if (audioElement) {
                    audioElement.volume = e.target.value / 100;
                    volumeSliderPanel.value = e.target.value;
                }
            });

            volumeSliderPanel.addEventListener('input', (e) => {
                if (audioElement) {
                    audioElement.volume = e.target.value / 100;
                    volumeSlider.value = e.target.value;
                }
            });

            // 进度条控制
            progressBar.addEventListener('mousedown', () => {
                isDragging = true;
            });

            progressBar.addEventListener('mouseup', () => {
                isDragging = false;
                if (audioElement) {
                    audioElement.currentTime = progressBar.value;
                }
            });

            progressBar.addEventListener('input', (e) => {
                if (isDragging && audioElement) {
                    const seekTime = e.target.value;
                    currentTime.textContent = formatTime(seekTime);
                }
            });

            // 初始化
            loadLyrics();
        }