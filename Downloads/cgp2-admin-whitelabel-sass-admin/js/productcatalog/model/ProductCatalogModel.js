Ext.define('CGP.productcatalog.model.ProductCatalogModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'sortOrder',
        type: 'int'
    }, {
        name: 'invisible',
        type: 'boolean'
    }, {
        name: 'isMain',
        type: 'boolean'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'shortDescription',
        type: 'string'
    }, {
        name: 'description1',
        type: 'string'
    }, {
        name: 'description2',
        type: 'string'
    }, {
        name: 'description3',
        type: 'string'
    }, {
        name: 'parentId',
        type: 'string'
    }, {
        name: 'pageTitle',
        type: 'string'
    }, {
        name: 'pageKeyWords',
        type: 'string'
    }, {
        name: 'pageDescription',
        type: 'string'
    }, {
        name: 'pageUrl',
        type: 'string'
    }, {
        name: 'website',
        type: 'int',
        userNull: 'true'
    },
        {
            name: 'productsInfo',
            type: 'object'
        },
        {
            name: 'showAsProductCatalog',
            type: 'boolean'
        }, {
            name: 'publishStatus',
            type: 'number'
        },
        //是否为正式上的类目
        {
            name: 'isRelease',
            type: 'boolean'
        }
    ],


    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productCategories',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
