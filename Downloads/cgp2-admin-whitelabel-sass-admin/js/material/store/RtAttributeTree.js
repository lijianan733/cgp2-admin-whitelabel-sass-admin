Ext.define('CGP.material.store.RtAttributeTree', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.material.model.RtAttributeTree',
    nodeParam: '_id',
    //idProperty : 'code',

    root: {
        _id: 'root',
        name: ''
    },
    autoSync: false,
    //    expanded: true,
    autoLoad: false,
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/rtTypes/{id}/rtAttributeDefs',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        reader: {
            type: 'json',
            root: 'data',
            /**
             * 以前的数据里面没有_id，股用转换后的id作为唯一标识，_id作为查询节点参数
             * @param data
             * @returns {Ext.data.ResultSet}
             */
            readRecords: function (data) {
                console.log(data)
                var me = this,
                    meta;
                for (var i = 0; i < data.data.length; i++) {
                    data.data[i].id = data.data[i].id + JSGetUUID();
                }
                if (me.getMeta) {
                    meta = me.getMeta(data);
                    if (meta) {
                        me.onMetaChange(meta);
                    }
                } else if (data.metaData) {
                    me.onMetaChange(data.metaData);
                }
                me.jsonData = data;
                return Ext.data.reader.Reader.prototype.readRecords.apply(me, arguments)
            },
        },
    },
    constructor: function (config) {
        this.callParent(arguments);

    }
})