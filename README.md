Custom scrollbars demo - https://devzhen.github.io/dg-custom-scrollbars

****Installation****

* npm: ```npm install dg-custom-scrollbar```
* Bower: ```bower install dg-custom-scrollbar```

<br>

****How to use it****

* Include *'dg-custom-scrollbar.min.css'* in the head tag your HTML document:
    ```HTML
    <link rel="stylesheet" href="/path/to/dist/css/dg-custom-scrollbars.min.css" />
    ```
* Include *'dg-custom-scrollbar.min.js'* in your HTML document:
    ``` HTML
    <script src="/path/to/dist/js/dg-custom-scrollbars.min.js"></script>
    ```
* Usage:
    ```javascript
    var textarea = document.getElementById('some_id');
  
    var cs = new CustomScrollbar(textarea);
    ```
    ```javascript
    var cs = new CustomScrollbar(document.body);
    ```
    <br>
    
    `cs` - is a javascript object, that provides methods:
    
    * `cs.createYScrollbar()`       - creates | removes a custom vertical scroll bar.<br>
      `cs.removeYScrollbar()`
      
    * `cs.createXScrollbar()`       - creates | removes a custom horizontal scroll bar.<br> 
      `cs.removeXScrollbar()`
      
    * `cs.setCssClassForVerticalSlider()`       - sets | removes the css class for the vertical slider.<br>
      `cs.removeCssClassForVerticalSlider()`
      
    * `cs.setCssClassForHorizontalSlider()`     - sets | removes the css class for the horizontal slider.<br>
      `cs.removeCssClassForHorizontalSlider()`
      
    * `cs.setIdForVerticalSlider()`     - sets | removes the id attribute for the vertical slider.<br>
      `cs.removeIdForVerticalSlider()`
      
    * `cs.setIdForHorizontalSlider()`   - sets | removes the id attribute for the horizontal slider.<br>
      `cs.removeIdForHorizontalSlider()`
    
    also `CustomScrollbar` provides a static method:
    
    * `CustomScrollbar.notifyAllCustomScrollbars()` - this is a static method that notifies all scrollbars to update their positions