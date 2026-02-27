Ext.define('CGP.product.view.productattributeconstraint.model.SkuAttribute', {
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
        name: 'attributeId',
        type: 'int',
        convert:function(value,record){
            var attributeId = record.get('attribute').id;
            return attributeId;
        }
    },{
        name:'attributeName',
        type: 'string',
        convert: function(value,record){
            var result = record.get('displayName')+'<'+record.get('id')+'>';
            return result;
        }
    },{
        name: 'options',
        type: 'array',
        convert:function(value,record){
            if(Ext.isEmpty(record.get('attribute').options)){
                return [];
            }else{
                return record.get('attribute').options;
            }
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
