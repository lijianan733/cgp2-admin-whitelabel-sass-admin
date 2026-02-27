/**
 * Created by nan on 2020/11/17
 */

Ext.define("CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.store.FontStore", {
    extend: 'Ext.data.Store',
    requires: [
        'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.FontModel'
    ],
    model: "CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.FontModel",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/font',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})