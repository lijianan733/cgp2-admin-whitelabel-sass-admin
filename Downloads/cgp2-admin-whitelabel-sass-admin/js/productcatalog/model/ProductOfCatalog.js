Ext.define('CGP.productcatalog.model.ProductOfCatalog', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            "name": "_id",
            "type": "string"
        },
        {
            "name": "catalog",
            "type": "object"
        },
        {
            "name": "clazz",
            "type": "string"
        },
        {
            "name": "priority",
            "type": "number"
        },
        {
            "name": "product",
            "type": "object"
        },
        {
            "name": "productImage",
            "type": "object"
        },
        {
            "name": "hoverImage",
            "type": "object"
        },
        {
            "name": "productId",
            "type": "number",
            "persist": false,
            convert: function (value, record) {
                return record.get("product")?.id;
            }
        },
        {
            "name": "type",
            "type": "string",
            "persist": false,
            convert: function (value, record) {
                return record.get("product")?.type;
            }
        },
        {
            "name": "name",
            "type": "string",
            "persist": false,
            convert: function (value, record) {
                return record.get("product")?.name;
            }
        },
        {
            "name": "sku",
            "type": "string",
            "persist": false,
            convert: function (value, record) {
                return (record.get("product")?.sku);
            }
        },
        {
            "name": "model",
            "type": "string",
            "persist": false,
            convert: function (value, record) {
                return record.get("product")?.model;
            }
        },
        {
            "name": "configurableProductId",
            "type": "string",
            "persist": false,
            convert: function (value, record) {
                return record.get("product")?.configurableProductId;
            }
        },
        //该产品在该类目下的描述信息
        {
            name: 'description',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/product-of-catalog',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
