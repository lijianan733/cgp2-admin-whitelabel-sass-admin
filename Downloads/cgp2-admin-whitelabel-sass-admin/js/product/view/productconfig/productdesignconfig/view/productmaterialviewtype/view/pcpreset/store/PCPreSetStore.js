/**
 * Created by nan on 2021/9/2
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.store.PCPreSetStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.model.PCPreSetModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcResourceContents',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (!Ext.isEmpty(config) && !Ext.isEmpty(config.params)) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
});
