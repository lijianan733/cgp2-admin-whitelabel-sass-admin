
Ext.define("CGP.cmsvariable.store.CmsVariable",{
    extend : 'Ext.data.Store',
    model : 'CGP.cmsvariable.model.CmsVariable',
    remoteSort:false,
    pageSize:25,
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/cmsVariables',
        reader : {
            type : 'json',
            root : 'data.content'
        }
    },
    autoLoad:true
});
