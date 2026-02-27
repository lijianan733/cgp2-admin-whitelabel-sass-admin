/**
 * AreaTax
 * @Author: miao
 * @Date: 2021/11/4
 */
 Ext.define('CGP.tax.store.AreaTax', {
     extend: 'Ext.data.Store',
     requires: ['CGP.tax.model.AreaTax'],

     model: 'CGP.tax.model.AreaTax',
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
         url: adminPath + 'api/areatax',
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