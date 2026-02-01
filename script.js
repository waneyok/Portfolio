// Улучшенная плавная прокрутка для навигационных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            // Плавная прокрутка с easing функцией
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800; // миллисекунды
            let start = null;
            
            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    // Обновляем активную ссылку после завершения прокрутки
                    updateActiveNavLink();
                }
            }
            
            requestAnimationFrame(animation);
            
            // Закрываем мобильное меню после клика
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.remove('active');
        }
    });
});

// Мобильное меню
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Закрытие меню при клике вне его области
document.addEventListener('click', (e) => {
    const isClickInsideMenu = navMenu.contains(e.target);
    const isClickOnToggle = menuToggle.contains(e.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// Изменение навбара при прокрутке
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Анимация счетчиков
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Intersection Observer для анимации счетчиков
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (!stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, target);
                }
            });
        }
    });
}, observerOptions);

// Наблюдаем за секцией "О себе"
const aboutSection = document.querySelector('.about-stats');
if (aboutSection) {
    observer.observe(aboutSection);
}

// Анимация появления элементов при прокрутке
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Применяем анимацию к карточкам
document.querySelectorAll('.method-card, .achievement-card, .about-card, .timeline-item, .gallery-item, .contact-item, .social-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// Анимация для социальных карточек
document.querySelectorAll('.social-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Параллакс эффект для фоновых элементов
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// Добавляем эффект наведения на карточки галереи
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(2deg)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Функция для обновления активной ссылки
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.pageYOffset + 150; // Смещение для более точного определения
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}` || (current === '' && href === '#home')) {
            link.classList.add('active');
        }
    });
}

// Активное состояние навигационных ссылок при прокрутке с throttling
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveNavLink();
            ticking = false;
        });
        ticking = true;
    }
});

// Обновляем активную ссылку при загрузке страницы
updateActiveNavLink();

// Плавное появление элементов при загрузке страницы
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Добавляем эффект "пульсации" для кнопок
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.animation = 'pulse 0.6s ease';
    });
    
    btn.addEventListener('animationend', function() {
        this.style.animation = '';
    });
});

// Добавляем CSS анимацию пульсации
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(pulseStyle);

// Улучшенная обработка ошибок
window.addEventListener('error', (e) => {
    console.error('Произошла ошибка:', e.error);
});

// Ленивая загрузка изображений (если будут добавлены реальные изображения)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== ЗАГРУЗКА ОТЗЫВОВ ИЗ GOOGLE SHEETS =====

// ВАЖНО: Замените на ID вашей Google Таблицы
// Ссылка на таблицу: https://docs.google.com/spreadsheets/d/ВАШ_ID_ТАБЛИЦЫ/edit
const SHEET_ID = '1s0dTA30qsS6hpB7T_jv65D07MQ3VT2VYjs73pboLsuk';
const SHEET_NAME = 'Sheet1'; // Имя листа (обычно "Sheet1" или "Лист1")

// Иконки для отзывов (выбираются случайно)
// const reviewIcons = ['👨‍👩‍👧‍👦', '👩', '👨', '👥', '👨‍👩‍👧', '👩‍👧', '👨‍👧', '💬'];
const reviewIcons = '💬';

// Получаем контейнер для отзывов
const reviewsGrid = document.getElementById('reviewsGrid');

// Функция для создания карточки отзыва
function createReviewCard(name, text) {
    const icon = reviewIcons[Math.floor(Math.random() * reviewIcons.length)];
    
    return `
        <div class="review-card">
            <div class="review-header">
                <div class="review-icon">${icon}</div>
                <div class="review-author">
                    <h4>${escapeHtml(name) || 'Аноним'}</h4>
                </div>
            </div>
            <div class="review-content">
                <p>${escapeHtml(text)}</p>
            </div>
            <div class="review-stars">⭐⭐⭐⭐⭐</div>
        </div>
    `;
}

// Функция для экранирования HTML (защита от XSS)
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Функция загрузки отзывов из Google Sheets
async function loadReviews() {
    if (!reviewsGrid) return;
    
    try {
        // URL для получения данных в формате JSON
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
        
        const response = await fetch(url);
        const text = await response.text();
        
        // Парсим ответ (Google возвращает JSONP)
        const jsonString = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
        if (!jsonString || !jsonString[1]) {
            throw new Error('Не удалось получить данные');
        }
        
        const data = JSON.parse(jsonString[1]);
        const rows = data.table.rows;
        
        if (rows.length === 0) {
            reviewsGrid.innerHTML = `
                <div class="no-reviews">
                    <p>🌟 Пока нет отзывов. Будьте первым!</p>
                </div>
            `;
            return;
        }
        
        // Генерируем HTML для всех отзывов (пропускаем заголовок если есть)
        let reviewsHTML = '';
        
        // Определяем индексы столбцов (предполагаем: 0 - timestamp, 1 - имя, 2 - отзыв)
        rows.forEach((row, index) => {
            if (row.c && row.c.length >= 2) {
                const name = row.c[1] ? row.c[1].v : 'Аноним';
                const text = row.c[2] ? row.c[2].v : '';
                
                if (text && text.trim()) {
                    reviewsHTML += createReviewCard(name, text);
                }
            }
        });
        
        if (reviewsHTML) {
            reviewsGrid.innerHTML = reviewsHTML;
        } else {
            reviewsGrid.innerHTML = `
                <div class="no-reviews">
                    <p>🌟 Пока нет отзывов. Будьте первым!</p>
                </div>
            `;
        }
        
        console.log(`✅ Загружено отзывов: ${rows.length}`);
        
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
        reviewsGrid.innerHTML = `
            <div class="reviews-error">
                <p>😔 Не удалось загрузить отзывы. Попробуйте позже.</p>
            </div>
        `;
    }
}

// Загружаем отзывы при загрузке страницы
if (reviewsGrid) {
    loadReviews();
}

console.log('🌼 Сайт-портфолио загружен успешно!');
