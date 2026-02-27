Ext.define('CGP.productcategory.model.Attribute', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
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
    }, {
        name: 'belongToParent',
        type: 'boolean'
    }, {
        name: 'value',
        type: 'string'
}, {
        name: 'options',
        type: 'array'
    }]
});