Ext.define('CGP.product.view.productattributeconstraint.store.MultiDiscreteValueConstraint', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productattributeconstraint.model.MultiDiscreteValueConstraint',
    autoSync: true,
    //    expanded: true,
    autoLoad: true,
    constructor: function (config) {
        this.proxy = {
            type: 'uxrest',
            url: adminPath + 'api/products/'+config.productId+'/attributeConstraints/v2',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            reader: {
                type: 'json',
                root: 'data'
            }
        };

        this.callParent(arguments);

    }
});
