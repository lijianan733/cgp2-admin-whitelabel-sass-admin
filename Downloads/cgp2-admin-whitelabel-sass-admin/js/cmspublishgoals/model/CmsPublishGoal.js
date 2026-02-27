Ext.define('CGP.cmspublishgoals.model.CmsPublishGoal',{
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull:true
        },{
            name: 'name',
            type: 'string'
        },{
            name: 'jenkinsTaskUrl',
            type: 'string'
        },{
            name: 'productQueryId',
            type: 'int',
            useNull:true
        },{
            name: 'websiteId',
            type: 'int',
            useNull:true
        },{
            name: 'pageQueryId',
            type: 'int',
            useNull:true
        },{
            name: 'productFilterId',
            type: 'int',
            useNull:true
        },{
            name: 'pageFilterId',
            type: 'int',
            useNull:true
        },{
            name: 'website',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/cmsPublishGoals',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})