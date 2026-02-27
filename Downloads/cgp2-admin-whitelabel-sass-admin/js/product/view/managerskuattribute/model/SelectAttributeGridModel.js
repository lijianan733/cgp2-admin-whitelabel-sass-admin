Ext.define('CGP.product.view.managerskuattribute.model.SelectAttributeGridModel',{
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        'code',
        'name',
        'inputType',
        {
            name: 'options',
            type: 'array'
        },
        {
            name: 'displayName',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'sortOrder',
            type: 'int'
        },

        {
            name: 'attribute',
            type: 'object'
        },{
            name: 'hidden',
            type: 'boolean',
            defaultValue: false
        },{
            name:'enable',
            type:'boolean',
            defaultValue: true
        },{
            name: 'required',
            type: 'boolean',
            defaultValue: true
        }
    ]

})