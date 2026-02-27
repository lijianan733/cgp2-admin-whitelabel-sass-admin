/**
 * Created by admin on 2019/12/17.
 */
Ext.define("CGP.product.model.MappingLinks", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        },
        'linkName','clazz',
        {
            name: 'productId',
            type: 'int'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/mappingLink',
        reader: {
            type: 'json',
            root:'data'
        }
    }
});