Ext.define('CGP.material.store.MaterialOnlyType', {
    extend: 'Ext.ux.data.store.UxTreeStore',
    model: 'CGP.material.model.Material',
    nodeParam: '_id',
    pageSize: 25,
    root: {
        _id: 'root',
        name: '',
        leaf: false
    },
    autoLoad: true,
    autoSync: false,
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/materials/{id}/childNodes',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            filter: Ext.JSON.encode([
                {
                    name: 'clazz',
                    type: 'string',
                    value: "com.qpp.cgp.domain.bom.MaterialType"
                }
            ])
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        /*  if (config && config.params) {
              me.proxy.extraParams = config.params;
          }*/
        this.callParent(arguments);
    }
})
