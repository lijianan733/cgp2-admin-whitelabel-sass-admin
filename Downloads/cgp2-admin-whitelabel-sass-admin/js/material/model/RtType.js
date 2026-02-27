Ext.define('CGP.material.model.RtType', {
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
            name: 'tags',
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
        },
        {
            name: 'attributesToRtTypes',
            type: 'array',
            serialize: function (value) {
                if(Ext.isEmpty(value)){
                    return [];
                }
                return value;
            }
        }

    ]
});