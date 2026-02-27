 Ext.define('CGP.order.store.OrderTotal', {
     extend: 'Ext.data.Store',
     fields: ['title', 'text',{
         name: 'sortOrder',
         type: 'int'
     },{
         name: 'value',
         type: 'float'
     }],
     proxy: {
         type: 'uxrest',
         url: adminPath + 'api/orders/{orderId}/orderTotals',
         reader: {
             type: 'json',
             root: 'data'
         }
     },
     autoLoad: true,
     url: adminPath + 'api/orders/{0}/orderTotals',
     sorters : [{
         property : 'sortOrder',
         direction : 'ASC'
     }],
     constructor: function (config) {
         var me = this;
         var url = Ext.clone(me.url);
         me.proxy.url = Ext.String.format(url, config.orderId);
         me.callParent(arguments);
         me.on("write",function(store){
             store.sort("sortOrder","ASC");
         });
     }
 });
