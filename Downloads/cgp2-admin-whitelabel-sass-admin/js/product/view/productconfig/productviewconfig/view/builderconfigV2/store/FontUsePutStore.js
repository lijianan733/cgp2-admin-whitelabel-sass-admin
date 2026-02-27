/**
 * Created by nan on 2020/11/17
 * 使用 put方法来查询数据
 */
Ext.define("CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.store.FontUsePutStore", {
    extend: 'Ext.data.Store',
    requires: [
        'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.FontModel'
    ],
    model: "CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.FontModel",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/builderconfigs/v2/filter/fonts',
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