/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-05-25 09:53
 */


define(function (require, exports, module) {
    /**
     * @module ui/CtrlList/
     */

    'use strict';

    var ui = require('../');
    var Popup = require('../Popup/');
    var Template = require('../../libs/Template.js');
    var style = require('./style.css', 'css');
    var template = require('./template.html', 'html');
    var tpl = new Template(template);
    var event = require('../../core/event/hotkey.js');
    var selector = require('../../core/dom/selector.js');
    var modification = require('../../core/dom/modification.js');
    var attribute = require('../../core/dom/attribute.js');
    var typeis = require('../../utils/typeis.js');
    var dato = require('../../utils/dato.js');
    var doc = document;
    var alienClass = 'alien-ui-ctrllist';
    var alienIndex = 0;
    var defaults = {
        offset: {
            left: 0,
            top: 0
        }
    };

    var CtrlList = ui.create({
        constructor: function (list, options) {
            var the = this;

            the._list = list || [];
            the._options = dato.extend(true, {}, defaults, options);
            the._init();
        },


        /**
         * 更新 list
         * @param list {Array} 列表
         * @returns {CtrlList}
         */
        update: function (list) {
            var the = this;

            list = list || [];
            the._list = list.map(function (item) {
                if (typeis.string(item)) {
                    return {
                        text: item,
                        value: item
                    };
                }

                return item;
            });

            the._length = the._list.length;
            the._index = 0;

            if (the._length) {
                the._text = the._list[0].text;
                the._value = the._list[0].value;
            }

            the._popup.setContent(tpl.render({
                list: the._list,
                id: alienIndex++
            }));
            the._$items = selector.query('.' + alienClass + '-item', the._$popup);

            return the;
        },


        /**
         * 打开控制列表
         * @param [position] {Object} 指定位置
         * @param [position.width] {Number} 指定位置
         * @param [position.height] {Number} 指定位置
         * @param [position.pageX] {Number} 指定位置
         * @param [position.left] {Number} 指定位置
         * @param [position.top] {Number} 指定位置
         * @param [position.pageY] {Number} 指定位置
         * @param [callback] {Function} 回调
         * @returns {CtrlList}
         */
        open: function (position, callback) {
            var the = this;

            if (position && 'pageX' in position) {
                position.width = 1;
                position.height = 1;
                position.left = position.pageX;
                position.top = position.pageY;
            }

            the.emit('open');

            if (the.visible) {
                the._popup.close(function () {
                    the._popup.open(position, callback);
                });
            } else {
                the.visible = true;
                the._popup.open(position, callback);
            }

            return the;
        },


        /**
         * 关闭控制列表
         * @param callback
         * @returns {CtrlList}
         */
        close: function (callback) {
            var the = this;

            the.visible = false;
            the._popup.close(callback);
            the.emit('close');

            return the;
        },


        /**
         * 初始化
         * @private
         */
        _init: function () {
            var the = this;

            the._initNode();
            the.update(the._list);
            the._initEvent();
        },


        /**
         * 初始化节点
         * @private
         */
        _initNode: function () {
            var the = this;

            the._popup = new Popup(window, {
                arrowSize: 0,
                priority: 'side',
                offset: the._options.offset,
                addClass: alienClass
            });
            the._$popup = the._popup.getNode();
        },

        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var activeClass = alienClass + '-item-active';
            var activeIndex = function () {
                var $ele = the._$items[the._index];

                the._value = attribute.data($ele, 'value');
                the._text = $ele.innerText;
                attribute.removeClass(the._$items, activeClass);
                attribute.addClass($ele, activeClass);
            };

            // 悬浮高亮
            event.on(the._$popup, 'mouseover', '.' + alienClass + '-item', function () {
                the._index = attribute.data(this, 'index') * 1;
                activeIndex();
            });

            // 上移
            event.on(doc, 'up', function () {
                if (!the.visible || the._index === 0) {
                    return;
                }

                the._index--;
                activeIndex();
            });

            // 下移
            event.on(doc, 'down', function () {
                if (!the.visible || the._index === the._length - 1) {
                    return;
                }

                the._index++;
                activeIndex();
            });

            // esc
            event.on(doc, 'esc', function () {
                if (!the.visible) {
                    return;
                }

                the.close();
            });

            // enter
            event.on(doc, 'return', function () {
                if (!the.visible) {
                    return;
                }

                the.emit('sure', {
                    text: the._text,
                    value: the._value,
                    index: the._index
                });
                the.close();
            });
        }
    });

    modification.importStyle(style);
    CtrlList.defaults = defaults;
    module.exports = CtrlList;
});