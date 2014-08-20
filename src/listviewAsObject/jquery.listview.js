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
;(function ($, doc, win) {
    "use strict";

    var name = 'jq-listView';
    
    function ListView(el, opts) {
        this.$el = $(el);

        this.defaults = {
            data: [],
            optionItems: [],
            pScrollEnable: false
        };

        var meta = this.$el.data(name + '-opts');
        //this.opts = $.extend(this.defaults, opts, meta);
        this.opts = $.extend({}, this.defaults, opts); //defaults will not be alter

        //this.Event = Event;
        //this.onChange = new ListView.Event();
        
        $.extend(this, {
            "listViewVersion": "1.0",

            //Methods
            'init': init
        });

        this.init();        
    }

    // Extend the core jQuery event object.
    ListView.prototype = new $.Event("");

    // General
    function init() {
        this.$el.addClass("jListView").attr('tabindex', 0);
        var width = '',
            $this = this.$el,
            opt = this.opts;
            
        if (this.opts.data.length > 0 && typeof this.opts.data[0] === 'object') {
            if (Object.keys) {
                //get number of property Object.keys
                width = (this.$el.width() / Object.keys(this.opts.data[0]).length) - 15; //get number of property
            } else {
                //fixed for IE9 and below
                var keys = [];
                $.each(this.opts.data[0], function (key, value) {
                    keys.push(key)
                });
                width = (this.$el.width() / keys.length) - 15;                
            }
        }
            
        //add item to listView 
        for (var i = 0; i < this.opts.data.length; i++) {
            var $div = $('<div class="jListOption" tabindex="-1">');

            if (typeof this.opts.data[i] === 'object') {
                $.each(this.opts.data[i], function (key, value) {
                    //get the matching option item setting
                    var tempArr = $.grep(opt.optionItems, function (n) { return n.id === key; });

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

            $div.click(function(e) {
                $("div", $this).removeClass("jListItemSelected");
                $(this).addClass("jListItemSelected");
                $(this).parent().focus();
            });

            //add div attribute id key
            $div.attr('data-id', '');

            this.$el.append($div);

            if (i < (this.opts.data.length - 1) || this.opts.data.length === 1) {
                $div.css("border-bottom", "1px solid #c0c0c0");
            }            
        }

        this.binding();
        this.preventPageScroll();
    };

    ListView.prototype = {
        updateSelectItem: function (newSelectItem) {
            if (newSelectItem.length > 0) {
                $("div", this.$el).removeClass("jListItemSelected");
                newSelectItem.addClass('jListItemSelected').focus();
            }
            this.$el.focus();
        },
        destroy: function () {
            this.$el.removeData(name);
            this.$el = null;
        },
        //stop page scrolling on hover div
        preventPageScroll: function () {
            //http://stackoverflow.com/questions/7600454/how-to-prevent-page-scrolling-when-scrolling-a-div-element
            this.$el.on('mousewheel DOMMouseScroll', function (e) {
                var e0 = e.originalEvent,
                    delta = e0.wheelDelta || -e0.detail;

                this.scrollTop += (delta < 0 ? 1 : -1) * 30;
                e.preventDefault();
            });
        },
        getItem: function (callBack) {
            var idx = this.$el.find('.jListItemSelected').index();
            console.log(JSON.stringify(this.opts.data[idx]));

            if (typeof callBack === "function") {
                callBack(row);
            }

            return this.opts.data[idx];
        }
    };

    ListView.prototype.binding = function () {
        var self = this;

        this.$el.unbind('addItem updtItem setItems getItem removeItem removeAll')
        .bind("addItem", function(e, itemData, callback) {
            //addItem(itemData, callback);
            //e.callback();			    
        })
        .bind("updtItem", function(e, cellData, callback) {
        })
        .bind("setItems", function(e, schdlData, schdlSetting, callBack) {            
        })
        .bind("getItem", function(e, callBack) {
            return self.getItem(callBack);
        })
        .bind("removeItem", function(e) {
            //removeItem();
        })
        .bind("removeAll", function(e, callBack) {
            //removeAllItem(callBack);
        });

        //this methods blow is for key up and down
        this.$el.on('focusout', function (e) {
            $('body').unbind('keydown');
        })        
        .on('focus', function (e) {
            var ar = new Array(33, 34, 35, 36, 37, 38, 39, 40);
            //this prevent div overflow weird scrolling
            $('body').keydown(function (e) {
                var key = e.which;

                if ($.inArray(key, ar) > -1) {
                    e.preventDefault();
                    return false;
                }
                return true;
            });
        })
        .on('keyup', function (e) {
            var $selectedItem = self.$el.find('.jListItemSelected');

            //if nothing has selected
            if ($selectedItem.length === 0 && (e.keyCode == 38 || e.keyCode == 40)) {
                self.$el.find('.jListOption').first().addClass('jListItemSelected');
                return;
            }
                        
            if (e.keyCode == 38) { //up key
                var $prevDiv = $selectedItem.prev('.jListOption');
                self.updateSelectItem($prevDiv);
            }            
            else if (e.keyCode == 40) { //down key
                var $nextDiv = $selectedItem.next('.jListOption');
                self.updateSelectItem($nextDiv);
            }
            self.$el.focus();
        });
            
        //set perfectScrollbar if it reference and is enable
        if (this.opts.pScrollEnable && $().perfectScrollbar !== undefined) {
            this.$el.css('overflow', 'hidden');
            this.$el.css('position', 'relative');
                
            this.$el.perfectScrollbar({
                wheelSpeed: 20,
                wheelPropagation: false
            });
        } else {
            this.$el.css('overflow', 'auto');
            this.$el.css('display', 'block');
        }
    };

    $.fn.listView = function (opts) {
        return this.each(function () {
            new ListView(this, opts);
        });
    };
})(jQuery, document, window);