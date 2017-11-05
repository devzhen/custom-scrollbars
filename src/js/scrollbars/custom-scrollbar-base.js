/**
 * Базовый класс для всех полос прокрутки
 * @constructor
 */
function CustomScrollbarBase() {
}

/**
 * Запретить прокрутку элемента
 * @param HTMLElement
 */
CustomScrollbarBase.prototype.disableOverflow = function (HTMLElement) {

    /*Запретить прокрутку элемента*/
    HTMLElement.classList.add('disable-overflow');

    /*Убрать css св-во outline*/
    HTMLElement.classList.add('disable-outline');
};


/**
 * Разрешить прокрутку элемента
 * @param HTMLElement
 */
CustomScrollbarBase.prototype.enableOverflow = function (HTMLElement) {

    /*Запретить прокрутку элемента*/
    HTMLElement.classList.remove('disable-overflow');

    HTMLElement.classList.remove('disable-outline');
};


/**
 * Генерация resize события. Метод нужен чтобы все полосы прокрутки перерисовали свое положение
 */
CustomScrollbarBase.prototype.triggerResizeEvent = function () {

    try {

        var event = new Event("resize", {bubbles: true, cancelable: true});

        document.dispatchEvent(event);

    } catch (e) {

        /*IE9+*/
        if (document.createEvent) {

            event = document.createEvent("Event");

            event.initEvent("resize", true, true);

            document.dispatchEvent(event);

        } else if (document.createEventObject) {/*IE8-*/

            event = document.createEventObject();

            document.fireEvent("onresize", event)
        }

    }

};


/**
 * Открепить обработчик resize события
 */
CustomScrollbarBase.prototype.detachResizeHandler = function () {

    if (this.resizeHandler) {

        window.removeEventListener('resize', this.resizeHandler);

        this.resizeHandler = null;
    }

};


/**
 * Открепить обработчик wheel события
 */
CustomScrollbarBase.prototype.detachWheelHandler = function () {

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