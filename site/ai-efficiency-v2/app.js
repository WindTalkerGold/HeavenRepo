export const html = (strings, ...values) => {
    return String.raw({ raw: strings }, ...values);
};

class SlideDeck {
    constructor() {
        this.currentSlideIndex = 0;
        this.slides = [
            'page-1.js',
            'page-2.js',
            'page-3.js',
            'page-4.js',
            'page-5.js',
            'page-6.js',
            'page-7.js',
            'page-8.js',
            'page-9.js',
            'page-10.js',
            'page-11.js',
            'page-12.js',
            'page-13.js',
            'page-14.js',
            'page-15.js',
            'page-16.js',
            'page-17.js',
            'page-18.js'
        ];
        this.appElement = document.getElementById('app');
        this.init();
    }

    async init() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        const hash = window.location.hash.slice(1);
        const initialIndex = parseInt(hash, 10) - 1;
        if (!isNaN(initialIndex) && initialIndex >= 0 && initialIndex < this.slides.length) {
            this.currentSlideIndex = initialIndex;
        }

        await this.loadSlide(this.currentSlideIndex);
        this.appElement.classList.add('loaded');
        this.renderControls();
    }

    async loadSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        this.currentSlideIndex = index;
        const filename = this.slides[index];

        try {
            const module = await import(`./slides/${filename}?t=${Date.now()}`);
            const content = module.default;

            this.appElement.innerHTML = `<div class="slide-container">
                ${content}
                <div class="slide-number">${index + 1} / ${this.slides.length}</div>
            </div>`;

            if (module.onMount) {
                await module.onMount(this.appElement.querySelector('.slide-container'));
            }

            history.replaceState(null, null, `#${index + 1}`);
        } catch (error) {
            console.error(`Failed to load slide ${filename}:`, error);
            this.appElement.innerHTML = `<div class="error">Error loading slide ${index + 1}</div>`;
        }
    }

    handleKeydown(e) {
        const target = e.target;
        const isTyping = target instanceof HTMLElement && (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        );

        if (isTyping) return;

        if (e.key === 'ArrowRight' || e.key === ' ') {
            this.next();
        } else if (e.key === 'ArrowLeft') {
            this.prev();
        }
    }

    next() {
        if (this.currentSlideIndex < this.slides.length - 1) {
            this.loadSlide(this.currentSlideIndex + 1);
        }
    }

    prev() {
        if (this.currentSlideIndex > 0) {
            this.loadSlide(this.currentSlideIndex - 1);
        }
    }

    renderControls() {
        const controls = document.createElement('div');
        controls.className = 'controls';

        const homeBtn = document.createElement('button');
        homeBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;
        homeBtn.className = 'nav-btn';
        homeBtn.onclick = () => this.loadSlide(0);
        controls.appendChild(homeBtn);

        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`;
        prevBtn.className = 'nav-btn';
        prevBtn.onclick = () => this.prev();

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>`;
        nextBtn.className = 'nav-btn';
        nextBtn.onclick = () => this.next();

        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);
        document.body.appendChild(controls);
    }
}

new SlideDeck();
