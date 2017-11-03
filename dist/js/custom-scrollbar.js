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
     custom-scrollbar-element
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
     custom-scrollbar-document
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
})();