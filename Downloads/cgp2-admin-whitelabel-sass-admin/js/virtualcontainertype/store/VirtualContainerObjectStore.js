Ext.define("CGP.virtualcontainertype.store.VirtualContainerObjectStore", {
    extend: 'Ext.data.Store',
    requires: ['CGP.virtualcontainertype.model.VirtualContainerObjectModel'],
    model: 'CGP.virtualcontainertype.model.VirtualContainerObjectModel',
    remoteSort: false,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/virtualContainerObjects',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});