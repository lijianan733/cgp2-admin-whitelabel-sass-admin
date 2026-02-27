Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.Attribute', {
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
    }, {
        name: 'hidden',
        type: 'boolean',
        defaultValue: false
    }, {
        name: 'enable',
        type: 'boolean',
        defaultValue: true
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
    }, {
        name: 'defaultValue',
        type: 'string'
    }, {
        name: 'valueType',
        type: 'string'
    }, {
        name: 'selectType',
        type: 'string'
    }]
});
