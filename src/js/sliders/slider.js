/**
 * Ползунок прокрутки
 * @param sliderParent HTMLElement. Родительский элемент для ползунка
 * @constructor
 */
function Slider(sliderParent) {

    this.parent = sliderParent;
}


/**
 * Создать ползунок прокрутки
 */
Slider.prototype.create = function () {

    /*Создание div слайдера*/
    var div = document.createElement('div');
    this.divSlider = this.parent.appendChild(div);
};


/**
 * Удалить ползунок прокрутки
 */
Slider.prototype.remove = function () {

    if (!this.divSlider) {
        return;
    }

    this.parent.removeChild(this.divSlider);

    this.resizeHandler = null;

    this.divSlider = null;
};


/**
 * Получени координат элемента относительно страницы.
 * @param HTMLElement
 * @return {{top: number, left: number}}
 */
Slider.prototype.getCoords = function (HTMLElement) {

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
        left: left
    };
};


/**
 * Прикрепить обработчик click события
 */
Slider.prototype.attachClickHandler = function () {

    if (!this.divSlider) {
        return;
    }

    this.clickHandler = function (event) {
        event.preventDefault();
    };

    this.divSlider.addEventListener('click', this.clickHandler);
};


/**
 * Открепить обработчик click события
 */
Slider.prototype.detachClickHandler = function () {

    if (!this.divSlider) {
        return;
    }

    this.divSlider.removeEventListener('click', this.clickHandler);

    this.clickHandler = null;
};