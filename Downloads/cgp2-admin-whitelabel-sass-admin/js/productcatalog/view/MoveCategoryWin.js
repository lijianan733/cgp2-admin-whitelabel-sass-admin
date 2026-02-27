Ext.define('CGP.productcatalog.view.MoveCategoryWin', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    itemId: 'moveToCategoryTree',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('check') + i18n.getKey('catalog');
        var store = Ext.create('CGP.productcatalog.store.ProductCatalogStore', {
            clearOnLoad: false,
        });
        me.items = [Ext.create('Ext.tree.Panel', {
            width: 450,
            height: 600,
            selModel: {
                selType: 'rowmodel'
            },
            rootVisible: true,
            header: false,
            viewConfig: {
                getRowClass: function (rec) {//已添加选项重新设置行样式
                    if (rec.getId() == me.selectedId) {
                        return 'select_disable'; //html添加该样式
                    }
                }
            },
            listeners: {
                afterrender: function (comp) {
                    comp.expandAll();
                },
                select: function () {
                    var conformButton = me.getDockedComponent(1).getComponent("confirm");
                    conformButton.setDisabled(false);
                },
                beforeselect: function (comp, rec, index) {
                    if (rec.getId() == me.selectedId) {
                        Ext.Msg.alert('提示','目标节点不能是被移动节点！');
                        return false;
                    }
                }
            },
            autoScroll: true,
            store: store,
            columns: [
                {
                    xtype: 'treecolumn',
                    text: i18n.getKey('name'),
                    flex: 1,
                    dataIndex: 'name',
                    renderer: function (value, metadata, record) {
                        return record.get("name");
                    }
                }
            ],
            bbar: {//底端的分页栏
                xtype: 'treepagingtoolbar',
                store: store,
            }
        })];
        me.bbar = [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                disabled: true,
                itemId: 'confirm',
                handler: me.confirmHandler
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    me.close();
                }
            }
        ];
        me.callParent();
        store.on('load', function (store, node, records) {
            var moveTreePanel = me.down('treepanel');
            var categoryId = me.selectedId;
            var needMovedNode = moveTreePanel.getStore().getNodeById(categoryId);
            Ext.Array.each(records, function (item) {
                item.set('icon', '../material/category.png');
            });
            if (needMovedNode) {
                //如果它的父节点只有一个子节点 也不显示
                var parentNode = needMovedNode.parentNode;
                if (parentNode.childNodes.length == 1) {
                    needMovedNode = needMovedNode.parentNode;
                }
            }
        });
    }
});
