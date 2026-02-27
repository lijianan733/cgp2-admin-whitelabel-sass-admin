Ext.define('CGP.cmspage.model.CmsVariable',{
        extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull:true
        },{
            name: 'code',
            type: 'string'
        },{
            name: 'description',
            type: 'string'
        },{
            name: 'type',
            type: 'string'
        },{
            name: 'websiteId',
            type: 'int'
        },{
            name: 'selector',
            type: 'string'
        },{
            name: 'value',
            type: 'string'
        },{
            name: 'name',
            type: 'string'
        },{
            name: 'website',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/cmsVariables',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})