/**
 * Created by nan on 2021/4/6
 */
Ext.syncRequire([]);
Ext.define("CGP.productset.view.LeftTree", {
    extend: "Ext.tree.Panel",
    alias: 'widget.lefttree',
    autoScroll: true,
    collapsible: true,
    region: 'west',
    title:i18n.getKey('productSet'),
    split: true,
    viewConfig: {
        markDirty: false,
        stripeRows: true,
        forceFit: true, // 注意不要用autoFill:true,那样设置的话当GridPanel的大小变化（比如你resize了它）时不会自动调整column的宽度
        scrollOffset: 0 //不加这个的话，会在grid的最右边有个空白，留作滚动条的位置
    },
    initComponent: function () {
        var me = this;
        var store = me.store = Ext.create('CGP.productset.store.ProductSetTreeStore', {
            listeners: {
                beforeload: function (store, operation, eOpts) {
                   ;
                }
            }
        });
        store.on('load', function (store, node, records) {
            //设置图标
            Ext.Array.each(records, function (item) {
                var type = item.get('clazz');
                if (type.indexOf('SetItem') != -1) {
                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_green.png');
                } else {
                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_yellow.png');
                }
            });
            //productScope将为最终叶子节点，不允许展开
            Ext.Array.each(records, function (item) {
                var clazz = item.get('clazz');
                if (clazz == 'com.qpp.cgp.domain.productssuit.StaticProductScope' ||
                    clazz == 'com.qpp.cgp.domain.productssuit.MainCategoryProductScope' ||
                    clazz == 'com.qpp.cgp.domain.productssuit.SubCategoryProductScope') {
                    item.set('leaf', true);
                }
            });
        });
        me.tbar = {
            defaults: {
                width: 80
            },
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('expandAll'),
                    iconCls: 'icon_expandAll',
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
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('展开') + i18n.getKey('下一层'),
                    handler: function (btn) {
                        var treepanel = btn.ownerCt.ownerCt;
                        var rootNode = treepanel.getRootNode();
                        var nodes = [];
                        rootNode.cascadeBy(function (node) {//遍历节点
                            if (node.isRoot() == true) {
                                if (node.isExpanded() == false && node.isLeaf() == false) {//未张开的根
                                    nodes.push(node);
                                }
                            } else {
                                if (node.isExpanded() == false && node.isLeaf() == false && node.parentNode.isExpanded() == true) {//未张开的节点
                                    nodes.push(node);
                                }
                            }

                        });
                        nodes.forEach(function (node) {
                            node.expand()
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('收起') + i18n.getKey('一层'),
                    handler: function (btn) {
                        var treePanel = btn.ownerCt.ownerCt;
                        var rootNode = treePanel.getRootNode();
                        var maxDepth = 0;
                        rootNode.cascadeBy(function (node) {
                            if (node.isRoot() == true) {

                            } else {
                                if (node.parentNode.isExpanded() == true && node.getDepth() > maxDepth) {
                                    maxDepth = node.getDepth();
                                }
                            }

                        })
                        rootNode.cascadeBy(function (node) {
                            if ((node.isExpanded() == true && node.isLeaf() == false) && node.getDepth() == (maxDepth - 1)) {
                                node.collapse();
                            }
                        })
                    }
                },
            ]
        };
        me.columns = [{
            xtype: 'treecolumn',
            dataIndex: 'name',
            width: 300,
            text: i18n.getKey('name'),
            renderer: function (value, mateData, record) {
                return value + ' (' + record.get('_id') + ')';
            }
        }, {
            dataIndex: 'clazz',
            flex: 1,
            text: i18n.getKey('type'),
            renderer: function (value, mateData, record) {
                return value.split('.').pop();
            }
        }];
        me.listeners = {
            select: function (rowModel, record) {
                var leftBomTree = rowModel.view.ownerCt;
                var centerPanel = leftBomTree.ownerCt.getComponent('centerPanel');
                centerPanel.refreshData(Ext.clone(record.raw), record);
            },
            selectionchange: function () {
                var leftBomTree = this;
                var centerPanel = leftBomTree.ownerCt.getComponent('centerPanel');
                var selection = leftBomTree.getSelectionModel().getSelection();
                if (selection.length > 0) {
                } else {
                    centerPanel.refreshData();
                }
            },
            itemcontextmenu: function (view, treeNode, item, index, e, eOpts) {
                e.stopEvent();
                var type = treeNode.get('clazz');
                console.log(type);
                var menu = Ext.create('Ext.menu.Menu', {
                    items: [
                        {
                            text: i18n.getKey('add') + i18n.getKey('productSetItem'),
                            itemId: 'addProductSetItem',
                            hidden: !(type == 'com.qpp.cgp.domain.productssuit.ConfigurableProductSet' || type == 'com.qpp.cgp.domain.productssuit.SkuProductSet'),
                            handler: function () {
                                var win = Ext.create('Ext.window.Window', {
                                    modal: true,
                                    constrain: true,
                                    title: i18n.getKey('create') + i18n.getKey('productSetItem'),
                                    items: [
                                        {
                                            xtype: 'productsetitemform',
                                            itemId: 'form',
                                            header: false,
                                            productSet: {
                                                id: treeNode.get('id'),
                                                name: treeNode.get('name'),
                                                clazz: type
                                            }
                                        }
                                    ],
                                    bbar: [
                                        '->',
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('save'),
                                            iconCls: 'icon_save',
                                            handler: function (btn) {
                                                var win = btn.ownerCt.ownerCt;
                                                var form = win.getComponent('form');
                                                if (form.isValid()) {
                                                    me.mask();
                                                    var data = form.diyGetValue();
                                                    var model = new CGP.productset.model.ProductSetItemModel(data);
                                                    model.save({
                                                        callback: function (record, args) {
                                                            var data = record.getData();
                                                            me.unmask();
                                                            me.refreshTreeNode(treeNode, record.get('id') || record.get('_id'));
                                                            win.close();
                                                        }
                                                    });
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('cancel'),
                                            iconCls: 'icon_cancel',
                                            handler: function (btn) {
                                                var win = btn.ownerCt.ownerCt;
                                                win.close();
                                            }
                                        }
                                    ]
                                });
                                win.show();
                            }
                        },
                        {
                            text: i18n.getKey('delete') + i18n.getKey('productSetItem'),
                            itemId: 'deleteProductSetItem',
                            hidden: type.indexOf('SetItem') == -1,
                            handler: function () {
                                var parentNode = treeNode.parentNode;
                                Ext.Msg.confirm('提示', '确定删除？', function (selector) {
                                    if (selector === 'yes') {
                                        var model = new CGP.productset.model.ProductSetItemModel(treeNode.getData());
                                        model.destroy(
                                            {
                                                callback: function (record, args) {
                                                    me.refreshTreeNode(parentNode,);
                                                }
                                            }
                                        )
                                    }
                                });
                            }
                        },
                        {
                            text: i18n.getKey('add') + i18n.getKey('scope'),
                            itemId: 'addScope',
                            hidden: !(type == 'com.qpp.cgp.domain.productssuit.MultiSetItem' || type == 'com.qpp.cgp.domain.productssuit.SingleSetItem'),
                            handler: function () {
                                var win = Ext.create('Ext.window.Window', {
                                    modal: true,
                                    constrain: true,
                                    title: i18n.getKey('create') + i18n.getKey('scope'),
                                    items: [{
                                        xtype: 'errorstrickform',
                                        itemId: 'form',
                                        border: false,
                                        defaults: {
                                            allowBlank: false,
                                            width: 350,
                                            margin: 10,
                                        },
                                        items: [
                                            {
                                                xtype: 'combo',
                                                fieldLabel: i18n.getKey('type'),
                                                name: 'clazz',
                                                itemId: 'clazz',
                                                editable: false,
                                                displayField: 'display',
                                                valueField: 'value',
                                                store: Ext.create('Ext.data.Store', {
                                                    fields: [
                                                        'value', 'display'
                                                    ],
                                                    data: [
                                                        {
                                                            value: 'com.qpp.cgp.domain.productssuit.StaticProductScope',
                                                            display: 'StaticProductScope'
                                                        },
                                                        {
                                                            value: 'com.qpp.cgp.domain.productssuit.MainCategoryProductScope',
                                                            display: 'MainCategoryProductScope'
                                                        },
                                                        {
                                                            value: 'com.qpp.cgp.domain.productssuit.SubCategoryProductScope',
                                                            display: 'SubCategoryProductScope'
                                                        }
                                                    ]
                                                })
                                            },
                                            {
                                                xtype: 'textfield',
                                                name: 'name',
                                                itemId: 'name',
                                                fieldLabel: i18n.getKey('name'),
                                            },
                                            {
                                                xtype: 'textfield',
                                                name: 'description',
                                                itemId: 'description',
                                                fieldLabel: i18n.getKey('description'),
                                            },
                                            {
                                                //productSet
                                                xtype: 'uxfieldcontainer',
                                                name: 'setItem',
                                                hidden: true,
                                                allowBlank: false,
                                                itemId: 'setItem',
                                                items: [
                                                    {
                                                        name: '_id',
                                                        itemId: '_id',
                                                        xtype: 'textfield',
                                                        value: treeNode.get('id')
                                                    },
                                                    {
                                                        name: 'clazz',
                                                        itemId: 'clazz',
                                                        xtype: 'textfield',
                                                        value: treeNode.get('clazz')
                                                    }
                                                ]
                                            }
                                        ]
                                    }],
                                    bbar: ['->', {
                                        xtype: 'button',
                                        text: i18n.getKey('save'),
                                        iconCls: 'icon_save',
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt;
                                            var form = win.getComponent('form');
                                            if (form.isValid()) {
                                                var data = form.getValue();
                                                var model = new CGP.productset.model.ProductScopeModel(data);
                                                model.save({
                                                    callback: function (record, args) {
                                                        var data = record.getData();
                                                        me.unmask();
                                                        me.refreshTreeNode(treeNode, record.get('id') || record.get('_id'));
                                                        win.close();
                                                    }
                                                });
                                            }
                                        }
                                    },
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('cancel'),
                                            iconCls: 'icon_cancel',
                                            handler: function (btn) {
                                                var win = btn.ownerCt.ownerCt;
                                                win.close();
                                            }
                                        }
                                    ]
                                });
                                win.show();
                            }
                        },
                        {
                            text: i18n.getKey('delete') + i18n.getKey('scope'),
                            itemId: 'deleteScope',
                            hidden: type.indexOf('ProductScope') == -1,
                            handler: function () {
                                var parentNode = treeNode.parentNode;
                                Ext.Msg.confirm('提示', '确定删除？', function (selector) {
                                    if (selector === 'yes') {
                                        var model = new CGP.productset.model.ProductScopeModel(treeNode.getData());
                                        model.destroy(
                                            {
                                                callback: function (record, args) {
                                                    me.refreshTreeNode(parentNode,);
                                                }
                                            }
                                        )
                                    }
                                })
                            }
                        },
                    ]
                });
                menu.showAt(e.getXY());
            },
        };
        me.callParent(arguments);
    },
    setRootNodeValue: function (productSetInfo) {
        var me = this;
        productSetInfo._id = productSetInfo['id'];
        me.store.proxy.url = adminPath + 'api/productsuittrees/PRODUCT_SUIT/' + productSetInfo.id + '/Items';
        var rootNode = me.store.getRootNode();
        for (var i in productSetInfo) {
            rootNode.set(i, productSetInfo[i]);
        }
        rootNode.set('icon', path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_purple.png');
        rootNode.raw = productSetInfo;
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

