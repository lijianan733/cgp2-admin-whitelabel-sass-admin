/**
 * Created by nan on 2018/4/17.
 */
Ext.define('CGP.partner.view.supportableproduct.store.EnableAddressStore', {
    extend: 'Ext.data.Store',
    request: 'CGP.partner.view.supportableproduct.model.EnableAddressModel',
    model: 'CGP.partner.view.supportableproduct.model.EnableAddressModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/receiveAddresses',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if (config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})
