Ext.define('CGP.test.pcCompare.model.PcCatalogModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'text',
            type: 'string'
        },
        {
            name: 'leaf',
            type: 'boolean'
        },{
            name: 'pageContent',
            type: 'object'
        },
        {
            name: 'haveCachePicture',
            type: 'boolean'
        },
        {
            name:'comparePicture',
            type: 'object'
        },{
            name: 'materialViewName',
            type: 'string'
        }
    ]
})