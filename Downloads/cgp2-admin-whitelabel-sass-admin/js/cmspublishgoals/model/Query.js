Ext.define('CGP.cmspublishgoals.model.Query',{
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
        url: adminPath + 'api/cmsEntityQuery',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})