/**
 * @Description:
 * @author nan
 * @date 2022/5/12
 */
Ext.Loader.syncRequire([
    'Ext.ux.data.store.UxTreeStore'
])
Ext.define('CGP.cmslog.store.CategoryTreeStore', {
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
    proxy: {
        type: 'treerest',

        url: adminPath + 'api/cms-configs/{root}/avilale/categorys',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
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
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        this.callParent(arguments);

    }
})
