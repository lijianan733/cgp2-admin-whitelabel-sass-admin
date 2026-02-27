/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.define('partner.productSupplier.model.ProductMaterialViewTypeModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true,
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.bom.ProductMaterialViewType'
        },
        {
            name: 'materialPath',
            type: 'string'
        },
        {
            name: 'materialViewType',
            type: 'object'
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'nameId',
            type: 'string',
            convert: function (value, record) {
                var name = record.get('name');
                var id = record.get('_id');
                return `${name} <${id}>`
            }
        },
        {
            name: 'productConfigDesignId',
            type: 'int'
        },
        {
            name: 'conditionExpression',
            type: 'string'
        },
        {
            name: 'productMaterialViewTypeId',
            type: 'string'
        },
        {
            name: 'materialSelector',
            type: 'object'
        },
    ],
})