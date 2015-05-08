/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-01-04 21:45
 */


define(function (require, exports, module) {
    'use strict';

    var Imgview = require('/src/ui/Imgview/');
    var imgview = new Imgview();
    var list = [];

    list.push('http://img.tuku.com/upload/attach/2013/06/94949-7IUzBD6.jpg?v=' + Date.now());
    list.push('http://i7.qhimg.com/t010b7ba69e34d4c33b.jpg?v=' + Date.now());
    list.push('http://prolicn.com/wp-content/uploads/2014/11/201241822073021.jpg?v=' + Date.now());
    list.push('http://i3.img.969g.com/mtf/imgx2013/12/19/234_150213_e3f92.jpg?v=' + Date.now());

    document.getElementById('btn').onclick = function () {
        imgview.open(list);
    };
});