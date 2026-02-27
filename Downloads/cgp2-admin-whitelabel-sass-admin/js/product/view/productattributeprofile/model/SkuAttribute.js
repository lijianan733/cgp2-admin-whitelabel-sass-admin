Ext.define('CGP.product.view.productattributeprofile.model.SkuAttribute', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },{
        name: 'displayName',
        type: 'string'
    },{
        name: 'description',
        type: 'string'
    },{
        name: 'attribute',
        type: 'object'
    },{
        name:'attributeName',
        type: 'string',
        convert: function(value,record){
            var result = record.get('attribute').name+'<'+record.get('id')+'>';
            return result;
        }
    }]
});