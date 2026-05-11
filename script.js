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
            '.estimate-calculator .calculator-layout',
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

    // ========== КАЛЬКУЛЯТОР РЕМОНТА ==========
    function initRenovationCalculator() {
        const calcForm = document.getElementById('renovationCalculatorForm');
        const areaInput = document.getElementById('calcArea');
        const areaOutput = document.getElementById('calcAreaOutput');
        const roomType = document.getElementById('calcRoomType');
        const finishClass = document.getElementById('calcFinishClass');
        const resultWrap = document.getElementById('calculatorResultWrap');
        const resultBox = document.getElementById('calculatorResult');
        const resultPrice = document.getElementById('calcResultPrice');
        const resultTerm = document.getElementById('calcResultTerm');
        const errRoom = document.getElementById('calcRoomTypeError');
        const errFinish = document.getElementById('calcFinishClassError');

        if (!calcForm || !areaInput || !roomType || !finishClass) return;

        const roomTypeErrorMsg = 'Выберите тип помещения';
        const finishClassErrorMsg = 'Выберите класс отделки';

        const timelineCoeff = {
            office: { k: 0.32, b: 22 },
            shop: { k: 0.26, b: 18 },
            restaurant: { k: 0.4, b: 26 },
            beauty: { k: 0.3, b: 20 },
            medical: { k: 0.36, b: 24 }
        };

        function finishDaysExtra(finishValue, areaVal) {
            if (finishValue === 'business') return 5;
            if (finishValue === 'premium') return Math.round(12 + areaVal * 0.02);
            return 0;
        }

        function syncAreaOutput() {
            const v = areaInput.value;
            areaOutput.textContent = Number(v).toLocaleString('ru-RU') + ' м²';
            areaInput.setAttribute('aria-valuenow', v);
        }

        areaInput.addEventListener('input', syncAreaOutput);
        syncAreaOutput();

        function clearFieldErrors() {
            roomType.classList.remove('calc-input-invalid');
            finishClass.classList.remove('calc-input-invalid');
            errRoom.textContent = '';
            errFinish.textContent = '';
        }

        function validate() {
            clearFieldErrors();
            let ok = true;
            if (!roomType.value) {
                roomType.classList.add('calc-input-invalid');
                errRoom.textContent = roomTypeErrorMsg;
                ok = false;
            }
            if (!finishClass.value) {
                finishClass.classList.add('calc-input-invalid');
                errFinish.textContent = finishClassErrorMsg;
                ok = false;
            }
            return ok;
        }

        roomType.addEventListener('change', function() {
            if (roomType.value) {
                roomType.classList.remove('calc-input-invalid');
                errRoom.textContent = '';
            }
        });
        finishClass.addEventListener('change', function() {
            if (finishClass.value) {
                finishClass.classList.remove('calc-input-invalid');
                errFinish.textContent = '';
            }
        });

        calcForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validate()) {
                if (resultWrap) {
                    resultWrap.hidden = true;
                    resultBox.classList.remove('calculator-result--visible');
                }
                const firstInvalid = calcForm.querySelector('.calc-input-invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const area = Number(areaInput.value);
            const selectedFinish = finishClass.selectedOptions[0];
            const basePerM2 = Number(selectedFinish.getAttribute('data-base')) || 0;

            let extrasPerM2 = 0;
            calcForm.querySelectorAll('input[name="extra"]:checked').forEach(function(cb) {
                extrasPerM2 += Number(cb.getAttribute('data-rate')) || 0;
            });

            const totalPerM2 = basePerM2 + extrasPerM2;
            const totalCost = area * totalPerM2;

            const coeff = timelineCoeff[roomType.value] || timelineCoeff.office;
            let days = Math.ceil(coeff.k * area + coeff.b);
            days += finishDaysExtra(finishClass.value, area);
            if (calcForm.querySelector('input[name="extra"][value="design"]:checked')) days += 14;
            if (calcForm.querySelector('input[name="extra"][value="engineering"]:checked')) days += 12;
            if (calcForm.querySelector('input[name="extra"][value="smart"]:checked')) days += 8;

            const formatted = Math.round(totalCost).toLocaleString('ru-RU');
            resultPrice.innerHTML = 'Примерная стоимость: <strong>' + formatted + ' ₽</strong>';
            resultTerm.textContent = 'Ориентировочный срок: от ' + days.toLocaleString('ru-RU') + ' рабочих дней';

            if (resultWrap) {
                resultWrap.hidden = false;
                resultBox.classList.remove('calculator-result--visible');
                void resultBox.offsetWidth;
                requestAnimationFrame(function() {
                    resultBox.classList.add('calculator-result--visible');
                });
            }
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
    initRenovationCalculator();
    initCookieConsent();

    console.log('✅ Все скрипты загружены успешно');
});
