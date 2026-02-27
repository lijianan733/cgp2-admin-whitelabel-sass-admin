Ext.define('CGP.common.store.RtType', {
    extend: 'Ext.ux.data.store.UxTreeStore',
    model: 'CGP.rttypes.model.RtType',
    nodeParam: '_id',
    pageSize: 1000,
    root: {
        _id: 'root',
        name: ''
    },
    //autoSync: true,
    //    expanded: true,

    constructor: function (config) {
        this.proxy = {
            type: 'treerest',
            url: adminPath + 'api/rtTypes/{id}/children',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            reader: {
                type: 'json',
                root: 'data'
            }
        };

        this.callParent(arguments);

    }
});