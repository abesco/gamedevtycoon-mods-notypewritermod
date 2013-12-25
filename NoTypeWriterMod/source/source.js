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
Version:              1.2.0
Launch:               December 23th, 2013
Last Update:          December 25th, 2013
**********************************************************************************************************************************************************
*/

var NoTypeWriterModAbescoUG = {};
(function () {
    var m                       = this;

    m.pad = function (str, max) {
        return str.length < max ? m.pad("0" + str, max) : str;
    };
        
    m.printObject = function(o) {
      var out = '';
      for (var p in o) {
        out += p + ', ';
        // out += p +'\n';
      }
      alert(out);
    };
        
    this.idDataStorage          = 'NoTypeWriterModAbescoUG';
    this.typeWriterDelay        = 0;
    this.skipConferences        = false;
    this.speedUpConferences     = true;
    this.dataStorage            = GDT.getDataStore(this.idDataStorage);

    // Reset settings in storage
    this.resetStorage = function() {
        m.dataStorage.settings.typeWriterDelay = 0;    
    };
    
    // Save settings to storage   
    this.saveStorage = function() {
        m.dataStorage.settings.typeWriterDelay =    m.typeWriterDelay;  
        m.dataStorage.settings.skipConferences =    m.skipConferences;  
        m.dataStorage.settings.speedUpConferences = m.speedUpConferences;  
        
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
                m.typeWriterDelay       = settings.typeWriterDelay;
                m.skipConferences       = settings.skipConferences;
                m.speedUpConferences    = settings.speedUpConferences;
            }
        }
    };
     
    // Adds module settings to the main game options screen
    this.addSettings = function() {
        var insertPoint = $('#toggleFullscreenButton').parent().parent().prev().prev();

        var div = $(document.createElement('div'));

        var tabHtml  = '<table width="100%" border="0" cellpadding="0" cellspacing="0">';
            tabHtml += '<thead>';
            tabHtml += '<th align="left" width="33%"><h3>Typewriter delay</h3></th>';
            tabHtml += '<th align="left" width="34%"><h3>Skip conferences</h3></th>';
            tabHtml += '<th align="left" width="33%"><h3>Speed up conferences</h3></th>';
            tabHtml += '</thead>';
            tabHtml += '<tbody>';
            tabHtml += '<tr>';
            tabHtml += '<td align="left" valign="middle"><input id="NoTypeWriterModSettingsTypeWriterDelayNumberBox"    type="number"   name="typeWriterDelay"      value="'        + m.typeWriterDelay +'" min="0" max="250"   style="width:80px"></td>';
            tabHtml += '<td align="left" valign="middle"><input id="NoTypeWriterModSettingsSkipPreferencesCheckBox"     type="checkbox" name="skipConferences"      value="true" '  +(m.skipConferences ? 'checked="checked"' : '')+'"    style="width:20px"></td>';
            tabHtml += '<td align="left" valign="middle"><input id="NoTypeWriterModSettingsSpeedUpConferencesCheckBox"  type="checkbox" name="speedUpConferences"   value="true" '  +(m.speedUpConferences ? 'checked="checked"' : '')+'" style="width:20px"></td>';
            tabHtml += '</tr>';
            tabHtml += '</tbody>';
            tabHtml += '</table>';

        var sectionTitle = $(document.createElement('h2'));
        sectionTitle.text('NoTypeWriterMod').appendTo(div);
        div.append(tabHtml);
        
        div.insertAfter(insertPoint);
        
        $('#NoTypeWriterModSettingsSpeedUpConferencesCheckBox').attr('disabled',m.skipConferences);
        
        $('#NoTypeWriterModSettingsTypeWriterDelayNumberBox').change(function(e){
            m.typeWriterDelay = $(e.target).val();

            m.saveStorage();
            m.applyStorage();
        });

        $('#NoTypeWriterModSettingsSkipPreferencesCheckBox').change(function(e){
            m.skipConferences = !($(e.target).attr('checked') === undefined);
            
            $('#NoTypeWriterModSettingsSpeedUpConferencesCheckBox').attr('disabled',m.skipConferences);
            
            m.saveStorage();
            m.applyStorage();
        });

        $('#NoTypeWriterModSettingsSpeedUpConferencesCheckBox').change(function(e){
            m.speedUpConferences = !($(e.target).attr('checked') === undefined);

            m.saveStorage();
            m.applyStorage();
        });
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
                return proxied.apply( this, arguments );
            };
        })(this);
        
        (function(caller) {
            var proxied = UI._startGameConferenceAnimations;
            UI._startGameConferenceAnimations = function(b, e) {
                
                if (caller.skipConferences){
                    $('#gameConferenceAnimationDialog').find(".okButton").click();
                    return;    
                }

                if(caller.speedUpConferences){
                    var lastGames       = [];
                    var currentGame     = GameManager.company.getGameById(e);
                    var hasCurrentGame  = !(typeof currentGame === undefined) && !currentGame == null;
                    
                    var contentElement = $('#gameConferenceAnimationDialog').find('#content').empty();
                    var container       = $(document.createElement('div'));
                    var booth           = GameManager.company.booths.first(function(q){return q.id == e;});
                    var boothImageName  = 'small';
                    var bootCaptionsHtml   = '';
                    
                    var digitBg         = $(document.createElement('div'));

                    switch(booth.standFactor){
                        
                        // small booth
                        case 0.3:
                        digitBg.css({width:377, height:101, position:'relative', left:214, top:10, background:'url(./images/superb/counter/panel.png) no-repeat center', backgroundSize:'cover'});
                        
                        boothImageName = 'small';
                        bootCaptionsHtml  = '<div style="position:relative; width:100%; height: 20px; text-align:center; top:170px"><h3 class="boothDescription">'+GameManager.company.name+'</h3>';
                        
                        if (hasCurrentGame){
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:94px"><h3>'+currentGame.title+'</h3>';
                        }
                        else {
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:94px"><h3>'+(GameManager.company.gameLog && GameManager.company.gameLog.length > 0 ? GameManager.company.gameLog.last().title : '')+'</h3>';
                        }
                        break;

                        // medium booth
                        case 0.5:
                        digitBg.css({width:377, height:101, position:'relative', left:214, top:10, background:'url(./images/superb/counter/panel.png) no-repeat center', backgroundSize:'cover'});
                        
                        boothImageName = 'medium';
                        bootCaptionsHtml  = '<div style="position:relative; width:100%; height: 20px; text-align:center; top:140px"><h3 class="boothCashCost">'+GameManager.company.name+'</h3>';

                        if (hasCurrentGame){
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:20px"><h5>'+currentGame.title+'</h5>';
                        }
                        else {
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:20px"><h5>'+(GameManager.company.gameLog && GameManager.company.gameLog.length > 0 ? GameManager.company.gameLog.last().title : '')+'</h5>';
                        }
                                            
                        break;

                        // large booth
                        case 1.3:
                        digitBg.css({width:377, height:101, position:'relative', left:214, top:10, background:'url(./images/superb/counter/panel.png) no-repeat center', backgroundSize:'cover'});

                        boothImageName = 'large';
                        bootCaptions  = '<div style="position:relative; width:100%; height: 20px; text-align:center; top:88px"><h3 class="boothCashCost">'+GameManager.company.name+'</h3>';

                        if (hasCurrentGame){
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:36px"><h4>'+currentGame.title+'</h4>';
                        }
                        else {
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:36px"><h4>'+(GameManager.company.gameLog && GameManager.company.gameLog.length > 0 ? GameManager.company.gameLog.last().title : '')+'</h4>';
                        }
                                            
                        break;                    

                        // custom booth
                        case 2:
                        digitBg.css({width:377, height:101, position:'relative', left:214, top:10, background:'url(./images/superb/counter/panel.png) no-repeat center', backgroundSize:'cover'});
                        
                        boothImageName = 'custom';

                        if (hasCurrentGame){
                            bootCaptionsHtml = '<div style="position:relative; width:100%; height: 20px; text-align:center; top:207px"><h5>'+currentGame.title+'</h5>';
                        }
                        else {
                            bootCaptionsHtml = '<div style="position:relative; width:100%; height: 20px; text-align:center; top:207px"><h5>'+(GameManager.company.gameLog && GameManager.company.gameLog.length > 0 ? GameManager.company.gameLog.last().title : '')+'</h5>';
                        }
                        bootCaptionsHtml  += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:74px"><h3 class="boothCashCost">'+GameManager.company.name+'</h3>';
                        break;
                    }
                    
                    container.css({width:'100%', height:450, background:'url(./mods/NoTypeWriterMod/img/booth_'+boothImageName+'.png) no-repeat center'});
                    
                    
                    container.append(digitBg);
                    container.append(bootCaptionsHtml);
                    
                    contentElement.append(container);
                    
                    // Create digits
                    var digits = (''+b).split('').reverse();
                    
                    for(var i = 0; i < 8; i++){
                        var v = 0;
                        if (i < digits.length){
                            v = digits[i];
                        }
                        
                        var digitImgFile = './images/superb/counter/'+v+'.png';
                        var digitImg     = $(document.createElement('div'));
                        digitImg.css({  position:'relative', left:((7-i))-24, top: 14, width:42, height:73, float:'right', background:'url('+digitImgFile+')', backgroundSize:'cover'});
                        digitBg.append(digitImg);
                    }
                    
                    // Show OK button
                    $('#gameConferenceAnimationDialog').find(".okButton").slideDown("fast");                    
                }
                else {
                    proxied.apply( this, arguments );
                }

            };
        })(this);
    }
    catch(ex) {
        alert('An exception occured in the NoTypeWriterMod Expansion!\r\n\r\n'+ex.message);
    }
    finally {
        
    }   

})();