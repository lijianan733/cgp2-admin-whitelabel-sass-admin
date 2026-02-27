Ext.define('CGP.rtattribute.model.RtType', {
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
            name:'nameId',
            type:'string',
            convert:function (v, record){
                var  name = record.data.name;
                var id = record.data._id;
                return name+'<'+id+'>';
            }
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
        },{
            name: 'clazz',
            type: 'string',
            defaultValue: domainObj['RtType']
        }

    ]

});