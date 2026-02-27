Ext.syncRequire([]);
Ext.define("CGP.product.view.productconfig.productviewconfig.view.navigationV3.view.NavigationTree", {
    extend: "Ext.tree.Panel",
    region: 'west',
    width: 350,
    collapsible: true,
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            markDirty: false,
            stripeRows: true,
            loadMask: true,
            enableTextSelection: true
        }
    },
    autoScroll: true,
    children: null,
    rootVisible: false,
    navigationId: null,
    itemId: 'navigationTree',
    selModel: {
        selType: 'rowmodel'
    },

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('navigation') + i18n.getKey('config');
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var isLock = false;//builderConfigTab.isLock;
        var controller = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV3.controller.Controller');
        var store = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV3.store.NavigationStore', {
            navigationId: me.navigationId,
            root: {
                id: 0,
                name: 'root'
            }
        });
        me.store = store;
        store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                var type = item.get('clazz');
                var typeSubStr = type.split('.').pop();
                if (typeSubStr == 'FixedNavItemDTO' || typeSubStr == 'DynamicNavItemDTO' || typeSubStr == 'CalendarNavItemDTO') {
                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/node.png');
                } else {
                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/category.png');
                }
            });
        });
        me.tbar = {
            layout: {
                type: 'table',
                columns: 4
            },
            defaults: {
                width: 75
            },
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add') + i18n.getKey('rootNode'),
                    iconCls: 'icon_create',
                    itemId: 'addRootNodeBtn',
                    disabled: JSGetQueryString('haveRootNode') == 'true' || isLock,
                    width: 100,
                    //hidden:
                    handler: function (comp) {
                        var rootNode = me.getRootNode();
                        var addType = 'naviItem';
                        controller.checkNaviItemType(addType, rootNode, me, true, comp);
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('expandAll'),
                    iconCls: 'icon_expandAll',
                    flex: 1,
                    count: 0,
                    handler: function (btn) {
                        var treepanel = btn.ownerCt.ownerCt;
                        if (btn.count % 2 == 0) {
                            treepanel.expandAll();
                            btn.setText(i18n.getKey('collapseAll'));
                            btn.setIconCls('icon_collapseAll');

                        } else {
                            treepanel.collapseAll();
                            btn.setText(i18n.getKey('expandAll'));
                            btn.setIconCls('icon_expandAll');
                        }
                        btn.count++;
                    }
                }/*,
                {
                    xtype: 'button',
                    text: i18n.getKey('refresh'),
                    iconCls: 'icon_reset',
                    flex: 1,
                    handler: function (button) {
                        button.setDisabled(true);
                        me.store.load({
                            callback: function () {
                                button.setDisabled(false)
                            }
                        });
                    }
                }*/
            ]
        };
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                flex: 3,
                dataIndex: 'name',
                //locked: true,
                renderer: function (value, metadata, record) {
                    var name = !Ext.isEmpty(record.get("description")) ? record.get("description") : record.get("displayNameKey");
                    return name + '<' + record.get('id') + '>' + '[' + record.get('clazz').split('.').pop() + ']';
                }
            }
        ];
        me.listeners = {
            select: function (rowModel, record) {
                var materialId = record.getId();
                var isLeaf;
                if (record.isRoot() && !record.hasChildNodes()) {
                    isLeaf = true
                } else {
                    isLeaf = record.get('isLeaf');
                }
                var parentId = record.get('parentId');
                var infoForm = rowModel.view.ownerCt.ownerCt.getComponent('infoForm');
                var treeStore = me.getStore();
                var navigationConfigId = JSGetQueryString('navigationId');
                controller.refreshData(record, infoForm, isLeaf, parentId, navigationConfigId, me);
            },
            beforedeselect: function (selModel, node, rowIndex) {
                var me = this;
                var infoForm = selModel.view.ownerCt.ownerCt.getComponent('infoForm');
                return infoForm.isValid();
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                var centerPanel = view.ownerCt.ownerCt.getComponent('infoForm');
                var parentId = record.get('parentId');
                var isLeaf = record.get('isLeaf');
                if (isLock) {
                } else {
                    controller.itemEventMenu(view, record, e, parentId, isLeaf);
                }
            },
            itemexpand: function (node) {
                if (node.childNodes.length > 0) {//展开节点时，更改父节点图标样式
                    //node.getUI().getIconEl().src="../themes/images/default/editor/edit-word-text.png";
                }
                //更改当前节点下的所有子节点的图标
                //node.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/node.png');
                //node.set('iconCls','icon_config');
                for (var i = 0, len = node.childNodes.length; i < len; i++) {
                    var curChild = node.childNodes[i];
                    var type = curChild.get('clazz');
                    var typeSubStr = type.split('.').pop();
                    var isLeaf = curChild.get('isLeaf');
                    if (typeSubStr == 'FixedNavItemDTO' || typeSubStr == 'DynamicNavItemDTO' || typeSubStr == 'CalendarNavItemDTO') {
                        curChild.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/node.png');
                    } else {
                        curChild.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/category.png');
                    }
                }
            }
        };
        me.callParent(arguments);

    }
});
