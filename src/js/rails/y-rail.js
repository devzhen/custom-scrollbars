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
    if (this.element === document ||
        this.element === document.documentElement ||
        this.element === document.body) {

        this.divRail.classList.add('custom-y-rail-document');

    } else {

        this.divRail.classList.add('custom-y-rail');

        /*Определение обработчика resize события*/
        this.resizeHandler = function () {

            this.divRail.style.top = this.getCoords(this.element).top + 'px';
            this.divRail.style.left = this.getCoords(this.element).right - this.divRail.offsetWidth + 'px';
            this.divRail.style.height = this.element.offsetHeight + 'px';

        }.bind(this);

        /*Вызов обработчика resize события*/
        this.resizeHandler();

        /*Прикрепить обработчик resize события*/
        this.attachResizeHandler();
    }
}