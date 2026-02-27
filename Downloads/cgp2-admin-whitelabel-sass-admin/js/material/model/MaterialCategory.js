Ext.define('CGP.material.model.MaterialCategory', {
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
            name: 'parentId',
            type: 'string'
        },{
            name: 'clazz',
            type: 'string',
            defaultValue: domainObj['MaterialCategory']
        },{
            name: 'leaf',
            type: 'boolean'
        },{
            name: 'isLeaf',
            type: 'boolean',
            convert: function (v, record){
                return record.data.leaf;
            }

        }

    ]
})