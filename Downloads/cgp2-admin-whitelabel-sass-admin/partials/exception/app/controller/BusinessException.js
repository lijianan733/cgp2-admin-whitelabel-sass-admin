/**
 * BusinessException
 * @Author: miao
 * @Date: 2021/12/17
 */
 Ext.define('CGP.exception.controller.BusinessException', {
     extend: 'Ext.app.Controller',
     stores: [
         'BusinessException'
     ],
     models: ['BusinessException'],
     views: [
         'ParamsGrid',
         'ParamForm'
     ],
     init: function() {
         this.control({
             'viewport grid button[itemId=createbtn]': {
                 click: this.editRGB
             }
         });
     },
     editRGB: function(btn) {

     },

     addParams:function (grid,record){
         var createOrEdit=record?'edit':'create';

         Ext.create('Ext.window.Window', {
             title: i18n.getKey(createOrEdit) + i18n.getKey('params'),
             layout: 'fit',
             modal: true,
             items: [
                 {
                     xtype: 'paramform',
                     itemId: 'paramForm',
                     border: false,
                     record: record
                 }
             ],
             bbar: [
                 '->',
                 {
                     xtype: 'button',
                     text: i18n.getKey('confirm'),
                     handler: function (btn) {
                         var win = btn.ownerCt.ownerCt;
                         var form = win.getComponent('paramForm');
                         if (!form.isValid()) {
                             return false;
                         }
                         var data = form.getValue();
                         if (Ext.isEmpty(record)) {
                             data._id = JSGetCommonKey();
                             grid.store.add(data)
                         } else {
                             for (var i in data) {
                                 record.set(i, data[i]);
                             }
                         }
                         // ruleGrid.store.load();
                         win.close();
                     }
                 },
                 {
                     xtype: 'button',
                     text: i18n.getKey('cancel'),
                     handler: function () {
                         this.ownerCt.ownerCt.close();
                     }
                 }
             ]

         }).show();
     },

     deleteParams:function (grid){
         var selecteds = grid.getSelectionModel().getSelection();
         if (selecteds.length > 0) {
             grid.store.remove(selecteds);
         } else {
             Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('未选中数据!'));
         }
     }
 });