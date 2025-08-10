// Основной JS: плавная прокрутка, открытие модалки, мобильное меню и год в футере

document.addEventListener('DOMContentLoaded', () => {
    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e){
            const href = this.getAttribute('href');
            if(href && href.startsWith('#')){
                e.preventDefault();
                const el = document.querySelector(href);
                if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
            }
        });
    });

    // Открыть модалку "О нас"
    const aboutModal = document.getElementById('aboutModal');
    const openAboutBtn = document.getElementById('openAbout');
    const closeAboutBtn = document.getElementById('closeAbout');

    openAboutBtn?.addEventListener('click', () => {
        aboutModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        history.pushState({aboutOpen:true}, '', '#about-full');
    });

    closeAboutBtn?.addEventListener('click', closeAbout);
    aboutModal?.addEventListener('click', (e) => {
        if(e.target === aboutModal) closeAbout();
    });

    window.addEventListener('popstate', (e) => {
        // Если пользователь нажал назад — закрываем модалку
        if(!location.hash || location.hash !== '#about-full') closeAbout();
    });

    function closeAbout(){
        aboutModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if(location.hash === '#about-full') history.back();
    }

    // Burger / mobile menu
    window.toggleMobileMenu = function(btn){
        const menu = document.getElementById('mobileMenu');
        if(!menu) return;
        if(menu.classList.contains('active')){
            menu.classList.remove('active');
            if(btn) btn.setAttribute('aria-expanded','false');
        } else {
            menu.classList.add('active');
            if(btn) btn.setAttribute('aria-expanded','true');
        }
    }

    // Current year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Accessibility: close modal with Esc
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape'){
            const isOpen = aboutModal && aboutModal.getAttribute('aria-hidden') === 'false';
            if(isOpen) closeAbout();
        }
    });

    // Gallery: support drag-to-scroll on desktop
    const gallery = document.querySelector('.gallery');
    if(gallery){
        let isDown = false, startX, scrollLeft;
        gallery.addEventListener('mousedown', (e) => {
            isDown = true;
            gallery.classList.add('active');
            startX = e.pageX - gallery.offsetLeft;
            scrollLeft = gallery.scrollLeft;
        });
        gallery.addEventListener('mouseleave', () => { isDown = false; gallery.classList.remove('active'); });
        gallery.addEventListener('mouseup', () => { isDown = false; gallery.classList.remove('active'); });
        gallery.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - gallery.offsetLeft;
            const walk = (x - startX) * 1.5;
            gallery.scrollLeft = scrollLeft - walk;
        });
    }
});
