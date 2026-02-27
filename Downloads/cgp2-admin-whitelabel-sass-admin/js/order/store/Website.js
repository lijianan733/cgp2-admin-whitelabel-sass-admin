 Ext.define('CGP.order.store.Website', {
     requires: 'CGP.order.model.Website',
     extend: 'Ext.data.Store',
     model: 'CGP.order.model.Website',
     remoteSort: false,
     pageSize: 25,
     proxy: {
         type: 'uxrest',
         url: adminPath + 'api/websites',
         reader: {
             type: 'json',
             root: 'data.content'
         }
     },
     autoLoad: true
 });