'use strict';

(function() {
    /**
     * Конструктор InputFile
     * @param {Element} el
     * @param {Object} options
     * @constructor
     */
    var InputFile = function(el, options) {
        /**
         * Если передаваемый элемент отличен от input[type=file], то в указанном контейнере
         * ищем элементы с определенным [data-type], иначе создаем заглушки элементов.
         */
        if (el instanceof HTMLInputElement && el.getAttribute('type') === 'file') {
            /**
             * @type {HTMLInputElement}
             * @private
             */
            this._element = el;
            /**
             * @type {null|Element}
             * @private
             */
            this._clearButton = null;
            this._nameField = null;
            this._selectButton = null;
        } else {
            /**
             * @type {HTMLInputElement}
             * @private
             */
            this._container = el;
            /**
             * @type {Element|null}
             * @private
             */
            this._element = el.querySelector('input[type="file"]') || null;
            /**
             * @type {Element}
             * @private
             */
            this._clearButton = el.querySelector('[data-type="clear"]');
            this._nameField = el.querySelector('[data-type="name"]');
            this._selectButton = el.querySelector('[data-type="select"]');
        }

        /**
         * @type {string}
         * @private
         */
        this._className = options.customClass || this._element.getAttribute('data-class') || 'input-file';
        this._theme = options.theme || this._element.getAttribute('data-theme') || '';

        if (this._theme) {
            this._theme = ' ' + this._className + '_' + this._theme;
        }

        /**
         * @type {string}
         * @private
         */
        this._hiddenClass = options.hiddenClass || '_hidden';
        /**
         * @type {boolean}
         * @private
         */
        this._clearButtonVisible = options.clearButton || true;
        this._selectButtonHide = options.selectButtonHide || false;

        /**
         * @type {string}
         * @private
         */
        this._selectButtonText = options.selectButtonText || 'Выберите файл';
        this._clearButtonText = options.clearButtonText || 'x';
        /**
         * @type {string|null}
         * @private
         */
        this._clearButtonSVG = options.clearButtonSVG || null;

        this._onSelectButtonClick = this._onSelectButtonClick.bind(this);
        this._changeFileName = this._changeFileName.bind(this);
        if (this._clearButton) {
            this._onClearButtonClick = this._onClearButtonClick.bind(this);
        }

        /**
         * Инициализация.
         */
        this._create();
    };

    /**
     * Создание InputFile.
     * @private
     */
    InputFile.prototype._create = function() {
        if (this._container) {
            this._selectButton.addEventListener('click', this._onSelectButtonClick);
            this._container.className += this._className + this._theme;

            if (this._clearButtonVisible) {
                if (this._clearButton) {
                    this._clearButton.addEventListener('click', this._onClearButtonClick);
                }
            } else {
                if (this._clearButton) {
                    this._container.removeChild(this._clearButton);
                }
            }
        }

        if (!this._container && this._element) {
            /**
             * Создание обертки для input[type=file]
             * @type {Element}
             */
            var wrapper = document.createElement('div');

            this._element.style.display = 'none';

            wrapper.className = this._className + this._theme;
            wrapper.innerHTML = this._element.outerHTML;

            /**
             * Создание элемента выбора файла.
             * @type {Element}
             * @private
             */
            this._selectButton = document.createElement('div');
            this._selectButton.className = this._className + '__select';
            this._selectButton.textContent = this._selectButtonText;
            this._selectButton.addEventListener('click', this._onSelectButtonClick);
            wrapper.appendChild(this._selectButton);

            /**
             * Создание элемента для вывода названия файла.
             * @type {Element}
             * @private
             */
            this._nameField = document.createElement('div');
            this._nameField.className = this._className + '__name';
            wrapper.appendChild(this._nameField);

            /**
             * Создание элемента очистки файла, если задан options.clearButton(true)
             */
            if (this._clearButtonVisible && this._clearButton) {
                /**
                 * Если задан option.clearButtonSVG, создается svg элемент, с указаным use.
                 */
                if (this._clearButtonSVG) {
                    /**
                     * @type {string}
                     */
                    var svgNS = 'http://www.w3.org/2000/svg';
                    var xlinkNS = 'http://www.w3.org/1999/xlink';

                    this._clearButton = document.createElementNS(svgNS, 'svg');
                    /**
                     * @type {Element}
                     */
                    var icon = document.createElementNS(svgNS, 'use');
                    icon.setAttributeNS(xlinkNS, 'xlink:href', this._clearButtonSVG);
                    this._clearButton.appendChild(icon);
                } else {
                    this._clearButton = document.createElement('div');
                    this._clearButton.textContent = this._clearButtonText;
                }
                this._clearButton.addEventListener('click', this._onClearButtonClick);
                this._clearButton.setAttribute('class', this._className + '__clear ' + this._hiddenClass);
                wrapper.appendChild(this._clearButton);
            }

            this._element.parentNode.replaceChild(wrapper, this._element);
        }
    };

    /**
     * Очистка InputFile.
     * @private
     */
    InputFile.prototype._clear = function() {
        this._element.value = '';
        this._nameField.textContent = this._element.value;
        this._nameField.removeAttribute('title');
        this._toggleElementVisibility();
    };

    /**
     * Изменения названия InputFile.
     * @private
     */
    InputFile.prototype._changeFileName = function() {
        var fileNameList = '';
        Array.prototype.forEach.call(this._element.files, function(file, i) {
            if (i == 0) {
                fileNameList += file.name;
            } else {
                fileNameList += ', ' + file.name;
            }
        });
        this._nameField.textContent = fileNameList.trim();
        this._nameField.title = fileNameList.trim();
        this._toggleElementVisibility();
    };

    /**
     * Обработчик клика по элементу выбора файла.
     * @private
     */
    InputFile.prototype._onSelectButtonClick = function() {
        this._element.addEventListener('change', this._changeFileName);
        this._element.click();
    };

    /**
     * Обработчик клика по элементу очистки InputFile.
     * @private
     */
    InputFile.prototype._onClearButtonClick = function() {
        this._clear();
    };

    /**
     * Изменение видимости элементов после выбора файла.
     * @private
     */
    InputFile.prototype._toggleElementVisibility = function() {
        if (this._element.value) {
            if (this._selectButtonHide) {
                this._selectButton.className += ' ' + this._hiddenClass;
            }
            if (this._clearButton) {
                this._clearButton.setAttribute('class',
                    this._clearButton.getAttribute('class').replace(new RegExp(this._hiddenClass, 'g'), '').trim());
            }
        } else {
            if (this._selectButtonHide) {
                if (this._selectButton.className.search(this._hiddenClass) !== -1) {
                    this._selectButton.className = this._selectButton.className.replace(
                        new RegExp(this._hiddenClass, 'g'), '').trim();
                }
            }
            if (this._clearButton && this._clearButton.getAttribute('class').search(this._hiddenClass) === -1) {
                this._clearButton.setAttribute('class',
                    this._clearButton.getAttribute('class') + ' ' + this._hiddenClass);
            }
        }
    };

    window.InputFile = InputFile;
})();