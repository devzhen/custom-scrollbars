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
    this.wrapper.style.height = this.element.offsetHeight + 'px';
    this.wrapper.style.width = this.element.offsetWidth + 'px';
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