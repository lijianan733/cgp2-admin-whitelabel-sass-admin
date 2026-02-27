Ext.define('CGP.rttypes.store.RtType', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.rttypes.model.RtType',
    nodeParam: '_id',

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
})