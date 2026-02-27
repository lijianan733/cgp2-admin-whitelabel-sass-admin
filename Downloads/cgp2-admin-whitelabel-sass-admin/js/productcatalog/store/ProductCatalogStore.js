Ext.define('CGP.productcatalog.store.ProductCatalogStore', {
    extend: 'Ext.ux.data.store.UxTreeStore',
    model: 'CGP.productcatalog.model.ProductCatalogModel',
    nodeParam: 'id',
    root: {
        id: '-1',
        name: '最外层',
        'icon': '../material/category.png'
    },
    pageSize: 25,
    autoSync: true,
    autoLoad: true,
    clearOnLoad: true,//加载数据时，是否清除上次数据
    onProxyLoad: function (operation) {
        var me = this,
            successful = operation.wasSuccessful(),
            records = operation.getRecords(),
            node = operation.node,
            resultSet = operation.getResultSet();
        me.loading = false;
        if (resultSet && operation.id == '-1') {
            me.treeTotalCount = resultSet.total;
        }
        node.set('loading', false);
        if (successful) {
            if (!me.clearOnLoad) {
                records = me.cleanRecords(node, records);
            }
            records = me.fillNode(node, records);
        }
        me.fireEvent('read', me, operation.node, records, successful);
        me.fireEvent('load', me, operation.node, records, successful);
        Ext.callback(operation.callback, operation.scope || me, [records, operation, successful]);
    },
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/productCategories/{id}',
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
})
