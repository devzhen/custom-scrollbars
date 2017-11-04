/**
 * Направляющая для ползунка прокрутки
 * @param htmlElement HTMLElement. Родительский элемент для направляющей
 * @constructor
 */
function Rail(htmlElement) {

    if (!htmlElement) {
        return;
    }

    this.element = htmlElement;

    this.create();
}

/**
 * Создать div-направляющую для ползунка прокрутки
 */
Rail.prototype.create = function () {

    /*Создание div - направляющая для ползунка*/
    this.divRail = document.createElement('div');
    document.body.appendChild(this.divRail);

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
    document.body.removeChild(this.divRail);

    /*Удалить обработчик click события для направляющей для ползунка*/
    this.divRail.removeEventListener('click', clickHandler);

    /*Открепить обработчик resize события*/
    this.detachResizeHandler();

    this.divRail = null;
    this.element = null;
};


/**
 * Прикрепить обработчик resize события
 */
Rail.prototype.attachResizeHandler = function () {

    window.addEventListener('resize', this.resizeHandler);
};


/**
 * Открепить обработчик resize события
 */
Rail.prototype.detachResizeHandler = function () {

    window.removeEventListener('resize', this.resizeHandler);
    this.resizeHandler = null;
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


/**
 * Получение координат элемента относительно страницы.
 * @param HTMLElement
 * @return {{top: number, left: number, right: number, bottom: number}}
 */
Rail.prototype.getCoords = function (HTMLElement) {

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
        left: left,
        right: left + HTMLElement.offsetWidth,
        bottom: top + HTMLElement.offsetHeight
    };
};


/**
 * Обработчик click события
 * @param event
 */
function clickHandler(event) {
    event.preventDefault();
}