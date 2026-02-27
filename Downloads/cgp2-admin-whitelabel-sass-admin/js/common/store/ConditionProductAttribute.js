/**
 * Created by miao on 2021/01/18.
 */
Ext.define('CGP.common.store.ConditionProductAttribute', {
    extend: 'Ext.data.Store',
    requires:['CGP.common.model.ConditionProductAttribute'],
    model: 'CGP.common.model.ConditionProductAttribute',
    autoLoad: true,
    proxy: {
        type: 'attribute_version_rest',
        url: adminPath + 'api/products/configurable/{id}/skuAttributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {
        var configurableId = config.productId;
        this.proxy.url = adminPath + 'api/products/configurable/' + configurableId + '/skuAttributes';
        this.callParent(arguments);
    }
});
