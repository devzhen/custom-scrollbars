CustomScrollbarDocument.prototype = Object.create(CustomScrollbarBase.prototype);
CustomScrollbarDocument.prototype.constructor = CustomScrollbarDocument;


/**
 * Пользовательские полосы прокрутки для страницы
 * @constructor
 */
function CustomScrollbarDocument() {

    /*Запретить прокрутку страницы*/
    this.disableOverflow(document.documentElement);

    /*Генерация события resize - это нужно, чтобы все custom scrollbars перерисовали своё положение*/
    try {
        this.triggerResizeEvent();

    } catch (e) {

        this.enableOverflow(document.documentElement);
        return;
    }

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