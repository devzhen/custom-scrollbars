CustomScrollbarElement.prototype = Object.create(CustomScrollbarBase.prototype);
CustomScrollbarElement.prototype.constructor = CustomScrollbarElement;


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
    this.disableOverflow(this.element);

    /*Генерация события resize - это нужно, чтобы все custom scrollbars перерисовали своё положение*/
    try {
        this.triggerResizeEvent();

    } catch (e) {

        this.enableOverflow(this.element);
        return;
    }

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

    /*Прикрепить обработчик resize события*/
    this.attachResizeHandler();
}

/**
 * СТАТИЧЕСКАЯ ПЕРЕМЕННАЯ
 * Минимальное количество пикселей, на которое будет прокручен элемент при возникновении wheel события
 * @type {number}
 */
CustomScrollbarElement.WHEEL_PIXEL_STEP = 100;


/**
 * Создать пользовательскую вертикальную полосу прокрутки
 */
CustomScrollbarElement.prototype.createYScrollbar = function () {

    if (this.ySlider) {
        return;
    }

    this.yRail = new yRail(this.element);

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

    this.xRail = new xRail(this.element);

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

        this.element.removeEventListener('input', this.inputHandler);

        this.inputHandler = null;
    }
};


/**
 * Прикрепить обработчик resize события
 */
CustomScrollbarElement.prototype.attachResizeHandler = function () {

    this.resizeHandler = function () {

        /*Если есть и гориз., и вертик. полосы прокрутки - поддкорректировать ширину горизонтальной*/
        if (this.yRail && this.xRail && this.xRail.getWidth() === this.element.offsetWidth) {

            this.xRail.correctWidth(this.yRail.getWidth());

            /*Подкорректировать позицию горизонтального ползунка*/
            if (this.xSlider) {
                this.xSlider.setLeftPositionByElementsScrollLeft(this.element);
            }
        }

    }.bind(this);

    window.addEventListener('resize', this.resizeHandler);
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
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        }

        /*Если не уществует вертикальная прокрутка, но есть горизонтальная прокрутка*/
        if (!this.ySlider && this.xSlider) {

            this.element.scrollLeft = this.element.scrollLeft + delta;
            stopPropagation(e);
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
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
            self.detachResizeHandler();
            self.removeYScrollbar();
            self.removeXScrollbar();
            clearInterval(self.intervalId);
            self.intervalId = null;
            self.element = null;
        }

    }, 500);
};