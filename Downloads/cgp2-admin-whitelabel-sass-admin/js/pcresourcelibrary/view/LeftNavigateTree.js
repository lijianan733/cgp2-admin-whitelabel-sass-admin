/**
 * Created by nan on 2021/9/9
 */
Ext.syncRequire([
    'CGP.pcresourcelibrary.store.PCResourceCategoryTreeStore',
    'CGP.pcresourcelibrary.model.PCResourceCategoryModel',
    'CGP.common.field.MultiLanguageField'
]);
Ext.define("CGP.pcresourcelibrary.view.LeftNavigateTree", {
    extend: "Ext.tree.Panel",
    alias: 'widget.leftnavigatetree',
    autoScroll: true,
    collapsible: true,
    region: 'west',
    header: false,
    split: true,
    width: 300,
    resourceLibraryId: null,
    resourceType: null,
    viewConfig: {
        markDirty: false,
        stripeRows: true,
        forceFit: true, // 注意不要用autoFill:true,那样设置的话当GridPanel的大小变化（比如你resize了它）时不会自动调整column的宽度
        scrollOffset: 0 //不加这个的话，会在grid的最右边有个空白，留作滚动条的位置
    },
    rootVisible: false,
    initComponent: function () {
        var me = this;
        var store = me.store = Ext.create('CGP.pcresourcelibrary.store.PCResourceCategoryTreeStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'type',
                    type: 'string',
                    value: me.resourceType
                }])
            }
        });
        me.controller = Ext.create('CGP.pcresourcelibrary.controller.Controller');
        me.tbar = {
            layout: {
                type: 'table',
                columns: 4
            },
            items: [
                {
                    xtype: 'trigger',
                    vtype: 'number',
                    minLength: 6,
                    width: '100%',
                    colspan: 2,
                    defaultValue: null,
                    itemId: 'materialCategorySearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '按Id查询类目',
                    onTrigger2Click: function () {//按钮操作
                        var me = this;
                        var treePanel = me.ownerCt.ownerCt;
                        var materialId = me.getValue();
                        var store = treePanel.store;
                        if (!Ext.isEmpty(materialId)) {
                            var oldUrl = store.proxy.url;
                            store.proxy.url = adminPath + 'api/pCResourceCategories/' + materialId
                            store.load();
                            store.proxy.url = oldUrl;
                        }

                    },
                    onTrigger1Click: function () {//按钮操作
                        var me = this;
                        if (me.isValid()) {
                            var treePanel = me.ownerCt.ownerCt;
                            me.reset();
                            treePanel.searchMaterialId = null;
                            treePanel.store.load();
                        }
                    }
                },
                {
                    xtype: 'trigger',
                    colspan: 2,
                    width: '100%',
                    defaultValue: null,
                    itemId: 'materialSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '按名称查询分类',
                    onTrigger1Click: function () {//按钮操作
                        var me = this;
                        var treePanel = me.ownerCt.ownerCt;
                        me.reset();
                        treePanel.store.load();
                    },
                    onTrigger2Click: function () {//按钮操作
                        var me = this;
                        if (me.isValid()) {
                            var treePanel = me.ownerCt.ownerCt;
                            var categoryName = me.getValue();
                            if (!Ext.isEmpty(categoryName)) {
                                var oldUrl = store.proxy.url;
                                store.proxy.url = encodeURI(
                                    adminPath + 'api/pCResourceCategories?page=1&limit=23&filter=[{"name":"name","type":"string","value":"' + categoryName + '"}]'
                                );
                                store.load();
                                store.proxy.url = oldUrl;
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('add') + i18n.getKey('category'),
                    iconCls: 'icon_add',
                    itemId: 'addBtn',
                    handler: function (btn) {
                        var treePanel = btn.ownerCt.ownerCt;
                        treePanel.controller.EditCategory(null, treePanel, null);
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('expandAll'),
                    iconCls: 'icon_expandAll',
                    count: 0,
                    flex: 1,
                    handler: function (btn) {
                        var treePanel = btn.ownerCt.ownerCt;
                        if (btn.count % 2 == 0) {
                            treePanel.expandAll();
                            btn.setText(i18n.getKey('collapseAll'));
                            btn.setIconCls('icon_collapseAll');

                        } else {
                            treePanel.collapseAll();
                            btn.setText(i18n.getKey('expandAll'));
                            btn.setIconCls('icon_expandAll');
                        }
                        btn.count++;
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('switch') + i18n.getKey('view'),
                    iconCls: 'icon_switch',
                    itemId: 'switchBtn',
                    handler: function (btn) {
                        JSOpen({
                            id: "pcresourcelibrary_edit",
                            url: path + 'partials/pcresourcelibrary/edit.html?id=' + me.resourceLibraryId + '&type=' + me.resourceType,
                            title: i18n.getKey('edit') + "_" + i18n.getKey('pcResourceLibrary') + '(' + me.resourceLibraryId + ')',
                            refresh: true
                        });
                    }
                }
            ]
        };
        me.bbar = {
            xtype: 'pagingtoolbar',
            store: me.store
        };
        me.columns = [{
            xtype: 'treecolumn',
            dataIndex: 'name',
            flex: 1,
            text: i18n.getKey('name'),
            renderer: function (value, mateData, record) {
                return value + ' (' + record.get('_id') + ')';
            }
        }];
        me.listeners = {
            select: function (rowModel, record) {
                var leftBomTree = rowModel.view.ownerCt;
                var centerPanel = leftBomTree.ownerCt.getComponent('centerPanel');
                centerPanel.refreshData(Ext.clone(record.raw), record);
            },
            itemcontextmenu: function (view, treeNode, item, index, e, eOpts) {
                e.stopEvent();
                var treePanel = this;
                var parentNode = treeNode.parentNode;
                var menu = Ext.create('Ext.menu.Menu', {
                    items: [
                        {
                            text: i18n.getKey('add') + i18n.getKey('category'),
                            itemId: 'addCategory',
                            handler: function () {
                                treePanel.controller.EditCategory(null, treePanel, treeNode);
                            }
                        },
                        {
                            text: i18n.getKey('edit') + i18n.getKey('category'),
                            itemId: 'editCategory',
                            handler: function (btn) {
                                treePanel.controller.EditCategory(treeNode, treePanel, treeNode.parentNode);
                            }
                        },
                        {
                            text: i18n.getKey('delete') + i18n.getKey('category'),
                            itemId: 'deleteCategory',
                            hidden: treeNode.hasChildNodes(),
                            handler: function () {
                                Ext.Msg.confirm('提示', '确定删除？', function (selector) {
                                    if (selector === 'yes') {
                                        var model = new CGP.pcresourcelibrary.model.PCResourceCategoryModel(treeNode.getData());
                                        model.destroy(
                                            {
                                                callback: function (node,option) {
                                                    if (option.success) {
                                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                                                            me.refreshTreeNode(parentNode);
                                                        })
                                                    }
                                                }
                                            }
                                        )
                                    }
                                })
                            }
                        }
                    ]
                });
                menu.showAt(e.getXY());
            },
        };
        me.callParent(arguments);
    },
    refreshTreeNode: function (parentNode, newNodeId) {
        var treePanel = this;
        var treeStore = treePanel.store;
        treeStore.load({
            node: parentNode,
            callback: function (records) {
                parentNode.set('isLeaf', false);
                parentNode.set('leaf', false);
                parentNode.expand();
                if (newNodeId) {
                    var newNode = treeStore.getNodeById(newNodeId);
                    treePanel.getSelectionModel().select(newNode);
                }
            }
        });
    }
});

