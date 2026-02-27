/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.define('partner.productSupplier.model.ProductOfManufacturesModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true,
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.partner.cooperation.manufacture.Manufacture'
        },
        {
            name: 'status',
            type: 'string'
        },
        {
            name: 'manufacture',
            type: 'object'
        },
        {
            name: 'productScope',
            type: 'object',
            convert: function (value, record) {
                var productScope = record.get('productSupportScope');
                var versionedProductAttribute = Ext.clone(value?.versionedProductAttribute);
                var result = Ext.Object.merge(value, productScope);
                result.versionedProductAttribute = versionedProductAttribute;
                return result;
            }
        },
        {
            name: 'pmvtMapping',
            type: 'object'
        },
        {
            name: 'pmvtMappingV2',
            type: 'array',
            useNull: true
        },
        {
            name: 'productSupportScope',
            type: 'object'
        },
        {
            name: 'manufactureProduct',
            type: 'object'
        },
        {
            name: 'product',
            type: 'object',
            convert: function (value, record) {
                var productScope = record.get('productScope');
                return productScope['product'];
            }
        },
        {
            name: 'name',
            type: 'object',
            convert: function (value, record) {
                var product = record.get('product');
                return product['name'];
            }
        },
        {
            name: 'model',
            type: 'object',
            convert: function (value, record) {
                var product = record.get('product');
                return product['model'];
            }
        },
        {
            name: 'sku',
            type: 'object',
            convert: function (value, record) {
                var product = record.get('product');
                return product['sku'];
            }
        },
        {
            name: 'productId',
            type: 'object',
            convert: function (value, record) {
                var product = record.get('product');
                return product['_id'];
            }
        },
        {
            name: 'versionedProductAttribute',
            type: 'object'
        }
    ],
})