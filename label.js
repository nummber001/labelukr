(function () {
    'use strict';

    const plugin = {
        name: 'UkrLabelReliable',
        version: '1.0',
        author: 'ChatGPT',
        init: function () {
            this.addCSS();
            this.observePosters();
        },

        addCSS: function () {
            const style = document.createElement('style');
            style.textContent = `
                .ukr-label {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background-color: #FFD700;
                    color: #000;
                    font-weight: bold;
                    padding: 2px 5px;
                    border-radius: 3px;
                    font-size: 12px;
                    z-index: 10;
                }
                .ukr-wrapper {
                    position: relative;
                    display: inline-block;
                }
            `;
            document.head.appendChild(style);
        },

        observePosters: function () {
            const self = this;

            function addLabel(poster) {
                if (!poster || poster.querySelector('.ukr-label')) return;

                // Беремо текстові атрибути, які часто містять info про доріжки
                const textData = (poster.alt || poster.title || poster.dataset.title || '').toLowerCase();

                // Перевірка на українську
                if (textData.includes('ukr') || textData.includes('ua') || textData.includes('українська')) {
                    // Обгортка постера
                    if (!poster.parentNode.classList.contains('ukr-wrapper')) {
                        const wrapper = document.createElement('div');
                        wrapper.className = 'ukr-wrapper';
                        poster.parentNode.insertBefore(wrapper, poster);
                        wrapper.appendChild(poster);
                    }

                    const label = document.createElement('div');
                    label.className = 'ukr-label';
                    label.textContent = 'UA';
                    poster.parentNode.appendChild(label);
                }
            }

            // Використовуємо MutationObserver для динамічних постерів
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (!(node instanceof HTMLElement)) return;

                        const posters = node.querySelectorAll('img, .poster, .film-poster, .item-poster');
                        posters.forEach(poster => addLabel(poster));
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Початкове сканування
            const existingPosters = document.querySelectorAll('img, .poster, .film-poster, .item-poster');
            existingPosters.forEach(poster => addLabel(poster));
        }
    };

    if (window.Lampa && Lampa.plugins) {
        Lampa.plugins.register(plugin);
        console.log('UkrLabelReliable плагін активований ✅');
    } else {
        console.error('Lampa не знайдено. Плагін UkrLabelReliable не активований.');
    }
})();
