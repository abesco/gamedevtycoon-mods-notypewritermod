/*
GameDevTycoon Expansion Module
**********************************************************************************************************************************************************
Name:                 NoTypeWriterMod
Description:          Disables the Typewriter effect on all dialogs and notifications
Copyright:            © 2013 Francesco Abbattista
Url:                  http://www.abesco.de/
Notes:                None.
Credits:              None.
**********************************************************************************************************************************************************
Version:              1.0.0
Launch:               December 23th, 2013
Last Update:          December 23th, 2013
**********************************************************************************************************************************************************
*/

var NoTypeWriterModAbescoUG = {};
(function () {
    try {
        (function() {
            var proxied = $.fn.typewrite;
                $.fn.typewrite = function(b) {
                b.delay = 1;
                console.log( this, arguments );
                return proxied.apply( this, arguments );
            };
        })();
    }
    catch(ex) {
        alert('An exception occured in the NoTypeWriterMod Expansion!\r\n\r\n'+ex.message);
    }
    finally {
        
    }
})();