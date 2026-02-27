Ext.define('CGP.product.view.multiattributeonewaypropertyvalueconfig.model.ConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string'
    }, {
        name: 'inAttribute',
        type: 'array'
    }, {
        name: 'attributePropertyValue',
        type: 'array'
    }, {
        name: 'condition',
        type: 'object'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/productCategory',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});