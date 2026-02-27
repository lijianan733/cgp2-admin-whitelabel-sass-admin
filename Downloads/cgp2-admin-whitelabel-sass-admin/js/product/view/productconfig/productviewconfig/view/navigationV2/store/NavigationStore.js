Ext.define('CGP.product.view.productconfig.productviewconfig.view.navigationV2.store.NavigationStore', {
    extend: 'Ext.ux.data.store.UxTreeStore',
    model: 'CGP.product.view.productconfig.productviewconfig.view.navigationV2.model.NavigationModel',
    nodeParam: 'id',

    root: {
        id: 0,
        name: ''
    },
    //autoSync: true,
    //    expanded: true,
    autoLoad: true,
    constructor: function (config) {
        this.proxy = {
            type: 'treerest',
            url: adminPath + 'api/navigationConfigs/'+config.navigationId+'/navigations/{id}/tree',
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
