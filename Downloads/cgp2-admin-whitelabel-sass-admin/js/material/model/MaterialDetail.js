Ext.define('CGP.material.model.MaterialDetail', {
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
            name: 'type',
            type: 'string'
        },{
            name: 'leaf',
            type: 'boolean',
            convert: function (v, record){
                return record.data.isLeaf;
            }
        },{
            name: 'isLeaf',
            type: 'boolean'
        },
        {
            name: 'displayType',
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
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materials/{id}',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});