xSlider.prototype = Object.create(Slider.prototype);
xSlider.prototype.constructor = xSlider;

/**
 * Ползунок горизонтальной прокрутки
 */
function xSlider() {

    /*Вызов конструктора родителя*/
    Slider.apply(this, arguments);

    /*Создать div горизонтального ползунка*/
    this.create();

    this.divSlider.classList.add('custom-x-slider');
}

/**
 * Установить позицию горизонтального ползунка, исходя из горизонтальной прокрутки элемента.
 * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена горизонтальная полоса прокрутки
 */
xSlider.prototype.setLeftPositionByElementsScrollLeft = function (HTMLElement) {

    if (!this.divSlider) {
        return;
    }

    /*Если ползунок создается для всего документа*/
    if (HTMLElement === document ||
        HTMLElement === document.documentElement ||
        HTMLElement === document.body) {

        /*Определение ширины документа с учетом прокрутки*/
        var scrollWidth = Math.max(
            document.body.scrollWidth, document.documentElement.scrollWidth,
            document.body.offsetWidth, document.documentElement.offsetWidth,
            document.body.clientWidth, document.documentElement.clientWidth
        );

        /*Определение прокрутки по оси X документа*/
        var scrollLeft = document.documentElement.scrollLeft || document.body && document.body.scrollLeft || 0;
        scrollLeft -= document.documentElement.clientLeft; // в IE7- <html> смещён относительно (0,0)


    } else {

        /*Определение ширины элемента с учетом прокрутки*/
        scrollWidth = HTMLElement.scrollWidth;

        /*Определение прокрутки по оси X элемента*/
        scrollLeft = HTMLElement.scrollLeft;

    }

    /*Определение высоты ползунка динамически, исходя из полной ширины элемента*/
    var parts = scrollWidth / this.divSlider.parentElement.clientWidth;
    var sliderWidth = this.divSlider.parentElement.clientWidth / parts;
    this.divSlider.style.width = sliderWidth + 'px';

    /*Масштаб по оси X*/
    var scaleX = this.divSlider.parentElement.clientWidth / scrollWidth;

    /*Вычисление значения left для ползунка*/
    this.divSlider.style.left = scrollLeft * scaleX + 'px';
};


/**
 * Прикрепить обработчик draggable ползунка.
 * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена горизонтальная полоса прокрутки
 */
xSlider.prototype.attachMouseDownHandler = function (HTMLElement) {

    if (!this.divSlider) {
        return;
    }

    var self = this;

    this.mouseDownHandler = (function (e) {

        /*Координаты горизонтального ползунка*/
        var coords = self.getCoords(self.divSlider);

        /*Смещение курсора*/
        var shiftX = e.pageX - coords.left;

        /*Если ползунок создается для всего документа*/
        if (HTMLElement === document ||
            HTMLElement === document.documentElement ||
            HTMLElement === document.body) {

            /*Ползунок создается для всего документа*/
            var isDocument = true;

            /*Определение ширины документа с учетом прокрутки*/
            var scrollWidth = Math.max(
                document.body.scrollWidth, document.documentElement.scrollWidth,
                document.body.offsetWidth, document.documentElement.offsetWidth,
                document.body.clientWidth, document.documentElement.clientWidth
            );

            /*Определение прокрутки по оси X документа*/
            var scrollLeft = document.documentElement.scrollLeft || document.body && document.body.scrollLeft || 0;
            scrollLeft -= document.documentElement.clientLeft; // в IE7- <html> смещён относительно (0,0)

            /*Определение прокрутки по оси Y документа*/
            var scrollTop = document.documentElement.scrollTop || document.body && document.body.scrollTop || 0;
            scrollTop -= document.documentElement.clientTop; // в IE7- <html> смещён относительно (0,0)

        } else {

            /*Ползунок создается для html-элемента*/
            isDocument = false;

            /*Определение ширины документа с учетом элемента*/
            scrollWidth = HTMLElement.scrollWidth;

            /*Определение прокрутки по оси X элемента*/
            scrollLeft = HTMLElement.scrollLeft;

        }

        /*Масштаб по оси X*/
        var scaleX = self.divSlider.parentElement.clientWidth / scrollWidth;

        /*Запретить выделение текста*/
        document.body.classList.add('disable-select');

        document.onmousemove = function (e) {

            /*Переместить ползунок*/
            self.divSlider.style.left = e.pageX - shiftX - self.getCoords(self.divSlider.parentElement).left + 'px';

            /*Проверить левую позицию ползунка*/
            if (self.divSlider.offsetLeft <= 0) {
                self.divSlider.style.left = 0;
            }

            /*Проверить правую позицию ползунка*/
            if (self.divSlider.offsetLeft + self.divSlider.offsetWidth >= self.divSlider.parentElement.offsetWidth) {
                self.divSlider.style.left = self.divSlider.parentElement.offsetWidth - self.divSlider.offsetWidth + 'px';
            }

            /*Прокрутить страницу или элемент*/
            if (isDocument) {

                /*Вычисление значения scrollLeft для документа*/
                window.scrollTo(self.divSlider.offsetLeft / scaleX, scrollTop);

            } else {

                /*Вычисление значения scrollLeft для элемента*/
                HTMLElement.scrollLeft = self.divSlider.offsetLeft / scaleX;
            }

        };

        document.onmouseup = function (e) {

            document.onmousemove = null;
            document.onmouseup = null;

            /*Снять запрет на выделение текста*/
            document.body.classList.remove('disable-select');
        };

    }).bind(this);

    this.divSlider.addEventListener('mousedown', this.mouseDownHandler);
};


/**
 * Открепить обработчик draggable ползунка.
 */
xSlider.prototype.detachMouseDownHandler = function () {

    if (!this.divSlider) {
        return;
    }

    this.divSlider.removeEventListener('mousedown', this.mouseDownHandler);

    this.mouseDownHandler = null;
};


/**
 * Прикрепить обработчик resize события.
 * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена горизонтальная полоса прокрутки
 */
xSlider.prototype.attachResizeHandler = function (HTMLElement) {

    /*Обработчик resize события*/
    this.resizeHandler = (function () {

        this.setLeftPositionByElementsScrollLeft(HTMLElement);
    }).bind(this);

    window.addEventListener('resize', this.resizeHandler);
};


/**
 * Открепить обработчик resize события.
 */
xSlider.prototype.detachResizeHandler = function () {

    window.removeEventListener('resize', this.resizeHandler);

    this.resizeHandler = null;
};