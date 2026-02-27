/**
 * Created by admin on 2019/9/26.
 */
Ext.define('CGP.redodetails.store.RedoLineItems', {
    extend: 'Ext.data.Store',
    requires: 'CGP.redodetails.model.RedoLineItems',
    model: 'CGP.redodetails.model.RedoLineItems',
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
        me.proxy.url = Ext.String.format(url, 0);
        me.callParent(arguments);
    }
})