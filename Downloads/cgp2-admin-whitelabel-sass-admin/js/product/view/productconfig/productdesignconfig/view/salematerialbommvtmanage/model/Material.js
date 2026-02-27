Ext.define('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.model.Material', {
    extend: 'Ext.data.Model',
	idProperty : '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },{
            name: 'id',
            type: 'string',
            convert: function (v, record){
                return record.data._id;
            }
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
            name: 'isLeaf',
            type: 'boolean',
            convert: function (v, record){
                return record.data.leaf;
            }
        },{
            name: 'category',
            type: 'string'
        },{
            name: 'clazz',
            type: 'string'
        },{
            name: 'type',
            type: 'string',
            convert: function(value,record){
                var clazz = record.get('clazz');
                if(!Ext.isEmpty(clazz)){
                    if(clazz == 'com.qpp.cgp.domain.bom.MaterialType'){
                        return 'MaterialType'
                    }else if(clazz == 'com.qpp.cgp.domain.bom.MaterialSpu'){
                        return 'MaterialSpu'
                    }
                }else{
                    return value;
                }
            }
        },
        {
            name: 'displayType',
            type: 'string',
            convert: function(value,record){
                var clazz = record.get('clazz');
                if(clazz == 'com.qpp.cgp.domain.bom.MaterialType'){
                    return 'SMT'
                }else if(clazz == 'com.qpp.cgp.domain.bom.MaterialSpu'){
                    return 'SMU'
                }
            }
        },
        {
            name: 'isContainProductMaterialViewType',
            type: 'boolean'
        }

    ]
});