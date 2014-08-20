/*!
* ListView 1.0 plugin!
* @requires jQuery v1.8.3+
*
* Copyright (c) 2013 Man Nguyen
* Licences: MIT
* Feel free to use or modify this plugin as far as my full name is kept
*
* @type jQuery
* @name listView
* @author Man Nguyen
* @remark pScroll work on IE9 but it does show scroll. Dawn crappy IE.
*/
; (function ($) {
    $.fn.listView = function(options) {
        var $this = $(this),
            setting;

        setting = $.extend({
            data: [],
            optionItems: [],
            pScrollEnable: false
        }, options);
        
		//http://stackoverflow.com/questions/7600454/how-to-prevent-page-scrolling-when-scrolling-a-div-element
		$this.bind( 'mousewheel DOMMouseScroll', function ( e ) {
			var e0 = e.originalEvent,
				delta = e0.wheelDelta || -e0.detail;

			this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
			e.preventDefault();
		});
        
        function addItem(schdlData, callBack) {
            if (typeof callBack === "function") {
                callBack(row);
            }
        }

        function getItem(callBack) {
            var idx = $this.find('.jListItemSelected').index();
            console.log(JSON.stringify(setting.data[idx]));

            if (typeof callBack === "function") {
                callBack(row);
            }

            return setting.data[idx];
        }

        function removeAllItem(callBack) {
            $this.empty();

            if (typeof callBack === "function") {
                callBack(row);
            }
        }

        function updateSelectItem(newSelectItem, self) {
            if (newSelectItem.length > 0) {
                $("div", self).removeClass("jListItemSelected");
                newSelectItem.addClass('jListItemSelected').focus();
            }            
        }
        
        function init() {
            $this.addClass("jListView").attr('tabindex', 0);
            var width = '';
            
            if (setting.data.length > 0 && typeof setting.data[0] === 'object') {
                if (Object.keys) {
                    //get number of property Object.keys
                    width = ($this.width() / Object.keys(setting.data[0]).length) - 15;
                } else {
                    //fixed for IE9 and below
                    var keys = [];
                    $.each(this.opts.data[0], function (key, value) {
                        keys.push(key)
                    });
                    width = ($this.width() / keys.length) - 15;
                }
            }
            
            //add item to listView 
            for (var i = 0; i < setting.data.length; i++) {
                var $div = $('<div class="jListOption" tabindex="-1">');
                
                if (typeof setting.data[i] === 'object') {
                    $.each(setting.data[i], function (key, value) {
                        //get the matching option item setting
                        var tempArr = $.grep(setting.optionItems, function (n) { return n.id === key; });
                        
                        //if formatter is a fuction than use the giving element
                        if (typeof tempArr[0].formatter == "function") {
                            var $ele = $(tempArr[0].formatter(true));
                            
                            //this 2 if need to go of this if condition
                            if (tempArr[0].width !== undefined) {
                                $ele.css("width", tempArr[0].width + "px");
                            }
                            if (tempArr[0].cssClass !== undefined) {
                                $ele.addClass(tempArr[0].cssClass);
                            }

                            $ele.addClass('jListOptItem');
                            $ele.append(value);
                            $div.append($ele);
                        } else {
                            $div.append('<span class="jListOptItem" style="width: ' + width + 'px;">' + value + '</span>');
                        }
                    });
                } else {
                    $span.append(opt.data[i]);
                    $div.append($span);
                }
                
                $div.click(function (e) {
                    $("div", $this).removeClass("jListItemSelected");
					
                    $(this).addClass("jListItemSelected");//.focus().attr('tabindex',-1); //this is to add focus to the div
                    $(this).parent().focus();
                });
                
                //add div attribute id key
                $div.attr('data-id', '');
                
                $this.append($div);

                if (i < (setting.data.length - 1) || setting.data.length === 1) {
                    $div.css("border-bottom", "1px solid #c0c0c0");
                }
            }
        }

        return this.each(function () {
            var $self = $(this);
            init();

            $self.unbind('addItem updtItem setItems getItem removeItem removeAll focusin')
            .bind("addItem", function (e, itemData, callback) {
                addItem(itemData, callback);
                //e.callback();			    
            })
            .bind("updtItem", function (e, cellData, callback) {
                UpdateSchedule(cellData);
            })
            .bind("setItems", function (e, schdlData, schdlSetting, callBack) {
                SetSchedule(schdlData, schdlSetting, callBack);
            })
            .bind("getItem", function (e, callBack) {
                return getItem(callBack);
            })
            .bind("removeItem", function (e) {
                removeItem();
            })
            .bind("removeAll", function (e, callBack) {
                removeAllItem(callBack);
            });

            //this methods blow is for key up and down
            $self.on('focusout', function (e) {
                $('body').unbind('keydown');
            })            
            .on('focus', function (e) {
                var ar = new Array(33, 34, 35, 36, 37, 38, 39, 40);
                //this prevent div overflow weird scrolling
                $('body').bind('keydown', function (e) {
                    var key = e.which;

                    if ($.inArray(key, ar) > -1) {
                        e.preventDefault();
                        return false;
                    }
                    return true;
                });
            })
            .on('keyup', function (e) {
                var $selectedItem = $self.find('.jListItemSelected');

                //if nothing has selected
                if ($selectedItem.length === 0 && (e.keyCode == 38 || e.keyCode == 40)) {
                    $self.find('.jListOption').first().addClass('jListItemSelected');
                    return;
                }

                //up key
                if (e.keyCode == 38) {
                    var $prevDiv = $selectedItem.prev('.jListOption');
                    updateSelectItem($prevDiv, $self);
                }
                //down key
                else if (e.keyCode == 40) {
                    var $nextDiv = $selectedItem.next('.jListOption');
                    updateSelectItem($nextDiv, $self);
                }
                $self.focus();
            });
            
            //set perfectScrollbar if it reference and is enable
            if (setting.pScrollEnable && $().perfectScrollbar !== undefined) {
                $self.css('overflow', 'hidden');
                $self.css('position', 'relative');
                
                $self.perfectScrollbar({
                    wheelSpeed: 20,
                    wheelPropagation: false
                });
            } else {
                $self.css('overflow', 'auto');
                $self.css('display', 'block');
            }

        });
    };
})(jQuery);