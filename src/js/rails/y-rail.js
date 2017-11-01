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