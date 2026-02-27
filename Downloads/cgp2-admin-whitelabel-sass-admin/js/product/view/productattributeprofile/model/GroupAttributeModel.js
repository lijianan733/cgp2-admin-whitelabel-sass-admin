Ext.define('CGP.product.view.productattributeprofile.model.GroupAttributeModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: 'displayName',
        type: 'string'
    }, {
        name: 'id',
        type: 'int'
    },{
        name: 'attributeName',
        type: 'string',
        convert:function(value,record){
            return record.get('attribute').name;
        }
    },{
        name: 'groupName',
        type: 'array'
    }]
});