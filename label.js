(function () {
    'use strict';

    const plugin = {
        name: 'UkrLabelAuto',
        version: '1.0',
        author: 'ChatGPT',
        init: function () {
            this.addCSS();
            this.observePosters();
        },

        // Додаємо CSS для мітки
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

        // Скануємо і додаємо мітки автоматично
        observePosters: function () {
            const self = this;

            // Функція для додавання мітки
            function addLabel(poster, filmData) {
                if (!poster || !filmData) return;
                if (poster.querySelector('.ukr-label')) return;

                // Перевірка на українську доріжку
                const hasUkr = (filmData.audio && filmData.audio.includes('uk')) ||
                               (filmData.language && filmData.language.includes('uk')) ||
                               (filmData.subtitles && filmData.subtitles.includes('uk'));

                if (!hasUkr) return;

                // Обгортка постера для позиціонування
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

            // Використовуємо MutationObserver для всіх нових постерів
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (!(node instanceof HTMLElement)) return;

                        // Шукаємо всі постери у новому елементі
                        const posters = node.querySelectorAll('img, .poster, .film-poster, .item-poster');
                        posters.forEach(poster => {
                            let filmData = poster.filmData || poster.dataset.film;

                            if (filmData) {
                                if (typeof filmData === 'string') {
                                    try { filmData = JSON.parse(filmData); } catch (e) { return; }
                                }
                                addLabel(poster, filmData);
                            }
                        });
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Початкове сканування
            const existingPosters = document.querySelectorAll('img, .poster, .film-poster, .item-poster');
            existingPosters.forEach(poster => {
                let filmData = poster.filmData || poster.dataset.film;
                if (filmData) {
                    if (typeof filmData === 'string') {
                        try { filmData = JSON.parse(filmData); } catch (e) { return; }
                    }
                    addLabel(poster, filmData);
                }
            });
        }
    };

    // Реєстрація плагіна у Лампі
    if (window.Lampa && Lampa.plugins) {
        Lampa.plugins.register(plugin);
    } else {
        console.error('Lampa не знайдено. Плагін UkrLabelAuto не активований.');
    }
})();