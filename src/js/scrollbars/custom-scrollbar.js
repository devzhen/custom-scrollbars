function CustomScrollbar(HTMLElement) {

    /*Проверка*/
    try {

        if (!HTMLElement || !document.contains(HTMLElement)) {
            return;
        }

    } catch (e) {

        return;
    }

    /*Если пользовательские полосы прокрутки назначаются для страницы*/
    if (HTMLElement === document ||
        HTMLElement === document.documentElement ||
        HTMLElement === document.body) {

        /*Если функция уже вызвана для страницы*/
        if (document.body.classList.contains('dg-custom-scrollbars')) {
            return;
        }

        /*Поставить маркер. что для страницы назначены пользовательские полосы прокрутки*/
        document.body.classList.add('dg-custom-scrollbars');

        var cs = new CustomScrollbarDocument();

    } else { /*Если пользовательские полосы прокрутки назначаются для html-элемента*/

        cs = new CustomScrollbarElement(HTMLElement);
    }


    /**
     * Содать пользовательскую вертикальную полосу прокрутки
     */
    CustomScrollbar.prototype.createYScrollbar = function () {

        cs.createYScrollbar();
    };

    /**
     * Удалить пользовательскую вертикальную полосу прокрутки
     */
    CustomScrollbar.prototype.removeYScrollbar = function () {

        cs.removeYScrollbar();
    };

    /**
     * Содать пользовательскую горизонтальную полосу прокрутки
     */
    CustomScrollbar.prototype.createXScrollbar = function () {

        cs.createXScrollbar();
    };

    /**
     * Удалить пользовательскую горизонтальную полосу прокрутки
     */
    CustomScrollbar.prototype.removeXScrollbar = function () {

        cs.removeXScrollbar();
    };
}