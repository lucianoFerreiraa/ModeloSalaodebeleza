// ============ CONFIGURAÇÃO PADRÃO ============
const defaultConfig = {
    brand_name: 'SUA LOGO AQUI!',
    hero_title: 'Realce sua beleza com <em class="font-script font-normal gold-gradient">especialistas</em> em excelência.',
    hero_subtitle: 'Agende seu horário em menos de 1 minuto.',
    cta_button: 'Agendar Meu Horário Agora',
    whatsapp_number: '5511999999999'
};

// Mensagem de captura de leads para web design
const leadCaptureMessage = 'Olá, quero um site assim para o meu negócio!';

// ============ ELEMENT SDK INIT ============
function applyConfig(cfg) {
    const brandName = cfg.brand_name || defaultConfig.brand_name;
    // Note: ID 'brand-name-el' was not found in the HTML provided, but maintained as per logic
    const brandNameEl = document.getElementById('brand-name-el');
    if (brandNameEl) brandNameEl.textContent = brandName;
    
    const brandFooterEl = document.getElementById('brand-footer-el');
    if (brandFooterEl) brandFooterEl.textContent = brandName;

    // Título principal - permite HTML simples para <em>
    const heroTitle = cfg.hero_title || defaultConfig.hero_title;
    const heroTitleEl = document.getElementById('hero-title-el');
    if (heroTitleEl) {
        if (heroTitle === defaultConfig.hero_title) {
            heroTitleEl.innerHTML = heroTitle;
        } else {
            heroTitleEl.textContent = heroTitle;
        }
    }

    const heroSubtitleEl = document.getElementById('hero-subtitle-el');
    if (heroSubtitleEl) heroSubtitleEl.textContent = cfg.hero_subtitle || defaultConfig.hero_subtitle;

    const ctaButtonEl = document.getElementById('cta-button-el');
    if (ctaButtonEl) ctaButtonEl.textContent = cfg.cta_button || defaultConfig.cta_button;

    const num = (cfg.whatsapp_number || defaultConfig.whatsapp_number).replace(/\D/g, '');
    const waUrl = `https://wa.me/${num}?text=${encodeURIComponent(leadCaptureMessage)}`;
    
    const whatsFloat = document.getElementById('whats-float');
    if (whatsFloat) whatsFloat.href = waUrl;
    
    const whatsBtnMain = document.getElementById('whats-btn-main');
    if (whatsBtnMain) whatsBtnMain.href = waUrl;
    
    const whatsFooter = document.getElementById('whats-footer');
    if (whatsFooter) whatsFooter.href = waUrl;
}

if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (config) => {
            applyConfig(config);
        },
        mapToCapabilities: () => ({
            recolorables: [],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
            ['brand_name', config.brand_name || defaultConfig.brand_name],
            ['hero_title', config.hero_title || defaultConfig.hero_title],
            ['hero_subtitle', config.hero_subtitle || defaultConfig.hero_subtitle],
            ['cta_button', config.cta_button || defaultConfig.cta_button],
            ['whatsapp_number', config.whatsapp_number || defaultConfig.whatsapp_number]
        ])
    });
}

// Aplicar valores padrão imediatamente
applyConfig(defaultConfig);

// ============ ÍCONES LUCIDE ============
lucide.createIcons();

// ============ ROLAGEM SUAVE ============
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ============ REDUÇÃO DO CABEÇALHO AO ROLAR ============
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// ============ FADE IN ON SCROLL ============
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ============ CALENDÁRIO ============
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
let currentDate = new Date();
let viewDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
let selectedDate = null;
let selectedTime = null;

function renderCalendar() {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const monthYearEl = document.getElementById('month-year');
    if (monthYearEl) monthYearEl.textContent = `${monthNames[m]} ${y}`;
    
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const todayStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
    const grid = document.getElementById('cal-days');
    
    if (!grid) return;
    grid.innerHTML = '';

    // Espaços vazios antes do primeiro dia
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const btn = document.createElement('button');
        btn.className = 'cal-day aspect-square rounded-md text-sm font-medium flex items-center justify-center';
        btn.textContent = d;
        const thisDate = new Date(y, m, d);
        const thisDateStr = `${y}-${m}-${d}`;
        const isPast = thisDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const isSunday = thisDate.getDay() === 0;

        if (isPast || isSunday) {
            btn.classList.add('disabled');
            btn.disabled = true;
        } else {
            btn.addEventListener('click', () => selectDate(y, m, d));
        }

        if (thisDateStr === todayStr) btn.classList.add('today');
        
        if (selectedDate && selectedDate.getFullYear() === y && selectedDate.getMonth() === m && selectedDate.getDate() === d) {
            btn.classList.add('selected');
        }
        grid.appendChild(btn);
    }
}

function selectDate(y, m, d) {
    selectedDate = new Date(y, m, d);
    renderCalendar();
    updateSelectedLabel();
    updateConfirmBtn();
    updateSummary();
}

function updateSelectedLabel() {
    const lbl = document.getElementById('selected-date-label');
    if (!lbl) return;
    if (selectedDate) {
        const dayName = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][selectedDate.getDay()];
        lbl.textContent = `${dayName}, ${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}`;
    } else {
        lbl.textContent = 'Selecione uma data';
    }
}

const prevMonthBtn = document.getElementById('prev-month');
if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
        const min = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        if (prev >= min) {
            viewDate = prev;
            renderCalendar();
        }
    });
}

const nextMonthBtn = document.getElementById('next-month');
if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        renderCalendar();
    });
}

// Intervalos de tempo
document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedTime = slot.dataset.time;
        updateConfirmBtn();
        updateSummary();
    });
});

function updateConfirmBtn() {
    const btn = document.getElementById('confirm-btn');
    if (!btn) return;
    if (selectedDate && selectedTime) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

function updateSummary() {
    const summary = document.getElementById('booking-summary');
    const txt = document.getElementById('summary-text');
    if (!summary || !txt) return;
    if (selectedDate && selectedTime) {
        const day = selectedDate.getDate();
        const month = monthNames[selectedDate.getMonth()];
        txt.textContent = `${day} de ${month} · ${selectedTime}`;
        summary.classList.remove('hidden');
    } else {
        summary.classList.add('hidden');
    }
}

// Botão de confirmação
const confirmBtn = document.getElementById('confirm-btn');
if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        if (!selectedDate || !selectedTime) return;
        const day = selectedDate.getDate();
        const month = monthNames[selectedDate.getMonth()];
        showToast(`Agendamento enviado para ${day}/${month} às ${selectedTime}!`);
    });
}

// Função Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// Cloudflare Challenge helper
(function() {
    function c() {
        var b = a.contentDocument || a.contentWindow.document;
        if (b) {
            var d = b.createElement('script');
            d.innerHTML = "window.__CF$cv$params={r:'9f38b856f6a1e2b5',t:'MTc3NzQwNzEyOC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
            b.getElementsByTagName('head')[0].appendChild(d)
        }
    }
    if (document.body) {
        var a = document.createElement('iframe');
        a.height = 1;
        a.width = 1;
        a.style.position = 'absolute';
        a.style.top = 0;
        a.style.left = 0;
        a.style.border = 'none';
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        if ('loading' !== document.readyState) c();
        else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c);
        else {
            var e = document.onreadystatechange || function() {};
            document.onreadystatechange = function(b) {
                e(b);
                'loading' !== document.readyState && (document.onreadystatechange = e, c())
            }
        }
    }

    (function() {
    const modal = document.getElementById('impulso-modal-container');
    const closeBtn = document.getElementById('impulso-close-x');

    // 1. Função para fechar
    function hideModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }

    // 2. Evento de Clique no Botão de Fechar
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hideModal();
        });
    }

    // 3. Lógica de Scroll (50%)
    window.addEventListener('scroll', function() {
        if (!sessionStorage.getItem('impulso_popup_done')) {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            let docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrollPercent = (scrollTop / docHeight) * 100;

            if (scrollPercent >= 50) {
                if (modal) {
                    modal.classList.add('active');
                    sessionStorage.setItem('impulso_popup_done', 'true');
                }
            }
        }
    });
})();
})();

// Renderização inicial
renderCalendar();
lucide.createIcons();