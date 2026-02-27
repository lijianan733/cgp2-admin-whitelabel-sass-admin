Ext.define('CGP.order.store.PriceNumbers', {
     extend: 'Ext.data.Store',
     fields: [{
             name: 'id',
             type: 'int'
         }, {
             name: 'seqNo',
             type: 'int'
        }, 'productName', 'productModel', 'productSku', 'imageUrl', 'projectImage',
         {
             name: 'price',
             type: 'float',
             convert: function (v, record) {
                 if (Ext.isString(v)) {
                     return Ext.Number.from(v.substring(1));
                 } else {
                     return v;
                 }

             }
        }, {
             name: 'amount',
             type: 'float',
             convert: function (v, record) {
                 if (Ext.isString(v)) {
                     return Ext.Number.from(v.substring(1));
                 } else {
                     return v;
                 }

             }
        }, {
             name: 'qty',
             type: 'int'
        }, {
             name: 'projectId',
             type: 'int',
             useNull: true
        }, {
             name: 'productAttributeValues',
             type: 'array'
        }, {
             name: 'customAttributeValues',
             type: 'array'
        }, {
             name: 'workOrderLineItem',
             type: 'object'
        }, //work info
         {
             name: 'workLineItemExist',
             type: 'boolean'
         },
         {
             name: 'workOrderLineItemQty',
             type: 'int'
         },
         //name totalQty completedQty status 
         {
             name: 'workOrderLineItems',
             type: 'array'
        }, {
             name: 'builderType',
             type: 'string'
         },{
             name: 'uploadFiles',
             type: 'array'
         },{
             name: 'comment',
             type: 'string'
         }],
     proxy: {
         type: 'uxrest',
         url: adminPath + 'api/orders/{orderId}/lineItemsV2',
         reader: {
             type: 'json',
             root: 'data'
         }
     },
     autoLoad: true,

     url: adminPath + 'api/orders/{0}/lineItemsV2',

     constructor: function (config) {
         var me = this;
         var url = Ext.clone(me.url);
         me.proxy.url = Ext.String.format(url, config.orderId);
         me.callParent(arguments);
     }
 });