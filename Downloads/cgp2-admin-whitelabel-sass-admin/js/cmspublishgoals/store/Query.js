
Ext.define("CGP.cmspublishgoals.store.Query",{
    extend : 'Ext.data.Store',
    model : 'CGP.cmspublishgoals.model.Query',
    remoteSort:false,
    pageSize:25,
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/cmsEntityQuery',
        reader : {
            type : 'json',
            root : 'data'
        }
    },
    autoLoad:true
});
