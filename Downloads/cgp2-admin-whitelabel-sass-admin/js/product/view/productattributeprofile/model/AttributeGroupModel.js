Ext.define('CGP.product.view.productattributeprofile.model.AttributeGroupModel', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'sort',
        type: 'int'
    },{
        name: 'attributes',
        type: 'array'
    },{
        name: 'displayName',
        type: 'string'
    },{
        name: '_id',
        type: 'string'
    }]
});