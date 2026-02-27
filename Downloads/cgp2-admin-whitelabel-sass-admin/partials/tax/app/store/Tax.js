/**
 * Tax
 * @Author: C-1316
 * @Date: 2021/11/2
 */
 Ext.define('CGP.tax.store.Tax', {
     extend: 'Ext.data.Store',
     requires: ['CGP.tax.model.Tax'],

     model: 'CGP.tax.model.Tax',
     remoteSort: true,
     sorters: [{
         property: '_id',
         direction: 'DESC'
     }],
     /**
      * @cfg {Number} pageSize
      * 每页的记录数
      */
     pageSize:25,
     proxy: {
         type: 'uxrest',
         url: adminPath + 'api/tax',
         reader: {
             type: 'json',
             root: 'data.content'
         }
     },
     autoLoad: true,
     constructor:function (config){
         var me=this;
         if (config && config.params) {
             me.proxy.extraParams = config.params;
         }
         me.callParent(arguments);
     }
 });