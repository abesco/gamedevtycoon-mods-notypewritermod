/*
GameDevTycoon Expansion Module
**********************************************************************************************************************************************************
Name:                 NoTypeWriterMod
Description:          Disables the Typewriter effect on all dialogs and notifications.
Copyright:            © 2013 Francesco Abbattista
Url:                  http://www.abesco.de/
Notes:                None.
Credits:              None.
**********************************************************************************************************************************************************
Version:              1.1.0
Launch:               December 23th, 2013
Last Update:          December 24th, 2013
**********************************************************************************************************************************************************
*/

var NoTypeWriterModAbescoUG = {};
(function () {
    var m                       = this;

    this.idDataStorage          = 'NoTypeWriterModAbescoUG';
    this.typeWriterDelay        = 1;
    this.dataStorage            = GDT.getDataStore(this.idDataStorage);

    // Reset settings in storage
    this.resetStorage = function() {
        m.dataStorage.settings.typeWriterDelay = 0;    
    };
    
    // Save settings to storage   
    this.saveStorage = function() {
        m.dataStorage.settings.typeWriterDelay = m.typeWriterDelay;  
        m.dataStorage.data = m.dataStorage.settings;      
        
        DataStore.saveSettings();
    };       
    
    // Load / Reload settings from storage
    this.loadStorage = function() {
        m.dataStorage = GDT.getDataStore(m.idDataStorage);
    };

    // Applies the settings from storage to this instance    
    this.applyStorage = function() {
        var settings = DataStore.settings.modData[m.idDataStorage];
        if(settings){
            if(settings.typeWriterDelay){
                m.typeWriterDelay = settings.typeWriterDelay;
            }
        }
    };
     
    // Adds module settings to the main game options screen
    this.addSettings = function() {
        var insertPoint = $('#toggleFullscreenButton').parent().parent().prev().prev();

        var div = $(document.createElement('div'));
                
        var sectionTitle1 = $(document.createElement('h2'));
        var settingTitle1 = $(document.createElement('h3'));
        var numericInput  = $(document.createElement('input'));
        
        sectionTitle1.text('NoTypeWriterMod').appendTo(div);
        settingTitle1.text('Typewriter delay').appendTo(div);
        numericInput.attr({type:'number', min:0, max:250, value:m.typeWriterDelay}).css({width:'80px'}).appendTo(div);
        
        div.insertAfter(insertPoint);
        
        numericInput.change(function(e){
            m.typeWriterDelay = $(e.target).val();

            m.saveStorage();
            m.applyStorage();
        });
    };
    
    
    this.printObject = function(o) {
      var out = '';
      for (var p in o) {
        out += p + ', ';
        // out += p +'\n';
      }
      alert(out);
  };
      
    // ------- Main    
    try {
        // Applies the settings stored previously
        this.applyStorage();

        // Adds a small custom section to the game's settings for this module
        this.addSettings();
                
        // Create an override using the jQuery proxy pattern for the "typewrite" method
        (function(caller) {
            var proxied = $.fn.typewrite;
            $.fn.typewrite = function(b) {
                b.delay = caller.typeWriterDelay;
                // console.log( this, arguments );
                return proxied.apply( this, arguments );
            };
        })(this);
        
        (function(caller) {
            var proxied = UI._startGameConferenceAnimations;
            UI._startGameConferenceAnimations = function(b, e) {
                var layer = $(".simplemodal-data").find(".animationLayer");
                return proxied.apply( this, arguments );
            };
        })(this);
                
        
           
    }
    catch(ex) {
        alert('An exception occured in the NoTypeWriterMod Expansion!\r\n\r\n'+ex.message);
    }
    finally {
        
    }   

})();