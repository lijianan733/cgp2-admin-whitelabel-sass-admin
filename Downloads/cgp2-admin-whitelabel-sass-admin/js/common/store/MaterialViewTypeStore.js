Ext.Loader.syncRequire(['CGP.common.model.MaterialViewTypeModel']);
var materialViewTypeStore = new Ext.data.Store({
    model: 'CGP.common.model.MaterialViewTypeModel',
    storeId: 'materialViewTypeStore',
    remoteSort: true,
    pageSize: 25,
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/materialViewTypes',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true

});