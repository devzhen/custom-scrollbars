(function () {

    this.CustomScrollbar = function (HTMLElement) {

        /*Проверка*/
        try {

            if (!HTMLElement || !document.body.contains(HTMLElement)) {
                return;
            }

        } catch (e) {

            return;
        }

        /*Если пользовательские полосы прокрутки назначаются для страницы*/
        if (HTMLElement === document ||
            HTMLElement === document.documentElement ||
            HTMLElement === document.body) {

            /*Если функция уже вызвана для страницы*/
            if (document.body.classList.contains('dg-custom-scrollbars')) {
                return;
            }

            /*Поставить маркер. что для страницы назначены пользовательские полосы прокрутки*/
            document.body.classList.add('dg-custom-scrollbars');

            var cs = new CustomScrollbarDocument();

        } else { /*Если пользовательские полосы прокрутки назначаются для html-элемента*/

            /*Если функция уже вызвана для html-элемента*/
            if (HTMLElement.classList.contains('dg-custom-scrollbars')) {
                return;
            }

            /*Поставить маркер. что для html-элемента назначены пользовательские полосы прокрутки*/
            HTMLElement.classList.add('dg-custom-scrollbars');

            cs = new CustomScrollbarElement(HTMLElement);
        }


        return {

            /**
             * Содать пользовательскую вертикальную полосу прокрутки
             */
            createYScrollbar: function () {

                cs.createYScrollbar();
            },

            /**
             * Удалить пользовательскую вертикальную полосу прокрутки
             */
            removeYScrollbar: function () {

                cs.removeYScrollbar();
            },

            /**
             * Содать пользовательскую горизонтальную полосу прокрутки
             */
            createXScrollbar: function () {

                cs.createXScrollbar();
            },

            /**
             * Удалить пользовательскую горизонтальную полосу прокрутки
             */
            removeXScrollbar: function () {

                cs.removeXScrollbar();
            },

            /**
             * Добавить CSS класс для вертикального ползунка.
             * @param className string. Название CSS класса.
             */
            setCssClassForVerticalSlider: function (className) {

                /*Проверка*/
                if (!className || typeof className !== "string" || !cs.ySlider) {
                    return;
                }

                /*Добавить CSS класс для ползунка*/
                cs.ySlider.divSlider.classList.add(className);
            },

            /**
             * Удалить CSS класс для вертикального ползунка.
             * @param className string. Название CSS класса.
             */
            removeCssClassForVerticalSlider: function (className) {

                /*Проверка*/
                if (!className || typeof className !== "string" || !cs.ySlider) {
                    return;
                }

                /*Удалить CSS класс для ползунка*/
                if (cs.ySlider.divSlider.classList.contains(className)) {
                    cs.ySlider.divSlider.classList.remove(className)
                }
            },

            /**
             * Добавить CSS класс для горизонтального ползунка.
             * @param className string. Название CSS класса.
             */
            setCssClassForHorizontalSlider: function (className) {

                /*Проверка*/
                if (!className || typeof className !== "string" || !cs.xSlider) {
                    return;
                }

                /*Добавить CSS класс для ползунка*/
                cs.ySlider.divSlider.classList.add(className);
            },

            /**
             * Удалить CSS класс для горизонтального ползунка.
             * @param className string. Название CSS класса.
             */
            removeCssClassForHorizontalSlider: function (className) {

                /*Проверка*/
                if (!className || typeof className !== "string" || !cs.xSlider) {
                    return;
                }

                /*Удалить CSS класс для ползунка*/
                if (cs.xSlider.divSlider.classList.contains(className)) {
                    cs.xSlider.divSlider.classList.remove(className)
                }
            },

            /**
             * Добавить атрибут id для вертикального ползунка.
             * @param id string. Имя атрибута id.
             */
            setIdForVerticalSlider: function (id) {

                /*Проверка*/
                if (!id || typeof id !== "string" || !cs.ySlider) {
                    return;
                }

                /*Добавить атрибут id для вертикального ползунка*/
                cs.ySlider.divSlider.id = id;

            },

            /**
             * Удалить атрибут id для вертикального ползунка.
             */
            removeIdForVerticalSlider: function () {

                /*Проверка*/
                if (!cs.ySlider || !cs.ySlider.divSlider.getAttribute('id')) {
                    return;
                }

                /*Удалить атрибут id для вертикального ползунка*/
                cs.ySlider.divSlider.removeAttribute('id');
            },

            /**
             * Добавить атрибут id для горизонтального ползунка.
             * @param id string. Имя атрибута id.
             */
            setIdForHorizontalSlider: function (id) {

                /*Проверка*/
                if (!id || typeof id !== "string" || !cs.xSlider) {
                    return;
                }

                /*Добавить атрибут id для горизонтального ползунка*/
                cs.xSlider.divSlider.id = id;
            },

            /**
             * Удалить атрибут id для горизонтального ползунка.
             */
            removeIdForHorizontalSlider: function () {

                /*Проверка*/
                if (!cs.xSlider || !cs.xSlider.divSlider.getAttribute('id')) {
                    return;
                }

                /*Удалить атрибут id для вертикального ползунка*/
                cs.xSlider.divSlider.removeAttribute('id');
            },
        };

    };


    /**************************************************
     custom-scrollbar-element.js
     **************************************************/
    /**
     * Пользовательские полосы прокрутки для html-элемента
     * @constructor
     */
    function CustomScrollbarElement(htmlElement) {

        if (!htmlElement) {
            return;
        }

        this.element = htmlElement;

        /*Запретить прокрутку элемента*/
        this.disableOverflow();

        /*Окружить элемент div-оберткой*/
        this.createWrapper();

        /*Прикрепить обработчик resize события*/
        this.attachResizeHandler();

        /*Пользовательская вертикальная полоса прокрутки*/
        if (this.element.scrollHeight > this.element.clientHeight) {
            this.createYScrollbar();
        }

        /*Пользовательская горизональная полоса прокрутки*/
        if (this.element.scrollWidth > this.element.clientWidth) {
            this.createXScrollbar();
        }

        /*Прикрепить обработчик scroll события*/
        this.attachScrollHandler();

        /*Прикрепить обработчик wheel события*/
        this.attachWheelHandler();

        /*Если данный элемент - textarea, то прикрепить обработчик input события*/
        if (this.element.tagName === 'TEXTAREA') {
            this.attachInputHandler();
        }

        /*Проверять, что html-элемент существует*/
        this.attachIsElementExistsHandler();
    }

    /**
     * СТАТИЧЕСКАЯ ПЕРЕМЕННАЯ
     * Минимальное количество пикселей, на которое будет прокручен элемент при возникновении wheel события
     * @type {number}
     */
    CustomScrollbarElement.WHEEL_PIXEL_STEP = 100;


    /**
     * Запретить прокрутку элемента
     */
    CustomScrollbarElement.prototype.disableOverflow = function () {

        /*Запретить прокрутку элемента*/
        this.element.classList.add('disable-y-overflow');
        this.element.classList.add('disable-x-overflow');

        /*Убрать css св-во outline*/
        this.element.classList.add('disable-outline');
    };


    /**
     * Создать div-обёртку вокруг элемента
     */
    CustomScrollbarElement.prototype.createWrapper = function () {

        /*Окружить элемент div-оберткой*/
        this.wrapper = document.createElement('div');
        this.element.parentElement.appendChild(this.wrapper);
        this.wrapper.classList.add('custom-wrapper');
        this.wrapper.appendChild(this.element);

        /*Установить ширину и высоту для обёртки*/
        this.wrapper.style.height = this.element.offsetHeight + 'px';
        this.wrapper.style.width = this.element.offsetWidth + 'px';

        /*Установить CSS св-во display для обёртки*/
        var display = getComputedStyle(this.element).display;
        if (display) {
            this.wrapper.style.display = display;
        }

    };


    /**
     * Удалить div-обёртку вокруг элемента
     */
    CustomScrollbarElement.prototype.removeWrapper = function () {

        /*Удалить элемент div-обертку*/
        this.wrapper.parentElement.removeChild(this.wrapper);

        this.wrapper = null;
    };


    /**
     * Создать пользовательскую вертикальную полосу прокрутки
     */
    CustomScrollbarElement.prototype.createYScrollbar = function () {

        if (this.ySlider) {
            return;
        }

        this.yRail = new yRail(this.wrapper);

        this.ySlider = new ySlider(this.yRail.getDivRail());
        this.ySlider.setTopPositionByElementsScrollTop(this.element);
        this.ySlider.attachResizeHandler(this.element);
        this.ySlider.attachClickHandler();
        this.ySlider.attachMouseDownHandler(this.element);

        /*Если существует горизонтальная полоса прокрутки - подкорректировать её ширину*/
        if (this.xSlider && this.xRail) {
            this.xRail.correctWidth(this.yRail.getWidth());
            this.xSlider.setLeftPositionByElementsScrollLeft(this.element);
        }
    };


    /**
     * Удалить пользовательскую вертикальную полосу прокрутки
     */
    CustomScrollbarElement.prototype.removeYScrollbar = function () {

        if (!this.ySlider) {
            return;
        }

        this.ySlider.detachMouseDownHandler();
        this.ySlider.detachClickHandler();
        this.ySlider.detachResizeHandler();
        this.ySlider.remove();
        this.ySlider = null;

        this.yRail.remove();
        this.yRail = null;

        if (this.xRail) {
            this.xRail.correctWidth('100%');
            this.xSlider.setLeftPositionByElementsScrollLeft(this.element);
        }
    };


    /**
     * Создать пользовательскую горизонтальную полосу прокрутки
     */
    CustomScrollbarElement.prototype.createXScrollbar = function () {

        if (this.xSlider) {
            return;
        }

        this.xRail = new xRail(this.wrapper);

        if (this.yRail) {

            var value = this.yRail.getWidth();

            this.xRail.correctWidth(value);
        }

        this.xSlider = new xSlider(this.xRail.getDivRail());
        this.xSlider.setLeftPositionByElementsScrollLeft(this.element);
        this.xSlider.attachResizeHandler(this.element);
        this.xSlider.attachClickHandler();
        this.xSlider.attachMouseDownHandler(this.element);
    };


    /**
     * Удалить пользовательскую вертикальную полосу прокрутки
     */
    CustomScrollbarElement.prototype.removeXScrollbar = function () {

        if (!this.xSlider) {
            return;
        }

        this.xSlider.detachMouseDownHandler();
        this.xSlider.detachClickHandler();
        this.xSlider.detachResizeHandler();
        this.xSlider.remove();
        this.xSlider = null;

        this.xRail.remove();
        this.xRail = null;
    };


    /**
     * Прикрепить обработчик resize события
     */
    CustomScrollbarElement.prototype.attachResizeHandler = function () {

        var self = this;

        self.resizeHandler = function () {

            /*Подкорректировать размеры div-обертки*/
            self.wrapper.style.height = self.element.offsetHeight + 'px';
            self.wrapper.style.width = self.element.offsetWidth + 'px';
        };

        window.addEventListener('resize', self.resizeHandler);
    };


    /**
     * Открепить обработчик resize события
     */
    CustomScrollbarElement.prototype.detachResizeHandler = function () {

        if (this.resizeHandler) {

            window.removeEventListener('resize', this.resizeHandler);

            this.resizeHandler = null;
        }
    };


    /**
     * Прикрепить обработчик scroll события
     */
    CustomScrollbarElement.prototype.attachScrollHandler = function () {

        var self = this;

        self.scrollHandler = function () {

            if (self.ySlider) {
                self.ySlider.setTopPositionByElementsScrollTop(self.element);
            }

            if (self.xSlider) {
                self.xSlider.setLeftPositionByElementsScrollLeft(self.element);
            }

        };

        self.element.addEventListener('scroll', self.scrollHandler);
    };


    /**
     * Открепить обработчик scroll события
     */
    CustomScrollbarElement.prototype.detachScrollHandler = function () {

        if (this.scrollHandler) {
            this.element.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
    };


    /**
     * Прикрепить обработчик input события
     */
    CustomScrollbarElement.prototype.attachInputHandler = function () {

        var self = this;

        self.inputHandler = function () {

            self.removeYScrollbar();
            if (self.element.scrollHeight > self.element.clientHeight) {

                self.createYScrollbar();
            }

            self.removeXScrollbar();
            if (self.element.scrollWidth > self.element.clientWidth) {

                self.createXScrollbar();
            }

        };

        self.element.addEventListener('input', self.inputHandler);
    };


    /**
     * Открепить обработчик input события
     */
    CustomScrollbarElement.prototype.detachInputHandler = function () {

        if (this.inputHandler) {

            this.element.addEventListener('input', this.inputHandler);

            this.inputHandler = null;
        }
    };


    /**
     * Прикрепить обработчик wheel события
     */
    CustomScrollbarElement.prototype.attachWheelHandler = function () {

        /*Обработчик wheel события*/
        this.wheelHandler = function (e) {

            e = e || window.event;

            /*Кол-во пикселей*/
            var delta = e.deltaY || e.detail || e.wheelDelta;

            /*Если браузер IE - есть нюансы*/
            if (e.type === 'mousewheel') {
                delta = -1 / 40 * delta;
            }

            /*Если колесико прокручено вниз*/
            if (delta >= 0) {

                delta = Math.max(delta, CustomScrollbarElement.WHEEL_PIXEL_STEP);

            } else {

                delta = Math.min(delta, CustomScrollbarElement.WHEEL_PIXEL_STEP * (-1));
            }

            /*Если существует вертикальная прокрутка*/
            if (this.ySlider) {
                this.element.scrollTop = this.element.scrollTop + delta;
                stopPropagation(e);
                event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            }

            /*Если не уществует вертикальная прокрутка, но есть горизонтальная прокрутка*/
            if (!this.ySlider && this.xSlider) {

                this.element.scrollLeft = this.element.scrollLeft + delta;
                stopPropagation(e);
                event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            }
        }.bind(this);

        /*Прикрепить обработчик*/
        if (this.element.addEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                this.element.addEventListener("wheel", this.wheelHandler);
            } else if ('onmousewheel' in document) {
                // устаревший вариант события
                this.element.addEventListener("mousewheel", this.wheelHandler);
            } else {
                // Firefox < 17
                this.element.addEventListener("MozMousePixelScroll", this.wheelHandler);
            }
        } else { // IE8-
            this.element.attachEvent("onmousewheel", this.wheelHandler);
        }

        /*Остановить всплытие события*/
        function stopPropagation(e) {

            /*e.originalEvent прийшлось сделать чтобы работало в IE
             if (e.originalEvent) {
             e = e.originalEvent
             }*/

            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.returnValue = false;
            }
        }
    };


    /**
     * Открепить обработчик wheel события
     */
    CustomScrollbarElement.prototype.detachWheelHandler = function () {

        if (this.wheelHandler) {

            if (this.element.removeEventListener) {

                if ('onwheel' in document) {
                    // IE9+, FF17+, Ch31+
                    this.element.removeEventListener("wheel", this.wheelHandler);
                } else if ('onmousewheel' in document) {
                    // устаревший вариант события
                    this.element.removeEventListener("mousewheel", this.wheelHandler);
                } else {
                    // Firefox < 17
                    this.element.removeEventListener("MozMousePixelScroll", this.wheelHandler);
                }
            } else { // IE8-
                this.element.detachEvent("onmousewheel", this.wheelHandler);
            }

            this.wheelHandler = null;
        }

    };


    /**
     * Проверка существования элемента
     */
    CustomScrollbarElement.prototype.attachIsElementExistsHandler = function () {

        var self = this;

        self.intervalId = setInterval(function () {

            /*Если елемент не существует на странице - удалить пользовательские scrollbars*/
            if (self.element.offsetWidth === 0 && self.element.offsetHeight === 0) {

                /*Удалить все обработчики событий и полосы прокрутки*/
                self.detachWheelHandler();
                self.detachResizeHandler();
                self.detachScrollHandler();
                self.detachInputHandler();
                self.removeYScrollbar();
                self.removeXScrollbar();
                self.removeWrapper();
                clearInterval(self.intervalId);
                self.intervalId = null;
                self.element = null;
            }

        }, 500);
    };


    /**************************************************
     custom-scrollbar-document.js
     **************************************************/
    /**
     * Пользовательские полосы прокрутки для страницы
     * @constructor
     */
    function CustomScrollbarDocument() {

        /*Запретить прокрутку*/
        this.disableOverflow();

        /*Высота страницы с учетом прокрутки*/
        var scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );

        /*Если есть вертикальная прокрутка*/
        if (scrollHeight > document.documentElement.clientHeight) {

            /*Создать вертикальную полосу прокрутки*/
            this.createYScrollbar();
        }

        /*Ширина страницы с учетом прокрутки*/
        var scrollWidth = Math.max(
            document.body.scrollWidth, document.documentElement.scrollWidth,
            document.body.offsetWidth, document.documentElement.offsetWidth,
            document.body.clientWidth, document.documentElement.clientWidth
        );

        /*Если есть горизонтальная прокрутка*/
        if (scrollWidth > document.documentElement.clientWidth) {

            /*Создать горизонтальную полосу прокрутки*/
            this.createXScrollbar();
        }

        /*Прикрепить обработчик resize события*/
        this.attachResizeHandler();

        /*Прикрепить обработчик wheel события*/
        this.attachWheelHandler();

        /*Прикрепить обработчик scroll события*/
        this.attachScrollHandler();
    }

    /**
     * СТАТИЧЕСКАЯ ПЕРЕМЕННАЯ
     * Минимальное количество пикселей, на которое будет прокручена страница при возникновении wheel события
     * @type {number}
     */
    CustomScrollbarDocument.WHEEL_PIXEL_STEP = 100;


    /**
     * СТАТИЧЕСКАЯ ПЕРЕМЕННАЯ
     * Срабатывает ли на данный момент событие scroll на каком-либо элементе кроме страницы
     * @type {boolean}
     */
    CustomScrollbarDocument.IS_SOMEBODY_SCROLLED_NOW = false;


    /**
     * Запрет прокрутки страницы
     */
    CustomScrollbarDocument.prototype.disableOverflow = function () {

        /*Запретить прокрутку документа*/
        document.body.classList.add('disable-y-overflow');
        document.body.classList.add('disable-x-overflow');

        /*Запретить прокрутку документа*/
        document.documentElement.classList.add('disable-y-overflow');
        document.documentElement.classList.add('disable-x-overflow');
    };


    /**
     * Создать пользовательскую вертикальную полосу прокрутки
     */
    CustomScrollbarDocument.prototype.createYScrollbar = function () {

        if (this.ySlider) {
            return;
        }

        this.yRail = new yRail(document.body);

        this.ySlider = new ySlider(this.yRail.getDivRail());
        this.ySlider.setTopPositionByElementsScrollTop(document.body);
        this.ySlider.attachResizeHandler(document.body);
        this.ySlider.attachClickHandler();
        this.ySlider.attachMouseDownHandler(document.body);

        /*Если существует горизонтальная полоса прокрутки - подкорректировать её ширину*/
        if (this.xSlider && this.xRail) {
            this.xRail.correctWidth(this.yRail.getWidth());
            this.xSlider.setLeftPositionByElementsScrollLeft(document.body);
        }
    };


    /**
     * Удалить пользовательскую вертикальную полосу прокрутки
     */
    CustomScrollbarDocument.prototype.removeYScrollbar = function () {

        if (!this.ySlider) {
            return;
        }

        this.ySlider.detachMouseDownHandler();
        this.ySlider.detachClickHandler();
        this.ySlider.detachResizeHandler();
        this.ySlider.remove();
        this.ySlider = null;

        this.yRail.remove();
        this.yRail = null;

        if (this.xRail) {
            this.xRail.correctWidth('100%');
            this.xSlider.setLeftPositionByElementsScrollLeft(document.body);
        }
    };


    /**
     * Создать пользовательскую горизонтальную полосу прокрутки
     */
    CustomScrollbarDocument.prototype.createXScrollbar = function () {

        if (this.xSlider) {
            return;
        }

        this.xRail = new xRail(document.body);

        if (this.yRail) {

            var value = this.yRail.getWidth();

            this.xRail.correctWidth(value);
        }

        this.xSlider = new xSlider(this.xRail.getDivRail());
        this.xSlider.setLeftPositionByElementsScrollLeft(document.body);
        this.xSlider.attachResizeHandler(document.body);
        this.xSlider.attachClickHandler();
        this.xSlider.attachMouseDownHandler(document.body);
    };


    /**
     * Удалить пользовательскую горизонтальную полосу прокрутки
     */
    CustomScrollbarDocument.prototype.removeXScrollbar = function () {

        if (!this.xSlider) {
            return;
        }

        this.xSlider.detachMouseDownHandler();
        this.xSlider.detachClickHandler();
        this.xSlider.detachResizeHandler();
        this.xSlider.remove();
        this.xSlider = null;

        this.xRail.remove();
        this.xRail = null;
    };


    /**
     * Прикрепить обработчик resize события
     */
    CustomScrollbarDocument.prototype.attachResizeHandler = function () {

        this.resizeHandler = (function () {

            /*Если существует ползунок вертикальной прокрутки*/
            if (this.ySlider) {
                this.ySlider.setTopPositionByElementsScrollTop(document.body);
            }

            /*Если существуют направляющие*/
            if (this.xRail && this.yRail) {

                this.xRail.correctWidth(this.yRail.getWidth());

            } else if (this.xRail && !this.yRail) {

                this.xRail.correctWidth('100%');
            }

            /*Если существует ползунок горизонтальной прокрутки*/
            if (this.xSlider) {
                this.xSlider.setLeftPositionByElementsScrollLeft(document.body);
            }

        }).bind(this);

        window.addEventListener('resize', this.resizeHandler);
    };


    /**
     * Открепить обработчик resize события
     */
    CustomScrollbarDocument.prototype.detachResizeHandler = function () {

        if (this.resizeHandler) {

            window.removeEventListener('resize', this.resizeHandler);

            this.resizeHandler = null;
        }

    };


    /**
     * Прикрепить обработчик wheel события
     */
    CustomScrollbarDocument.prototype.attachWheelHandler = function () {

        var self = this;

        this.wheelHandler = (function (e) {

            e = e || window.event;

            var delta = e.deltaY || e.detail || e.wheelDelta;

            /*Если браузер IE - есть нюансы*/
            if (e.type === 'mousewheel') {
                delta = -1 / 40 * delta;
            }

            /*Если прокручивается колесико мыши над страница*/
            if (e.target === document || e.target === document.body || e.target === document.documentElement) {

                /*
                 Установить конствнту IS_SOMEBODY_SCROLLED_NOW в false, это означает,
                 что, в данный момент, ни один html элемент не прокручивается
                 */
                CustomScrollbarDocument.IS_SOMEBODY_SCROLLED_NOW = false;
            }

            /*Если прокручивается колесико мыши над html-элементом, но он не имеет прокрутки*/
            if (e.target.scrollHeight <= e.target.clientHeight) {

                /*
                 Установить конствнту IS_SOMEBODY_SCROLLED_NOW в false, это означает,
                 что, в данный момент, ни один html элемент не прокручивается
                 */
                CustomScrollbarDocument.IS_SOMEBODY_SCROLLED_NOW = false;
            }

            setTimeout(function () {

                /*Только если в данный момент не прокручивается какой-либо html-элемент*/
                if (CustomScrollbarDocument.IS_SOMEBODY_SCROLLED_NOW === false) {

                    /*Если прокрутка вниз*/
                    if (delta >= 0) {

                        delta = Math.max(delta, CustomScrollbarDocument.WHEEL_PIXEL_STEP);

                    } else { /*Если прокрутка вверх*/

                        delta = Math.min(delta, CustomScrollbarDocument.WHEEL_PIXEL_STEP * (-1));
                    }

                    /*Если есть слайдер вертикальной прокрутки на странице*/
                    if (self.ySlider) {

                        /*Прокрутить страницу по оси Y*/
                        window.scrollBy(0, delta);
                    }

                    /*Если нет слайдера вертикальной прокрутки, но есть слайдер горизонтальной прокрутки на странице*/
                    if (!self.ySlider && self.xSlider) {

                        /*Прокрутить страницу по оси X*/
                        window.scrollBy(delta, 0);
                    }
                }
            }, 100);

        }).bind(this);


        if (document.addEventListener) {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                document.addEventListener("wheel", this.wheelHandler);
            } else if ('onmousewheel' in document) {
                // устаревший вариант события
                document.addEventListener("mousewheel", this.wheelHandler);
            } else {
                // Firefox < 17
                document.addEventListener("MozMousePixelScroll", this.wheelHandler);
            }
        } else { // IE8-
            document.attachEvent("onmousewheel", this.wheelHandler);
        }
    };


    /**
     * Открепить обработчик wheel события
     */
    CustomScrollbarDocument.prototype.detachWheelHandler = function () {

        if (this.wheelHandler) {

            if (this.element.removeEventListener) {

                if ('onwheel' in document) {
                    // IE9+, FF17+, Ch31+
                    this.element.removeEventListener("wheel", this.wheelHandler);
                } else if ('onmousewheel' in document) {
                    // устаревший вариант события
                    this.element.removeEventListener("mousewheel", this.wheelHandler);
                } else {
                    // Firefox < 17
                    this.element.removeEventListener("MozMousePixelScroll", this.wheelHandler);
                }
            } else { // IE8-
                this.element.detachEvent("onmousewheel", this.wheelHandler);
            }

            this.wheelHandler = null;
        }
    };


    /**
     * Прикрепить обработчик scroll события
     */
    CustomScrollbarDocument.prototype.attachScrollHandler = function () {

        /*Обработчик scroll события - установка положения слайдеров прокрутки*/
        this.firstScrollHandler = (function () {

            if (this.ySlider) {

                /*Установить позицию Y слайдера в зависимости от scrollTop страницы*/
                this.ySlider.setTopPositionByElementsScrollTop(document.body);
            }

            if (this.xSlider) {

                /*Установить позицию X слайдера в зависимости от scrollLeft страницы*/
                this.xSlider.setLeftPositionByElementsScrollLeft(document.body);
            }

        }).bind(this);


        /*Обработчик scroll события - определение, прокручивается ли в данный момент какой-либо элемент*/
        this.secondScrollHandler = function (e) {

            /*Если прокручивается страница*/
            if (e.target === document || e.target === document.body || e.target === document.documentElement) {

                /*
                 Установить конствнту IS_SOMEBODY_SCROLLED_NOW в false, это означает,
                 что, в данный момент, ни один html элемент не прокручивается
                 */
                CustomScrollbarDocument.IS_SOMEBODY_SCROLLED_NOW = false;
                return;
            }

            /*Если прокручивается html-элемент и он полностью прокручен вверх или вниз*/
            if (e.target.scrollTop === e.target.scrollHeight - e.target.clientHeight ||
                e.target.scrollTop === 0) {

                /*
                 Установить конствнту IS_SOMEBODY_SCROLLED_NOW в false, это означает,
                 что, в данный момент, ни один html элемент не прокручивается
                 */
                CustomScrollbarDocument.IS_SOMEBODY_SCROLLED_NOW = false;
                return;
            }

            /*
             Установить конствнту IS_SOMEBODY_SCROLLED_NOW в true, это означает,
             что, в данный момент, прокручивается какой-либо html элемент
             */
            CustomScrollbarDocument.IS_SOMEBODY_SCROLLED_NOW = true;

        };

        document.addEventListener('scroll', this.firstScrollHandler);
        document.addEventListener('scroll', this.secondScrollHandler, true);
    };


    /**
     * Открепить обработчик scroll события
     */
    CustomScrollbarDocument.prototype.detachScrollHandler = function () {


        /*Удаление обработчиков*/
        if (this.firstScrollHandler) {
            document.removeEventListener('scroll', this.firstScrollHandler);
            this.firstScrollHandler = null;

        }

        if (this.secondScrollHandler) {
            document.removeEventListener('scroll', this.secondScrollHandler);
            this.secondScrollHandler = null;
        }
    };


    /**************************************************
     rail.js
     **************************************************/
    /**
     * Направляющая для ползунка прокрутки
     * @param railParent HTMLElement. Родительский элемент для направляющей
     * @constructor
     */
    function Rail(railParent) {

        if (!railParent) {
            return;
        }

        this.parent = railParent;

        this.create();
    }

    /**
     * Создать div-направляющую для ползунка прокрутки
     */
    Rail.prototype.create = function () {

        /*Создание div - направляющая для ползунка*/
        this.divRail = document.createElement('div');
        this.parent.appendChild(this.divRail);

        /*Назначить обработчик click события для направляющей для ползунка*/
        this.divRail.addEventListener('click', clickHandler);
    };


    /**
     * Удалить div-направляющую для ползунка прокрутки
     */
    Rail.prototype.remove = function () {

        if (!this.divRail) {
            return;
        }

        /*Удаление div - направляющая для ползунка*/
        this.parent.removeChild(this.divRail);

        /*Удалить обработчик click события для направляющей для ползунка*/
        this.divRail.removeEventListener('click', clickHandler);

        this.divRail = null;
        this.parent = null;
    };


    /**
     * Вернуть =iv-направляющую
     * @return {HTMLElement}
     */
    Rail.prototype.getDivRail = function () {

        return this.divRail;
    };


    /**
     * Вернуть ширину div-направляющей
     * @return {number}
     */
    Rail.prototype.getWidth = function () {

        return this.divRail.offsetWidth;
    };

    function clickHandler(event) {
        event.preventDefault();
    }


    /**************************************************
     x-rail.js
     **************************************************/
    xRail.prototype = Object.create(Rail.prototype);
    xRail.prototype.constructor = xRail;

    /**
     * Направляющая для ползунка горизонтальной прокрутки
     * @constructor
     */
    function xRail() {

        /*Вызов конструктора родителя*/
        Rail.apply(this, arguments);

        /*Если направляющая ползунка создается для всего документа*/
        if (this.parent === document ||
            this.parent === document.documentElement ||
            this.parent === document.body) {

            this.divRail.classList.add('custom-x-rail-document');

        } else {

            this.divRail.classList.add('custom-x-rail');
        }

    }

    /**
     * Подкорректировать ширину горизонтальной направляющей.
     * Метод вызывается при создании | удалениии вертикальной направляющей
     * @param value. Number or String.
     */
    xRail.prototype.correctWidth = function (value) {

        if (typeof value === 'string' && value.search(/%/) !== -1) {

            this.divRail.style.width = value;
        }

        if (typeof value === 'number') {

            this.divRail.style.width = '100%';
            this.divRail.style.width = this.divRail.offsetWidth - value + 'px';
        }
    };


    /**************************************************
     y-rail.js
     **************************************************/
    yRail.prototype = Object.create(Rail.prototype);
    yRail.prototype.constructor = yRail;

    /**
     * Направляющая для ползунка вертикальной прокрутки
     * @constructor
     */
    function yRail() {

        /*Вызов конструктора родителя*/
        Rail.apply(this, arguments);

        /*Если направляющая ползунка создается для всего документа*/
        if (this.parent === document ||
            this.parent === document.documentElement ||
            this.parent === document.body) {

            this.divRail.classList.add('custom-y-rail-document');

        } else {

            this.divRail.classList.add('custom-y-rail');
        }
    }


    /**************************************************
     slider.js
     **************************************************/
    /**
     * Ползунок прокрутки
     * @param sliderParent HTMLElement. Родительский элемент для ползунка
     * @constructor
     */
    function Slider(sliderParent) {

        this.parent = sliderParent;
    }


    /**
     * Создать ползунок прокрутки
     */
    Slider.prototype.create = function () {

        /*Создание div слайдера*/
        var div = document.createElement('div');
        this.divSlider = this.parent.appendChild(div);
    };


    /**
     * Удалить ползунок прокрутки
     */
    Slider.prototype.remove = function () {

        if (!this.divSlider) {
            return;
        }

        this.parent.removeChild(this.divSlider);

        this.resizeHandler = null;

        this.divSlider = null;
    };


    /**
     * Получени координат элемента относительно страницы.
     * @param HTMLElement
     * @return {{top: number, left: number}}
     */
    Slider.prototype.getCoords = function (HTMLElement) {

        var box = HTMLElement.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return {
            top: top,
            left: left
        };
    };


    /**
     * Прикрепить обработчик click события
     */
    Slider.prototype.attachClickHandler = function () {

        if (!this.divSlider) {
            return;
        }

        this.clickHandler = function (event) {
            event.preventDefault();
        };

        this.divSlider.addEventListener('click', this.clickHandler);
    };


    /**
     * Открепить обработчик click события
     */
    Slider.prototype.detachClickHandler = function () {

        if (!this.divSlider) {
            return;
        }

        this.divSlider.removeEventListener('click', this.clickHandler);

        this.clickHandler = null;
    };


    /**************************************************
     x-slider.js
     **************************************************/
    xSlider.prototype = Object.create(Slider.prototype);
    xSlider.prototype.constructor = xSlider;

    /**
     * Ползунок горизонтальной прокрутки
     */
    function xSlider() {

        /*Вызов конструктора родителя*/
        Slider.apply(this, arguments);

        /*Создать div горизонтального ползунка*/
        this.create();

        this.divSlider.classList.add('custom-x-slider');
    }

    /**
     * Установить позицию горизонтального ползунка, исходя из горизонтальной прокрутки элемента.
     * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена горизонтальная полоса прокрутки
     */
    xSlider.prototype.setLeftPositionByElementsScrollLeft = function (HTMLElement) {

        if (!this.divSlider) {
            return;
        }

        /*Если ползунок создается для всего документа*/
        if (HTMLElement === document ||
            HTMLElement === document.documentElement ||
            HTMLElement === document.body) {

            /*Определение ширины документа с учетом прокрутки*/
            var scrollWidth = Math.max(
                document.body.scrollWidth, document.documentElement.scrollWidth,
                document.body.offsetWidth, document.documentElement.offsetWidth,
                document.body.clientWidth, document.documentElement.clientWidth
            );

            /*Определение прокрутки по оси X документа*/
            var scrollLeft = document.documentElement.scrollLeft || document.body && document.body.scrollLeft || 0;
            scrollLeft -= document.documentElement.clientLeft; // в IE7- <html> смещён относительно (0,0)


        } else {

            /*Определение ширины элемента с учетом прокрутки*/
            scrollWidth = HTMLElement.scrollWidth;

            /*Определение прокрутки по оси X элемента*/
            scrollLeft = HTMLElement.scrollLeft;

        }

        /*Определение высоты ползунка динамически, исходя из полной ширины элемента*/
        var parts = scrollWidth / this.parent.clientWidth;
        var sliderWidth = this.parent.clientWidth / parts;
        this.divSlider.style.width = sliderWidth + 'px';

        /*Масштаб по оси X*/
        var scaleX = this.parent.clientWidth / scrollWidth;

        /*Вычисление значения left для ползунка*/
        this.divSlider.style.left = scrollLeft * scaleX + 'px';
    };


    /**
     * Прикрепить обработчик draggable ползунка.
     * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена горизонтальная полоса прокрутки
     */
    xSlider.prototype.attachMouseDownHandler = function (HTMLElement) {

        if (!this.divSlider) {
            return;
        }

        var self = this;

        this.mouseDownHandler = (function (e) {

            /*Координаты горизонтального ползунка*/
            var coords = self.getCoords(self.divSlider);

            /*Смещение курсора*/
            var shiftX = e.pageX - coords.left;

            /*Если ползунок создается для всего документа*/
            if (HTMLElement === document ||
                HTMLElement === document.documentElement ||
                HTMLElement === document.body) {

                /*Ползунок создается для всего документа*/
                var isDocument = true;

                /*Определение ширины документа с учетом прокрутки*/
                var scrollWidth = Math.max(
                    document.body.scrollWidth, document.documentElement.scrollWidth,
                    document.body.offsetWidth, document.documentElement.offsetWidth,
                    document.body.clientWidth, document.documentElement.clientWidth
                );

                /*Определение прокрутки по оси X документа*/
                var scrollLeft = document.documentElement.scrollLeft || document.body && document.body.scrollLeft || 0;
                scrollLeft -= document.documentElement.clientLeft; // в IE7- <html> смещён относительно (0,0)

                /*Определение прокрутки по оси Y документа*/
                var scrollTop = document.documentElement.scrollTop || document.body && document.body.scrollTop || 0;
                scrollTop -= document.documentElement.clientTop; // в IE7- <html> смещён относительно (0,0)

            } else {

                /*Ползунок создается для html-элемента*/
                isDocument = false;

                /*Определение ширины документа с учетом элемента*/
                scrollWidth = HTMLElement.scrollWidth;

                /*Определение прокрутки по оси X элемента*/
                scrollLeft = HTMLElement.scrollLeft;

            }

            /*Масштаб по оси X*/
            var scaleX = self.parent.clientWidth / scrollWidth;

            /*Запретить выделение текста*/
            document.body.classList.add('disable-select');

            document.onmousemove = function (e) {

                /*Переместить ползунок*/
                self.divSlider.style.left = e.pageX - shiftX - self.getCoords(self.divSlider.parentElement).left + 'px';

                /*Проверить левую позицию ползунка*/
                if (self.divSlider.offsetLeft <= 0) {
                    self.divSlider.style.left = 0;
                }

                /*Проверить правую позицию ползунка*/
                if (self.divSlider.offsetLeft + self.divSlider.offsetWidth >= self.parent.offsetWidth) {
                    self.divSlider.style.left = self.parent.offsetWidth - self.divSlider.offsetWidth + 'px';
                }

                /*Прокрутить страницу или элемент*/
                if (isDocument) {

                    /*Вычисление значения scrollLeft для документа*/
                    window.scrollTo(self.divSlider.offsetLeft / scaleX, scrollTop);

                } else {

                    /*Вычисление значения scrollLeft для элемента*/
                    HTMLElement.scrollLeft = self.divSlider.offsetLeft / scaleX;
                }

            };

            document.onmouseup = function (e) {

                document.onmousemove = null;
                document.onmouseup = null;

                /*Снять запрет на выделение текста*/
                document.body.classList.remove('disable-select');
            };

        }).bind(this);

        this.divSlider.addEventListener('mousedown', this.mouseDownHandler);
    };


    /**
     * Открепить обработчик draggable ползунка.
     */
    xSlider.prototype.detachMouseDownHandler = function () {

        if (!this.divSlider) {
            return;
        }

        this.divSlider.removeEventListener('mousedown', this.mouseDownHandler);

        this.mouseDownHandler = null;
    };


    /**
     * Прикрепить обработчик resize события.
     * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена горизонтальная полоса прокрутки
     */
    xSlider.prototype.attachResizeHandler = function (HTMLElement) {

        /*Обработчик resize события*/
        this.resizeHandler = (function () {
            this.setLeftPositionByElementsScrollLeft(HTMLElement);
        }).bind(this);

        window.addEventListener('resize', this.resizeHandler);
    };


    /**
     * Открепить обработчик resize события.
     */
    xSlider.prototype.detachResizeHandler = function () {

        window.removeEventListener('resize', this.resizeHandler);

        this.resizeHandler = null;
    };


    /**************************************************
     y-slider.js
     **************************************************/
    ySlider.prototype = Object.create(Slider.prototype);
    ySlider.prototype.constructor = ySlider;

    /**
     * Ползунок вертикальной прокрутки
     */
    function ySlider() {

        /*Вызов конструктора родителя*/
        Slider.apply(this, arguments);

        /*Создать div вертикального ползунка*/
        this.create();

        this.divSlider.classList.add('custom-y-slider');
    }

    /**
     * Установить позицию вертикального ползунка, исходя из вертикальной прокрутки элемента.
     * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена вертикальная полоса прокрутки
     */
    ySlider.prototype.setTopPositionByElementsScrollTop = function (HTMLElement) {

        if (!this.divSlider) {
            return;
        }

        /*Если ползунок создается для всего документа*/
        if (HTMLElement === document ||
            HTMLElement === document.documentElement ||
            HTMLElement === document.body) {

            /*Определение высоты документа с учетом прокрутки*/
            var scrollHeight = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
            );

            /*Определение прокрутки по оси Y документа*/
            var scrollTop = document.documentElement.scrollTop || document.body && document.body.scrollTop || 0;
            scrollTop -= document.documentElement.clientTop; // в IE7- <html> смещён относительно (0,0)

        } else {

            /*Определение высоты элемента с учетом прокрутки*/
            scrollHeight = HTMLElement.scrollHeight;

            /*Определение прокрутки по оси Y элемента*/
            scrollTop = HTMLElement.scrollTop;

        }

        /*Определение ширины ползунка динамически, исходя из полной высоты элемента*/
        var parts = scrollHeight / this.parent.clientHeight;
        var sliderHeight = this.parent.clientHeight / parts;
        this.divSlider.style.height = sliderHeight + 'px';

        /*Масштаб по оси Y*/
        var scaleY = this.parent.clientHeight / scrollHeight;

        /*Вычисление значения top для ползунка*/
        this.divSlider.style.top = scrollTop * scaleY + 'px';
    };


    /**
     * Прикрепить обработчик draggable ползунка.
     * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена горизонтальная полоса прокрутки
     */
    ySlider.prototype.attachMouseDownHandler = function (HTMLElement) {

        if (!this.divSlider) {
            return;
        }

        var self = this;

        this.mouseDownHandler = (function (e) {

            /*Координаты ползунка*/
            var coords = self.getCoords(self.divSlider);

            /*Смещение курсора*/
            var shiftY = e.pageY - coords.top;

            /*Если ползунок создается для всего документа*/
            if (HTMLElement === document ||
                HTMLElement === document.documentElement ||
                HTMLElement === document.body) {

                /*Ползунок создается для всего документа*/
                var isDocument = true;

                /*Определение высоты документа с учетом прокрутки*/
                var scrollHeight = Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                );

                /*Определение прокрутки по оси X документа*/
                var scrollLeft = document.documentElement.scrollLeft || document.body && document.body.scrollLeft || 0;
                scrollLeft -= document.documentElement.clientLeft; // в IE7- <html> смещён относительно (0,0)

                /*Определение прокрутки по оси Y документа*/
                var scrollTop = document.documentElement.scrollTop || document.body && document.body.scrollTop || 0;
                scrollTop -= document.documentElement.clientTop; // в IE7- <html> смещён относительно (0,0)

            } else {

                /*Ползунок создается для html-элемента*/
                isDocument = false;

                /*Определение высоты элемента с учетом прокрутки*/
                scrollHeight = HTMLElement.scrollHeight;

                /*Определение прокрутки по оси Y элемента*/
                scrollTop = HTMLElement.scrollTop;

            }

            /*Масштаб по оси Y*/
            var scaleY = self.parent.clientHeight / scrollHeight;

            /*Запретить выделение текста*/
            document.body.classList.add('disable-select');

            document.onmousemove = function (e) {

                /*Если html-элемент удален*/
                if (HTMLElement.offsetWidth === 0 && HTMLElement.offsetHeight === 0) {
                    return;
                }

                /*Переместить вертикальный ползунок*/
                self.divSlider.style.top = e.pageY - shiftY - self.getCoords(self.divSlider.parentElement).top + 'px';

                /*Проверить верхнюю вертикального позицию ползунка*/
                if (self.divSlider.offsetTop <= 0) {
                    self.divSlider.style.top = 0;
                }

                /*Проверить нижнюю позицию вертикального ползунка без наличия ползунка горизонтальной прокрутки*/
                if (self.divSlider.offsetTop >= self.parent.clientHeight - self.divSlider.offsetHeight) {

                    self.divSlider.style.top = self.parent.clientHeight - self.divSlider.offsetHeight + 'px';
                }

                /*Прокрутить страницу или элемент*/
                if (isDocument) {

                    /*Вычисление значения scrollTop для документа*/
                    window.scrollTo(scrollLeft, self.divSlider.offsetTop / scaleY);

                } else {

                    /*Вычисление значения scrollTop для элемента*/
                    HTMLElement.scrollTop = self.divSlider.offsetTop / scaleY;
                }


            };

            document.onmouseup = function (e) {

                document.onmousemove = null;
                document.onmouseup = null;

                /*Снять запрет на выделение текста*/
                document.body.classList.remove('disable-select');
            };

        }).bind(this);

        this.divSlider.addEventListener('mousedown', this.mouseDownHandler);
    };


    /**
     * Открепить обработчик draggable ползунка.
     */
    ySlider.prototype.detachMouseDownHandler = function () {

        if (!this.divSlider) {
            return;
        }

        this.divSlider.removeEventListener('mousedown', this.mouseDownHandler);
    };


    /**
     * Прикрепить обработчик resize события.
     * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена горизонтальная полоса прокрутки
     */
    ySlider.prototype.attachResizeHandler = function (HTMLElement) {

        /*Обработчик resize события*/
        this.resizeHandler = (function () {
            this.setTopPositionByElementsScrollTop(HTMLElement);
        }).bind(this);

        window.addEventListener('resize', this.resizeHandler);
    };


    /**
     * Открепить обработчик resize события.
     */
    ySlider.prototype.detachResizeHandler = function () {

        window.removeEventListener('resize', this.resizeHandler);

        this.resizeHandler = null;
    };



})();