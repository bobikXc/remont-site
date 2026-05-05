// Ждем полной загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    
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
            });
            
            document.addEventListener('touchmove', function(e) {
                if (isDragging) {
                    moveSlider(e.touches[0].clientX);
                }
            });
            
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
            consent.style.display = 'none';
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }
    
    // Запускаем всё
    initComparisonSliders();
    initCookieConsent();
    
    console.log('✅ Все скрипты загружены успешно');
    // ========== КНОПКА НАВЕРХ ==========
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    console.log('✅ Все скрипты загружены успешно');
});
});