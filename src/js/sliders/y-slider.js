ySlider.prototype = Object.create(Slider.prototype);
ySlider.prototype.constructor = ySlider;

/**
 * Ползунок вертикальной прокрутки
 */
function ySlider() {

    /*Вызов конструктора родителя*/
    Slider.apply(this, arguments);

    /*Создать div вертикального ползунка*/
    this.create();

    this.divSlider.classList.add('custom-y-slider');
}

/**
 * Установить позицию вертикального ползунка, исходя из вертикальной прокрутки элемента.
 * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена вертикальная полоса прокрутки
 */
ySlider.prototype.setTopPositionByElementsScrollTop = function (HTMLElement) {

    if (!this.divSlider) {
        return;
    }

    /*Если ползунок создается для всего документа*/
    if (HTMLElement === document ||
        HTMLElement === document.documentElement ||
        HTMLElement === document.body) {

        /*Определение высоты документа с учетом прокрутки*/
        var scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );

        /*Определение прокрутки по оси Y документа*/
        var scrollTop = document.documentElement.scrollTop || document.body && document.body.scrollTop || 0;
        scrollTop -= document.documentElement.clientTop; // в IE7- <html> смещён относительно (0,0)

    } else {

        /*Определение высоты элемента с учетом прокрутки*/
        scrollHeight = HTMLElement.scrollHeight;

        /*Определение прокрутки по оси Y элемента*/
        scrollTop = HTMLElement.scrollTop;

    }

    /*Определение ширины ползунка динамически, исходя из полной высоты элемента*/
    var parts = scrollHeight / this.divSlider.parentElement.clientHeight;
    var sliderHeight = this.divSlider.parentElement.clientHeight / parts;
    this.divSlider.style.height = sliderHeight + 'px';

    /*Масштаб по оси Y*/
    var scaleY = this.divSlider.parentElement.clientHeight / scrollHeight;

    /*Вычисление значения top для ползунка*/
    this.divSlider.style.top = scrollTop * scaleY + 'px';
};


/**
 * Прикрепить обработчик draggable ползунка.
 * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена горизонтальная полоса прокрутки
 */
ySlider.prototype.attachMouseDownHandler = function (HTMLElement) {

    if (!this.divSlider) {
        return;
    }

    var self = this;

    this.mouseDownHandler = (function (e) {

        /*Координаты ползунка*/
        var coords = self.getCoords(self.divSlider);

        /*Смещение курсора*/
        var shiftY = e.pageY - coords.top;

        /*Если ползунок создается для всего документа*/
        if (HTMLElement === document ||
            HTMLElement === document.documentElement ||
            HTMLElement === document.body) {

            /*Ползунок создается для всего документа*/
            var isDocument = true;

            /*Определение высоты документа с учетом прокрутки*/
            var scrollHeight = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
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

            /*Определение высоты элемента с учетом прокрутки*/
            scrollHeight = HTMLElement.scrollHeight;

            /*Определение прокрутки по оси Y элемента*/
            scrollTop = HTMLElement.scrollTop;

        }

        /*Масштаб по оси Y*/
        var scaleY = self.divSlider.parentElement.clientHeight / scrollHeight;

        /*Запретить выделение текста*/
        document.body.classList.add('disable-select');

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        function mouseMoveHandler(e) {
            /*Если html-элемент удален*/
            if (HTMLElement.offsetWidth === 0 && HTMLElement.offsetHeight === 0) {
                return;
            }

            /*Переместить вертикальный ползунок*/
            self.divSlider.style.top = e.pageY - shiftY - self.getCoords(self.divSlider.parentElement).top + 'px';

            /*Проверить верхнюю вертикального позицию ползунка*/
            if (self.divSlider.offsetTop <= 0) {
                self.divSlider.style.top = 0;
            }

            /*Проверить нижнюю позицию вертикального ползунка без наличия ползунка горизонтальной прокрутки*/
            if (self.divSlider.offsetTop >= self.divSlider.parentElement.clientHeight - self.divSlider.offsetHeight) {

                self.divSlider.style.top = self.divSlider.parentElement.clientHeight - self.divSlider.offsetHeight + 'px';
            }

            /*Прокрутить страницу или элемент*/
            if (isDocument) {

                /*Вычисление значения scrollTop для документа*/
                window.scrollTo(scrollLeft, self.divSlider.offsetTop / scaleY);

            } else {

                /*Вычисление значения scrollTop для элемента*/
                HTMLElement.scrollTop = self.divSlider.offsetTop / scaleY;
            }
        }

        function mouseUpHandler() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);

            /*Снять запрет на выделение текста*/
            document.body.classList.remove('disable-select');
        }

    }).bind(this);

    this.divSlider.addEventListener('mousedown', this.mouseDownHandler);
};


/**
 * Открепить обработчик draggable ползунка.
 */
ySlider.prototype.detachMouseDownHandler = function () {

    if (!this.divSlider) {
        return;
    }

    this.divSlider.removeEventListener('mousedown', this.mouseDownHandler);
};


/**
 * Прикрепить обработчик resize события.
 * @param HTMLElement HTMLElement. HTML-элемент, для которого установлена горизонтальная полоса прокрутки
 */
ySlider.prototype.attachResizeHandler = function (HTMLElement) {

    /*Обработчик resize события*/
    this.resizeHandler = (function () {
        this.setTopPositionByElementsScrollTop(HTMLElement);
    }).bind(this);

    window.addEventListener('resize', this.resizeHandler);
};


/**
 * Открепить обработчик resize события.
 */
ySlider.prototype.detachResizeHandler = function () {

    window.removeEventListener('resize', this.resizeHandler);

    this.resizeHandler = null;
};


