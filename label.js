(function () {
    'use strict';

    const plugin = {
        name: 'UkrLabelWorking',
        version: '1.0',
        author: 'ChatGPT',
        init: function () {
            this.addCSS();
            this.overrideRenderer();
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

        overrideRenderer: function () {
            // Перевизначаємо метод рендеру постера
            const original = Lampa.ControllerPoster.renderPoster;

            Lampa.ControllerPoster.renderPoster = function(poster, film) {
                const el = original.apply(this, arguments);

                if (film) {
                    const hasUkr = (film.audio && film.audio.includes('uk')) ||
                                   (film.subtitles && film.subtitles.includes('uk')) ||
                                   (film.language && film.language.includes('uk'));

                    if (hasUkr) {
                        // Обгортка постера
                        if (!el.parentNode.classList.contains('ukr-wrapper')) {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'ukr-wrapper';
                            el.parentNode.insertBefore(wrapper, el);
                            wrapper.appendChild(el);
                        }

                        // Додаємо мітку
                        if (!el.parentNode.querySelector('.ukr-label')) {
                            const label = document.createElement('div');
                            label.className = 'ukr-label';
                            label.textContent = 'UA';
                            el.parentNode.appendChild(label);
                        }
                    }
                }

                return el;
            };
        }
    };

    if (window.Lampa && Lampa.plugins) {
        Lampa.plugins.register(plugin);
        console.log('UkrLabelWorking плагін активований ✅');
    } else {
        console.error('Lampa не знайдено. Плагін UkrLabelWorking не активований.');
    }
})();
