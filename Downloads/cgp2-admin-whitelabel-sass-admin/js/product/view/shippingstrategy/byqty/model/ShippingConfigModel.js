Ext.define("CGP.product.view.shippingstrategy.byqty.model.ShippingConfigModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        'clazz', {
            name: 'name',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/areaShippingConfigGroups',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
