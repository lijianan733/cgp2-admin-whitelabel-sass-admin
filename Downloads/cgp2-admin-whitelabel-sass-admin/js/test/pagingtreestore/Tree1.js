Ext.define('CGP.test.pagingtreestore.Tree1',{
    extend: 'Ext.data.TreeStore',
    load:function (options) {
        options = options || {};
        options.params = options.params || {};
        var me = this,
            node = options.node || me.tree.getRootNode(),
            root;
        if (!node) {
            node = me.setRootNode({
                expanded: true
            }, true);
        }
        if (me.clearOnLoad) {
            if(me.clearRemovedOnLoad) {
                me.clearRemoved(node);
            }
            me.tree.un('remove', me.onNodeRemove, me);
            node.removeAll(false);
            me.tree.on('remove', me.onNodeRemove, me);
        }
        Ext.applyIf(options, {
            node: node
        });
        options.params[me.proxy.limitParam]=options[me.proxy.limitParam]||me.pageSize
        options.params[me.proxy.pageParam]=options[me.proxy.pageParam]||me.currentPage
        options.params[me.nodeParam] = node ? node.getId() : 'root';
        if (node) {
            node.set('loading', true);
        }
        return me.callParent([options]);
    },
    onProxyLoad: function(operation) {
        var me = this,
            resultSet = operation.getResultSet(),
            successful = operation.wasSuccessful(),
            records = operation.getRecords(),
            node = operation.node;

        if(resultSet){
            me.totalCount = resultSet.total;
        }

        me.loading = false;
        node.set('loading', false);
        if (successful) {
            records = me.fillNode(node, records);
        }
        // deprecate read?
        me.fireEvent('read', me, operation.node, records, successful);
        me.fireEvent('load', me, operation.node, records, successful);
        //this is a callback that would have been passed to the 'read' function and is optional
        Ext.callback(operation.callback, operation.scope || me, [records, operation, successful]);
    },

    getTotalCount: function() {
        return this.totalCount
    },
//         pageSize:10,
    currentPage:1,
    loadPage: function(page, options) {
        var me = this;
        options = Ext.apply({}, options);
        me.currentPage = page;
        me.read(Ext.applyIf(options, {
            page: page,
            start: (page - 1) * me.pageSize,
            limit: me.pageSize,
            addRecords: !me.clearOnPageLoad
        }));
    },
    nextPage: function(options) {
        this.loadPage(this.currentPage + 1, options);
    },
    previousPage: function(options) {
        this.loadPage(this.currentPage - 1, options);
    },
    initComponent:function(){
        var me = this;
        me.callOverridden(arguments);
    }
});