Ext.define('CGP.product.view.managerskuattribute.model.SkuAttribute', {
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
        name:'attributeName',
        type: 'string',
        convert: function(value,record){
            var result = record.get('displayName')+'<'+record.get('id')+'>';
            return result;
        }
    },{
        name: 'isSku',
        type: 'boolean'
    },{
        name: 'detail',
        type: 'string'
    },{
        name: 'placeholder',
        type: 'string'
    },{
        name:'required',
        type:'boolean'
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