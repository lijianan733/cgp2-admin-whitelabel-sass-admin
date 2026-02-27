Ext.define('CGP.virtualcontainerobject.store.ContentMapItem', {
    extend: 'Ext.data.Store',
    requires: ['CGP.virtualcontainerobject.model.ContentMapItem'],

    model: 'CGP.virtualcontainerobject.model.ContentMapItem',
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    // pageSize:50,
    proxy : {
        type : 'memory'
    }
});