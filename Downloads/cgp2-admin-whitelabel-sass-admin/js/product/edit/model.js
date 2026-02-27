Ext.define('CGP.model.Attribute', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'bindProductId',
        type: 'int',
        useNull: true
    }, {
        name: 'sortOrder',
        type: 'int'
    }, 'code', 'name', {
        name: 'required',
        type: 'boolean'
    }, 'inputType', 'validationExp', {
        name: 'showInFrontend',
        type: 'boolean'
    }, {
        name: 'useInCategoryNavigation',
        type: 'boolean'
    }, 'displayName', {
        name: 'options',
        type: 'array'
    }, 'value', {
        name: 'attributeValueId',
        type: 'int'
    }, {
        name: 'sku',
        type: 'boolean'
    }]
});


Ext.define('CGP.model.ProductCateogry', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }],
    proxy: {
        type: 'rest',
        url: adminPath + 'api/productCategories',
        extraParams: {
            access_token: Ext.util.Cookies.get('token'),
            website: 11,
            isMain: true
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
})


var mainProductCategoryStore = Ext.create('CGP.common.store.ProductCategory', {
    storeId: "mainProductCategoryStore",
    params: {
        website: 11,//使用网站的默认值
        isMain: true,
        limit: 25
    },
    root: {
        id: -1,
        name: ''
    },
    autoSync: true,
});


Ext.define('CGP.model.ProductCustomAttribute', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'required',
        type: 'boolean'
    }, 'inputType', {
        name: 'sortOrder',
        type: 'int'
    }, 'validationExp', {
        name: 'options',
        type: 'array'
    }]
})

Ext.define('CGP.model.ProductCustomAttributeOption', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, 'imageUrl', {
        name: 'sortOrder',
        type: 'int'
    }, 'name']
});

Ext.define('CGP.model.ProductTemplate', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, 'pageDescription', 'pageUrl', 'pageKeywords', 'pageTitle']
})
