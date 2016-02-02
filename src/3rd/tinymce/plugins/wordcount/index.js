define(function (require) {
    var tinymce = window.tinymce;
    var PluginManager = require("../../classes/AddOnManager").PluginManager;
    var controller = require('../../../../utils/controller.js');

    /**
     * plugin.js
     *
     * Released under LGPL License.
     * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
     *
     * License: http://www.tinymce.com/license
     * Contributing: http://www.tinymce.com/contributing
     */

    /*global tinymce:true */

    PluginManager.add('wordcount', function (editor) {
        var self = this, countre, cleanre;

        // Included most unicode blocks see: http://en.wikipedia.org/wiki/Unicode_block
        // Latin-1_Supplement letters, a-z, u2019 == &rsquo;
        countre = editor.getParam('wordcount_countregex', /[\w\u2019\x27\-\u00C0-\u1FFF]+/g);
        //cleanre = editor.getParam('wordcount_cleanregex', /[0-9.(),;:!?%#$?\x27\x22_+=\\\/\-]*/g);

        function update() {
            console.log('update', self.getCount());
            editor.theme.panel.find('#wordcount').text(['Words: {0}', self.getCount()]);
        }

        editor.on('init', function () {
            var statusbar = editor.theme.panel && editor.theme.panel.find('#statusbar')[0];

            if (statusbar) {
                tinymce.util.Delay.setEditorTimeout(editor, function () {
                    statusbar.insert({
                        type: 'label',
                        name: 'wordcount',
                        text: ['Words: {0}', self.getCount()],
                        classes: 'wordcount',
                        disabled: editor.settings.readonly
                    }, 0);

                    editor.on('change keyup', controller.debounce(update));

                    //editor.on('keyup', function (e) {
                    //    if (e.keyCode == 32) {
                    //        update();
                    //    }
                    //});
                }, 0);
            }
        });

        self.getCount = function () {
            var tx = editor.getContent({format: 'raw'});
            var tc = 0;

            if (tx) {
                tx = tx.replace(/\.\.\./g, ' '); // convert ellipses to spaces
                tx = tx.replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' '); // remove html tags and space chars

                // deal with html entities
                tx = tx.replace(/(\w+)(&#?[a-z0-9]+;)+(\w+)/i, "$1$3").replace(/&.+?;/g, ' ');
                //tx = tx.replace(cleanre, ''); // remove numbers and punctuation

                var wordArray = tx.match(countre);

                if (wordArray) {
                    tinymce.each(wordArray, function (words) {
                        tc += words.length;
                    });
                }
            }

            return tc;
        };
    });
});