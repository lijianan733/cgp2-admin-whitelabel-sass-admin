Ext.define('CGP.product.view.productconfig.productdesignconfig.model.BomTree', {
    extend: 'Ext.data.Model',
    idProperty : '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'parentId',
            type: 'string'
        },{
            name: 'leaf',
            type: 'boolean'
        },{
            name: 'pathID',
            type: 'id',
            convert: function(value,record){
                var arr = record.get('_id').split('-');
                return arr[arr.length-1];
            }
        },{
            name: 'isLeaf',
            type: 'boolean',
            convert: function (v, record){
                return record.data.leaf;
            }
        },{
            name: 'clazz',
            type: 'string'
        },{
            name: 'type',
            type: 'string',
            convert: function(value,record){
                var clazz = record.get('clazz');
                if(clazz == 'com.qpp.cgp.domain.bom.MaterialType'){
                    return 'MaterialType'
                }else if(clazz == 'com.qpp.cgp.domain.bom.MaterialSpu'){
                    return 'MaterialSpu'
                }
            }
        }

    ]
});