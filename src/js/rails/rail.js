/**
 * Направляющая для ползунка прокрутки
 * @param railParent HTMLElement. Родительский элемент для направляющей
 * @constructor
 */
function Rail(railParent) {

    if (!railParent) {
        return;
    }

    this.parent = railParent;

    this.create();
}

/**
 * Создать div-направляющую для ползунка прокрутки
 */
Rail.prototype.create = function () {

    /*Создание div - направляющая для ползунка*/
    this.divRail = document.createElement('div');
    this.parent.appendChild(this.divRail);

    /*Назначить обработчик click события для направляющей для ползунка*/
    this.divRail.addEventListener('click', clickHandler);

    this.attachResizeHandler();
};


/**
 * Удалить div-направляющую для ползунка прокрутки
 */
Rail.prototype.remove = function () {

    if (!this.divRail) {
        return;
    }

    /*Удаление div - направляющая для ползунка*/
    this.parent.removeChild(this.divRail);

    /*Удалить обработчик click события для направляющей для ползунка*/
    this.divRail.removeEventListener('click', clickHandler);

    this.divRail = null;
    this.parent = null;
};


Rail.prototype.attachResizeHandler = function () {

    window.addEventListener('resize', function () {
        console.log('resize');
    });
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
 * Обработчик click события
 * @param event
 */
function clickHandler(event) {
    event.preventDefault();
}