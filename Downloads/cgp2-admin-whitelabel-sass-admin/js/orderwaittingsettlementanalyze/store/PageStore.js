Ext.define('CGP.orderwaittingsettlementanalyze.store.PageStore', {
     extend: 'Ext.data.Store',
     model: 'CGP.orderwaittingsettlementanalyze.model.Model',
     remoteSort: true,
     pageSize: 20,
     autoLoad: true,
     proxy: {
         type: 'uxrest',
         url: adminPath + 'api/partnerSettleItems',
         reader: {
             type: 'json',
             root: 'data.content'
         }
     },
     sorters: [{
         property: 'order.receivedDate',
         direction: 'ASC'
    }]
 });