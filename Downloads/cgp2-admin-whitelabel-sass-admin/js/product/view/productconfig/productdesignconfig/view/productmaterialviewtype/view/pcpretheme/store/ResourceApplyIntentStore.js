/**
 * Created by nan on 2021/10/15
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.store.ResourceApplyIntentStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.model.PCResourceApplyIntentModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcResourceApplyIntents',
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