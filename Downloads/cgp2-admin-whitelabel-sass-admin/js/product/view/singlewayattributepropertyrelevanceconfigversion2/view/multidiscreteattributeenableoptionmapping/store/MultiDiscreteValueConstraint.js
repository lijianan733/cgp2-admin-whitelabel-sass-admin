Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.store.MultiDiscreteValueConstraint', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.model.MultiDiscreteValueConstraint',
    autoSync: true,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/multiDiscreteAttributeEnableOptionMappings',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
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
