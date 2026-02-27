Ext.define('CGP.product.model.SkuAttribute', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, 'code', 'name', 'inputType', {
        name: 'options',
        type: 'array'
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
        name: 'required',
        type: 'boolean'
    },{
        name: 'hidden',
        type: 'boolean'
    },{
        name: 'enable',
        type: 'boolean'
    },{
        name:'attributeName',
        type: 'string',
        convert: function(value,record){
            var result = record.get('displayName')+'<'+record.get('id')+'>';
            return result;
        }
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/configurable/{id}/skuAttributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});