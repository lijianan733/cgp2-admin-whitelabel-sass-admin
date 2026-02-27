 Ext.define('CGP.order.store.Order', {
     requires: 'CGP.order.model.Order',
     extend: 'Ext.data.Store',
     model: 'CGP.order.model.Order',
     remoteSort: true,
     pageSize: 20,
     proxy: {
         type: 'uxrest',
         url: adminPath + 'api/ordersV2',
         reader: {
             type: 'json',
             root: 'data.content'
         }
     },
     sorters: [{
         property: 'datePurchased',
         direction: 'DESC'
    }]
 });
