Ext.define('CGP.product.view.productattributeprofile.store.ProfileStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productattributeprofile.model.ProfileModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/attributeProfile',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'sort',
        direction: 'ASC'
    }],
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
});
