/**
 * Created by admin on 2019/9/26.
 */
Ext.define('CGP.redodetails.store.OrderLineItems', {
        extend: 'Ext.data.Store',
        requires: 'CGP.redodetails.model.OrderLineItems',
        model: 'CGP.redodetails.model.OrderLineItems',
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
            me.proxy.url = Ext.String.format(url, Ext.Object.fromQueryString(location.search).id);
            me.callParent(arguments);
        }
    })