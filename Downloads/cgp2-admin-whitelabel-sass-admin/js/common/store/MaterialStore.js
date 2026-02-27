Ext.Loader.syncRequire(['CGP.common.model.MaterialModel']);
var materialStore = new Ext.data.Store({
    model: 'CGP.common.model.MaterialModel',
    storeId: 'materialStore',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/materials/base",
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true

});