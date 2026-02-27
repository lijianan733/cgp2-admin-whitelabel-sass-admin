Ext.define('CGP.product.model.Material', {
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
            name: 'type',
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
            name: 'clazz',
            type: 'string'
        }

    ],
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/materials/{id}/children',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});