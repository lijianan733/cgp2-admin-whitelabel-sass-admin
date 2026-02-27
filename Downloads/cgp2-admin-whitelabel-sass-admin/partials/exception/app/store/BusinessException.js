/**
 * BusinessException
 * @Author: miao
 * @Date: 2021/12/17
 */
 Ext.define('CGP.exception.store.BusinessException', {
     extend: 'Ext.data.Store',
     requires: ['CGP.exception.model.BusinessException'],

     model: 'CGP.exception.model.BusinessException',
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
         url: adminPath + 'api/businessExceptionInfo',
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