Ext.define('CGP.rtattribute.store.RtType', {
    extend: 'Ext.ux.data.store.UxTreeStore',
    nodeParam: '_id',
    model: 'CGP.rtattribute.model.RtType',
    pageSize: 25,
    root: {
        _id: 'root',
        name: ''
    },
    autoSync: false,
    //    expanded: true,
    autoLoad: true,
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/rtTypes/{rtTypeId}/children',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        this.callParent(arguments);
    }
});
