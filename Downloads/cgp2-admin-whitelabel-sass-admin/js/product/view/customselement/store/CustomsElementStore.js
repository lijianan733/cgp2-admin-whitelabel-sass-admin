/**
 * Created by nan on 2018/9/10.
 */
Ext.define('CGP.product.view.customselement.store.CustomsElementStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.customselement.model.CustomsElementModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/customsElement',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
})