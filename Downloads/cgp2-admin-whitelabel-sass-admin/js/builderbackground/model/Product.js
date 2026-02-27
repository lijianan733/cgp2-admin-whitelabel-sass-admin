Ext.define("CGP.builderbackground.model.Product",{
	extend : 'Ext.data.Model',
	fields : [{
            name: 'id',
            type: 'int',
            useNull: true
    }, 'model', 'name', 'sku',
             'shortDescription', 'description1',
             'description2', 'description3', 'type',
        {
            name: 'status',
            type: 'int'
    }, {
            name: 'dateAvailable',
            type: 'date',
            dateWriteFormat: 'Uu',
            convert: function (value) {
                return new Date(value);
            }
    }, {
            name: 'salePrice',
            type: 'float'
    }, {
            name: 'weight',
            type: 'float'
    }, {
            name: 'invisible',
            type: 'boolean'
    }, {
            name: 'template',
            type: 'object'
    }, {
            name: 'medias',
            type: 'array'
    }, {
            name: 'attributeValues',
            type: 'array'
    }, {
            name: 'configurableProductId',
            type: 'int'
    }, {
            name: 'skuAttributes',
            type: 'object'
    }, {
            name: 'mainCategory',
            type: 'object'
    }, {
            name: 'subCategories',
            type: 'array'
    }, {
            name: 'customAttributes',
            type: 'array'
    }, {
            name: 'paibanTypeId',
            type: 'int'
    }, {
            name: 'compositeId',
            type: 'string'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products",
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});