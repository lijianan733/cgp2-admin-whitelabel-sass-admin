/**
 * StateFlow
 * @Author: miao
 * @Date: 2021/12/27
 */
 Ext.define('CGP.state.controller.StateFlow', {
     extend: 'Ext.app.Controller',
     stores: [
         'StateFlow'
     ],
     models: ['StateFlow'],
     views: [
     ],
     init: function() {
         this.control({
             'viewport grid button[itemId=createbtn]': {
                 click: this.editRGB
             }
         });
     },
     editRGB: function(btn) {

     }
 });