Ext.define("CGP.virtualcontainertype.store.VirtualContainerTypeStore", {
    extend: 'Ext.data.Store',
    requires: ['CGP.virtualcontainertype.model.VirtualContainerTypeModel'],
    model: 'CGP.virtualcontainertype.model.VirtualContainerTypeModel',
    remoteSort: false,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/virtualContainerTypes',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});