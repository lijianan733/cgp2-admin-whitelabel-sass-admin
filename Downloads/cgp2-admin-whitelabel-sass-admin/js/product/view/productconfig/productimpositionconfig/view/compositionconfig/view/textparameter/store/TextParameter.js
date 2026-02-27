/**
 * Created by miao on 2021/6/09.
 */
Ext.define("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.store.TextParameter", {
    extend: 'Ext.data.Store',
    model: "CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.model.TextParameter",
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/textParameters',
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

});
