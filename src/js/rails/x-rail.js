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