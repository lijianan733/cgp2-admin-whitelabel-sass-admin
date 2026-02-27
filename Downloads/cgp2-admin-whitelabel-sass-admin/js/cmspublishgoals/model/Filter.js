Ext.define('CGP.cmspublishgoals.model.Filter',{
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull:true
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/cmsEntityFilters',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})