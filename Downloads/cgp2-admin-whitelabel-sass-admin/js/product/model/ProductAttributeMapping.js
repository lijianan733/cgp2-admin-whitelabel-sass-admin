/**
 * Created by admin on 2019/12/17.
 */
Ext.define("CGP.product.model.ProductAttributeMapping", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        'description', 'clazz',
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'attributeMappingDomain',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productAttributeMappings',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
