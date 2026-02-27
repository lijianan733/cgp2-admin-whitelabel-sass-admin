/**
 * Created by nan on 2019/11/5.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.store.CalculateContinuousConstraintStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.CalculateContinuousConstraintModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/singleAttributeConstraints',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
