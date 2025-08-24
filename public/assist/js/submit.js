document.addEventListener('DOMContentLoaded', function() {
            const submitForm = document.getElementById('submitForm');
            const formMessage = document.getElementById('formMessage');
            const guideTitle = document.getElementById('guideTitle');
            const guideContent = document.getElementById('guideContent');
            const guideIcon = document.getElementById('guideIcon');
            const successModal = document.getElementById('successModal');
            const closeModal = document.querySelector('.close-modal');
            const closeButton = document.querySelector('.close-button');

            // 投稿须知折叠/展开功能
            guideTitle.addEventListener('click', function() {
                guideContent.classList.toggle('active');
                guideIcon.textContent = guideContent.classList.contains('active') ? '-' : '+';
            });

            // 关闭弹窗事件
            closeModal.addEventListener('click', function() {
                successModal.style.display = 'none';
            });

            closeButton.addEventListener('click', function() {
                successModal.style.display = 'none';
            });

            // 点击弹窗外部关闭
            window.addEventListener('click', function(event) {
                if (event.target === successModal) {
                    successModal.style.display = 'none';
                }
            });

            submitForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                // 获取表单数据
                const content = document.getElementById('content').value.trim();
                const category = document.getElementById('category').value;
                const author = document.getElementById('author').value.trim();
                const source = document.getElementById('source').value.trim();

                // 简单验证
                if (!content || content.length > 100) {
                    showMessage('请输入1-100字的一言内容', 'error');
                    return;
                }

                if (!category) {
                    showMessage('请选择分类', 'error');
                    return;
                }

                try {
                    // 发送投稿数据到API
                    const response = await fetch('https://alayrain.zhngjah.space:2096/api/hitokoto', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            content: content,
                            category: category,
                            author: author,
                            source: source
                        })
                    });

                    if (!response.ok) {
                        throw new Error('网络响应异常');
                    }

                    const data = await response.json();

                    if (data.code === 201) {  // 修改这里，将0改为201
                        // 强制显示弹窗，使用setTimeout确保DOM已经准备好
                        setTimeout(function() {
                            const modal = document.getElementById('successModal');
                            if (modal) {
                                modal.style.display = 'flex';
                                // 清空表单
                                submitForm.reset();
                                guideContent.classList.remove('active');
                                guideIcon.textContent = '+';
                            } else {
                                console.error('未找到弹窗元素');
                                showMessage('投稿成功！感谢您的贡献！', 'success');
                            }
                        }, 100);
                    } else {
                        showMessage(data.message || '投稿失败，请稍后重试', 'error');
                    }
                } catch (error) {
                    console.error('投稿失败:', error);
                    showMessage('投稿失败：' + error.message, 'error');
                }
            });

            function showMessage(message, type) {
                formMessage.textContent = message;
                formMessage.className = 'form-message ' + (type === 'success' ? 'success-message' : 'error-message');
                formMessage.style.display = 'block';

                // 3秒后隐藏消息
                setTimeout(function() {
                    formMessage.style.display = 'none';
                }, 3000);
            }
        });