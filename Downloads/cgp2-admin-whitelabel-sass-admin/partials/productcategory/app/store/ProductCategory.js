Ext.define('CGP.productcategory.store.ProductCategory', {
    extend: 'Ext.ux.data.store.UxTreeStore',
    model: 'CGP.productcategory.model.ProductCategory',
    nodeParam: 'id',
    root: {
        id: '-1',
        name: ''
    },
    pageSize: 25,
    autoSync: true,
    autoLoad: false,
    //    expanded: true,
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
