function initLineaApp() {
    function storageGet(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function storageSet(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            /* приватный режим / запрет storage */
        }
    }

    // ========== ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ ==========
    function initSmoothAnchorLinks() {
        document.addEventListener('click', function(e) {
            var el = e.target;
            if (el && el.nodeType === 3) el = el.parentElement;
            if (!el || el.nodeType !== 1) return;
            var link = el.closest('a[href^="#"]');
            if (!link) return;
            var href = link.getAttribute('href') || '';
            if (href === '#' || href === '') {
                if (link.closest('.cookie-consent') || link.closest('.footer')) {
                    e.preventDefault();
                    return;
                }
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            if (href.length < 2) return;
            var id = decodeURIComponent(href.slice(1));
            var target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ========== МАСКА ТЕЛЕФОНА +7 (XXX) XXX-XX-XX ==========
    function initPhoneMask(input) {
        if (!input) return;

        function digitsFrom(value) {
            var d = String(value).replace(/\D/g, '');
            if (d.charAt(0) === '8') d = '7' + d.slice(1);
            if (d.charAt(0) === '9') d = '7' + d;
            if (d.charAt(0) !== '7') d = '7' + d.replace(/^7+/, '');
            return d.slice(0, 11);
        }

        function formatFromDigits(d) {
            var p = d.slice(1);
            var s = '+7';
            if (p.length > 0) s += ' (' + p.slice(0, 3);
            if (p.length > 3) s += ') ' + p.slice(3, 6);
            if (p.length > 6) s += '-' + p.slice(6, 8);
            if (p.length > 8) s += '-' + p.slice(8, 10);
            return s;
        }

        input.addEventListener('input', function() {
            input.value = formatFromDigits(digitsFrom(input.value));
        });

        input.addEventListener('focus', function() {
            if (!input.value.trim()) input.value = '+7 ';
        });

        input.addEventListener('blur', function() {
            if (digitsFrom(input.value).length <= 1) input.value = '';
        });
    }

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
        splashScreen.addEventListener('touchstart', function() {
            clearTimeout(timer);
            hideSplash();
        }, { passive: true });
    }

    // ========== ПЛАВНОЕ ПОЯВЛЕНИЕ БЛОКОВ ==========
    function initScrollReveal() {
        const revealSelectors = [
            'section h2',
            '.client-type',
            '.card',
            '.stat-item',
            '.step',
            '.portfolio-item',
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

    // ========== СЛАЙДЕР ДО/ПОСЛЕ (один набор обработчиков на document) ==========
    var lineaCompDrag = null;

    function bindDocumentComparisonHandlersOnce() {
        if (bindDocumentComparisonHandlersOnce.done) return;
        bindDocumentComparisonHandlersOnce.done = true;

        document.addEventListener('mousemove', function(e) {
            if (lineaCompDrag) lineaCompDrag.move(e.clientX);
        });

        document.addEventListener('mouseup', function() {
            lineaCompDrag = null;
        });

        document.addEventListener('touchmove', function(e) {
            if (lineaCompDrag && e.touches[0]) lineaCompDrag.move(e.touches[0].clientX);
        }, { passive: true });

        document.addEventListener('touchend', function() {
            lineaCompDrag = null;
        });
    }

    function centerComparisonSlider(container) {
        if (!container || container.dataset.lineaComp !== '1') return;
        var move = container._lineaMoveSlider;
        if (!move) return;
        var rect = container.getBoundingClientRect();
        if (rect.width < 4) return;
        move(rect.left + rect.width / 2);
    }

    function initComparisonSlider(container) {
        if (!container || container.dataset.lineaComp === '1') return;

        var slider = container.querySelector('.img-comp-slider');
        var overlay = container.querySelector('.img-comp-overlay');

        if (!slider || !overlay) {
            return;
        }

        container.dataset.lineaComp = '1';

        function moveSlider(clientX) {
            var rect = container.getBoundingClientRect();
            var w = rect.width;
            if (w < 1) return;

            var position = clientX - rect.left;
            if (position < 0) position = 0;
            if (position > w) position = w;

            var percent = (position / w) * 100;
            overlay.style.width = percent + '%';
            slider.style.left = percent + '%';
        }

        container._lineaMoveSlider = moveSlider;

        bindDocumentComparisonHandlersOnce();

        container.addEventListener('mousedown', function(e) {
            lineaCompDrag = { move: moveSlider };
            e.preventDefault();
        });

        container.addEventListener('touchstart', function(e) {
            lineaCompDrag = { move: moveSlider };
            e.preventDefault();
        }, { passive: false });

        centerComparisonSlider(container);
    }

    function initComparisonSliders(root) {
        var scope = root || document;
        scope.querySelectorAll('.img-comp-container').forEach(initComparisonSlider);
    }

    // ========== ГАЛЕРЕЯ ПОРТФОЛИО: ФИЛЬТРЫ ==========
    function initPortfolioGallery() {
        var grid = document.getElementById('portfolioGrid');
        if (!grid) return;

        var items = grid.querySelectorAll('.portfolio-item');
        var buttons = document.querySelectorAll('.portfolio-filter-btn');

        function itemMatches(filter, item) {
            var cat = item.getAttribute('data-category');
            if (filter === 'all') return true;
            if (cat === 'medical') return false;
            return cat === filter;
        }

        function applyFilter(filter) {
            items.forEach(function(item) {
                var match = itemMatches(filter, item);
                if (match) {
                    var wasHidden = item.hasAttribute('hidden');
                    item.removeAttribute('hidden');
                    item.classList.remove('portfolio-item--hide');
                    if (wasHidden) {
                        item.classList.remove('portfolio-item--show');
                        void item.offsetWidth;
                        item.classList.add('portfolio-item--show');
                    } else {
                        item.classList.add('portfolio-item--show');
                    }
                } else {
                    item.classList.remove('portfolio-item--show');
                    item.classList.add('portfolio-item--hide');
                }
            });

            window.setTimeout(function() {
                items.forEach(function(item) {
                    if (!itemMatches(filter, item)) {
                        item.setAttribute('hidden', '');
                        item.classList.remove('portfolio-item--hide');
                    }
                });
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        grid.querySelectorAll('.portfolio-item:not([hidden]) .img-comp-container').forEach(function(c) {
                            initComparisonSlider(c);
                            centerComparisonSlider(c);
                        });
                    });
                });
            }, 300);
        }

        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var f = btn.getAttribute('data-filter');
                if (!f) return;

                buttons.forEach(function(b) {
                    var on = b === btn;
                    b.classList.toggle('is-active', on);
                    b.setAttribute('aria-pressed', on ? 'true' : 'false');
                });

                applyFilter(f);
            });
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

        var calcSubmitBtn = calcForm.querySelector('.calc-submit');
        var calcSubmitBusy = false;

        calcForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (calcSubmitBusy) return;
            if (!validate()) {
                if (resultWrap) {
                    resultWrap.hidden = true;
                    resultBox.classList.remove('calculator-result--visible');
                }
                const firstInvalid = calcForm.querySelector('.calc-input-invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            calcSubmitBusy = true;
            if (calcSubmitBtn) calcSubmitBtn.disabled = true;

            try {
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
            } finally {
                calcSubmitBusy = false;
                if (calcSubmitBtn) calcSubmitBtn.disabled = false;
            }
        });
    }

    // ========== ФОРМА ОБРАТНОЙ СВЯЗИ ==========
    var form = document.getElementById('estimateForm');
    var formSubmitBtn = document.getElementById('estimateFormSubmit');
    var phoneInput = document.getElementById('contactPhone');
    if (phoneInput) initPhoneMask(phoneInput);

    if (form) {
        var formSent = false;

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (formSent) return;

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            var digits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
            if (digits.length < 11) {
                if (phoneInput) {
                    phoneInput.setCustomValidity('Введите полный номер в формате +7 (___) ___-__-__');
                    phoneInput.reportValidity();
                    phoneInput.setCustomValidity('');
                }
                return;
            }

            formSent = true;
            if (formSubmitBtn) {
                formSubmitBtn.disabled = true;
                formSubmitBtn.setAttribute('aria-busy', 'true');
            }

            form.style.display = 'none';
            var successMsg = document.getElementById('successMessage');
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
        if (storageGet('cookiesAccepted')) return;

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
            storageSet('cookiesAccepted', 'true');
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
    initSmoothAnchorLinks();
    initScrollReveal();
    initComparisonSliders(document.getElementById('portfolioGrid') || document);
    initPortfolioGallery();
    initRenovationCalculator();
    initCookieConsent();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLineaApp);
} else {
    initLineaApp();
}
