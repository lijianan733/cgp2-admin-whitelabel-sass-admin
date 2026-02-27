Ext.define('CGP.bommaterial.model.MaterialBomItem', {
    extend: 'Ext.data.Model',
    idProperty: 'nodeId',

    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'nodeId',
            type: 'string'
        },
        {
            name: 'sortOrder',
            type: 'int'
        },
        {
            name: 'parentMaterialId',
            type: 'int'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'quantityStrategy',
            type: 'string'
        },
        {
            name: 'itemMaterial',
            type: 'object'
        },
        {
            name: 'selectableMaterials',
            type: 'object'
        },
        {
            name: 'itemRangeMin',
            type: 'int'
        },
        {
            name: 'itemRangeMax',
            type: 'int'
        },
        {
            name: 'parentId',
            type: 'int'
        },
        {
            name: 'leaf',
            type: 'boolean'
        },{
            name: 'children',
            type: 'array'
        },{
            name: 'expanded',
            type: 'boolean'
        },{
            name: 'editable',
            type: 'boolean'
        },
        {
            name: 'path',
            type: 'string'
        }
    ]
});