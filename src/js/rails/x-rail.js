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
    if (this.element === document ||
        this.element === document.documentElement ||
        this.element === document.body) {

        this.divRail.classList.add('custom-x-rail-document');

    } else {

        this.divRail.classList.add('custom-x-rail');

        /*Определение обработчика resize события*/
        this.resizeHandler = function () {

            this.divRail.style.top = this.getCoords(this.element).bottom - this.divRail.offsetHeight + 'px';
            this.divRail.style.left = this.getCoords(this.element).left + 'px';
            this.divRail.style.width = this.element.offsetWidth + 'px';

        }.bind(this);

        /*Вызов обработчика resize события*/
        this.resizeHandler();

        /*Прикрепить обработчик resize события*/
        this.attachResizeHandler();
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

        if (this.element === document ||
            this.element === document.documentElement ||
            this.element === document.body) {

            this.divRail.style.width = '100%';

        } else {

            this.divRail.style.width = this.element.offsetWidth + 'px';
        }

        this.divRail.style.width = this.divRail.offsetWidth - value + 'px';
    }
};