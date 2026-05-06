// Ждем полной загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // ========== ЗАСТАВКА LINEA ==========
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        document.body.classList.add('splash-active');

        function hideSplash() {
            if (!splashScreen || splashScreen.classList.contains('hidden')) return;
            splashScreen.classList.add('hidden');
            document.body.classList.remove('splash-active');

            // Убираем элемент после анимации
            setTimeout(function() {
                splashScreen.remove();
            }, 800);
        }

        // Скрываем через 3 секунды
        const timer = setTimeout(hideSplash, 3000);

        // Возможность пропустить по клику или тапу
        splashScreen.addEventListener('click', function() {
            clearTimeout(timer);
            hideSplash();
        });
        splashScreen.addEventListener('touchstart', function(e) {
            e.preventDefault();
            clearTimeout(timer);
            hideSplash();
        }, { passive: false });
    }

    // ========== ПЛАВНОЕ ПОЯВЛЕНИЕ БЛОКОВ ==========
    function initScrollReveal() {
        const revealSelectors = [
            'section h2',
            '.client-type',
            '.card',
            '.stat-item',
            '.step',
            '.comparison-slider',
            '.contact-form .form',
            '.success-message',
            '.map-container',
            '.footer-col'
        ];
        const revealItems = document.querySelectorAll(revealSelectors.join(','));

        revealItems.forEach(function(item) {
            item.classList.add('reveal-on-scroll');
        });

        if (!('IntersectionObserver' in window)) {
            revealItems.forEach(function(item) {
                item.classList.add('is-visible');
            });
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px'
        });

        revealItems.forEach(function(item) {
            observer.observe(item);
        });
    }

    // ========== СЛАЙДЕР ДО/ПОСЛЕ ==========
    function initComparisonSliders() {
        const containers = document.querySelectorAll('.img-comp-container');

        containers.forEach(function(container) {
            const slider = container.querySelector('.img-comp-slider');
            const overlay = container.querySelector('.img-comp-overlay');

            if (!slider || !overlay) {
                console.error('Не найдены элементы слайдера');
                return;
            }

            let isDragging = false;

            function moveSlider(clientX) {
                const rect = container.getBoundingClientRect();
                let position = clientX - rect.left;

                if (position < 0) position = 0;
                if (position > rect.width) position = rect.width;

                const percent = (position / rect.width) * 100;

                overlay.style.width = percent + '%';
                slider.style.left = percent + '%';
            }

            // Для мыши
            container.addEventListener('mousedown', function(e) {
                isDragging = true;
                e.preventDefault();
            });

            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    moveSlider(e.clientX);
                }
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
            });

            // Для тачскрина
            container.addEventListener('touchstart', function(e) {
                isDragging = true;
                e.preventDefault();
            }, { passive: false });

            document.addEventListener('touchmove', function(e) {
                if (isDragging) {
                    moveSlider(e.touches[0].clientX);
                }
            }, { passive: true });

            document.addEventListener('touchend', function() {
                isDragging = false;
            });

            // Начальная позиция: середина
            const rect = container.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            moveSlider(startX);
        });
    }

    // ========== ФОРМА ==========
    const form = document.getElementById('estimateForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            form.style.display = 'none';
            const successMsg = document.getElementById('successMessage');
            if (successMsg) {
                successMsg.style.display = 'block';
                requestAnimationFrame(function() {
                    successMsg.classList.add('is-visible');
                });
            }
        });
    }

    // ========== КУКИ ==========
    function initCookieConsent() {
        if (localStorage.getItem('cookiesAccepted')) return;

        const consent = document.createElement('div');
        consent.className = 'cookie-consent';
        consent.innerHTML = `
            <div class="cookie-content">
                <p>🍪 Мы используем файлы cookie. Продолжая пользоваться сайтом, вы соглашаетесь с <a href="#">политикой конфиденциальности</a>.</p>
                <button class="btn cookie-btn">Хорошо</button>
            </div>
        `;

        document.body.appendChild(consent);

        consent.querySelector('.cookie-btn').addEventListener('click', function() {
            consent.style.transform = 'translateY(100%)';
            consent.style.opacity = '0';
            localStorage.setItem('cookiesAccepted', 'true');
            setTimeout(function() {
                consent.remove();
            }, 320);
        });
    }

    // ========== КНОПКА НАВЕРХ ==========
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            scrollTopBtn.classList.toggle('is-visible', window.scrollY > 500);
        }, { passive: true });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Запускаем всё
    initScrollReveal();
    initComparisonSliders();
    initCookieConsent();

    console.log('✅ Все скрипты загружены успешно');
});
