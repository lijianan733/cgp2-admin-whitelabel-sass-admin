
Ext.define("CGP.cmspublishgoals.store.CmsPublishGoal",{
    extend : 'Ext.data.Store',
    model : 'CGP.cmspublishgoals.model.CmsPublishGoal',
    remoteSort:false,
    pageSize:25,
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/cmsPublishGoals',
        reader : {
            type : 'json',
            root : 'data.content'
        }
    },
    autoLoad:true
});
