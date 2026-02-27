
Ext.define("CGP.cmspublishgoals.store.Filter",{
    extend : 'Ext.data.Store',
    model : 'CGP.cmspublishgoals.model.Filter',
    remoteSort:false,
    pageSize:25,
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/cmsEntityFilters',
        reader : {
            type : 'json',
            root : 'data'
        }
    },
    autoLoad:true
});
