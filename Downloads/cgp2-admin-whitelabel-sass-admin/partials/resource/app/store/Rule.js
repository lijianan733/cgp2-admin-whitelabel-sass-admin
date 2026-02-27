Ext.define('CGP.resource.store.Rule', {
    extend: 'Ext.data.Store',
    model: 'CGP.resource.model.Rule',
    autoSync : true,
    sorters: 'sortOrder',
    pageSize:100,
    proxy : {
        type : 'pagingmemory'
    }
});