function CustomScrollbar(HTMLElement) {

    /*Проверка*/
    try {

        if (!HTMLElement || !document.body.contains(HTMLElement)) {
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


    return {

        /**
         * Содать пользовательскую вертикальную полосу прокрутки
         */
        createYScrollbar: function () {

            cs.createYScrollbar();
        },

        /**
         * Удалить пользовательскую вертикальную полосу прокрутки
         */
        removeYScrollbar: function () {

            cs.removeYScrollbar();
        },

        /**
         * Содать пользовательскую горизонтальную полосу прокрутки
         */
        createXScrollbar: function () {

            cs.createXScrollbar();
        },

        /**
         * Удалить пользовательскую горизонтальную полосу прокрутки
         */
        removeXScrollbar: function () {

            cs.removeXScrollbar();
        },

        /**
         * Добавить CSS класс для вертикального ползунка.
         * @param className string. Название CSS класса.
         */
        setCssClassForVerticalSlider: function (className) {

            /*Проверка*/
            if (!className || typeof className !== "string" || !cs.ySlider) {
                return;
            }

            /*Добавить CSS класс для ползунка*/
            cs.ySlider.divSlider.classList.add(className);
        },

        /**
         * Удалить CSS класс для вертикального ползунка.
         * @param className string. Название CSS класса.
         */
        removeCssClassForVerticalSlider: function (className) {

            /*Проверка*/
            if (!className || typeof className !== "string" || !cs.ySlider) {
                return;
            }

            /*Удалить CSS класс для ползунка*/
            if (cs.ySlider.divSlider.classList.contains(className)) {
                cs.ySlider.divSlider.classList.remove(className)
            }
        },

        /**
         * Добавить CSS класс для горизонтального ползунка.
         * @param className string. Название CSS класса.
         */
        setCssClassForHorizontalSlider: function (className) {

            /*Проверка*/
            if (!className || typeof className !== "string" || !cs.xSlider) {
                return;
            }

            /*Добавить CSS класс для ползунка*/
            cs.ySlider.divSlider.classList.add(className);
        },

        /**
         * Удалить CSS класс для горизонтального ползунка.
         * @param className string. Название CSS класса.
         */
        removeCssClassForHorizontalSlider: function (className) {

            /*Проверка*/
            if (!className || typeof className !== "string" || !cs.xSlider) {
                return;
            }

            /*Удалить CSS класс для ползунка*/
            if (cs.xSlider.divSlider.classList.contains(className)) {
                cs.xSlider.divSlider.classList.remove(className)
            }
        },

        /**
         * Добавить атрибут id для вертикального ползунка.
         * @param id string. Имя атрибута id.
         */
        setIdForVerticalSlider: function (id) {

            /*Проверка*/
            if (!id || typeof id !== "string" || !cs.ySlider) {
                return;
            }

            /*Добавить атрибут id для вертикального ползунка*/
            cs.ySlider.divSlider.id = id;

        },

        /**
         * Удалить атрибут id для вертикального ползунка.
         */
        removeIdForVerticalSlider: function () {

            /*Проверка*/
            if (!cs.ySlider || !cs.ySlider.divSlider.getAttribute('id')) {
                return;
            }

            /*Удалить атрибут id для вертикального ползунка*/
            cs.ySlider.divSlider.removeAttribute('id');
        },

        /**
         * Добавить атрибут id для горизонтального ползунка.
         * @param id string. Имя атрибута id.
         */
        setIdForHorizontalSlider: function (id) {

            /*Проверка*/
            if (!id || typeof id !== "string" || !cs.xSlider) {
                return;
            }

            /*Добавить атрибут id для горизонтального ползунка*/
            cs.xSlider.divSlider.id = id;
        },

        /**
         * Удалить атрибут id для горизонтального ползунка.
         */
        removeIdForHorizontalSlider: function () {

            /*Проверка*/
            if (!cs.xSlider || !cs.xSlider.divSlider.getAttribute('id')) {
                return;
            }

            /*Удалить атрибут id для вертикального ползунка*/
            cs.xSlider.divSlider.removeAttribute('id');
        },
    };
}