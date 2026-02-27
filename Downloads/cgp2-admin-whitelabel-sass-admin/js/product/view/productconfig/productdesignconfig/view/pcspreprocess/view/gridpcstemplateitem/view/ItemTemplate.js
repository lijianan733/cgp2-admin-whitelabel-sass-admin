/**
 * Created by nan on 2021/5/25
 */
Ext.Loader.syncRequire([
    "CGP.pagecontentschema.view.Layers"
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.gridpcstemplateitem.view.ItemTemplate', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.itemtemplate',
    autoScroll: true,
    createOrEdit: 'create',
    canvasStore: null,
    layout: 'fit',
    title: i18n.getKey('ItemTemplate'),
    defaults: {},
    PMVTId: null,
    listeners: {
        afterrender: function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            page.builderConfigTab = builderConfigTab;
            if (isLock) {
                JSLockConfig(page);
            }
        }
    },
    /**
     * 使用pcs中的节点，生成数据
     */
    importNode: function (node) {
        var itemTemplate = this;
        var treePanel = itemTemplate.items.items[0].getComponent('leftTreePanel');
        /**
         * 构建数据
         */
        var buildNodeData = function (record) {
            var buildData = function (treeNode, result) {
                if (treeNode.hasChildNodes() == false) {//叶子节点,没有子节点
                    result = Ext.clone(treeNode.raw);
                    delete result.children;
                } else {//非叶子节点
                    for (var i = 0; i < treeNode.childNodes.length; i++) {
                        var item = treeNode.childNodes[i];
                        var data = Ext.clone(item.raw);
                        data.children = [];
                        result.children.push(buildData(item, data));
                    }
                }
                return result;
            };
            var newNode = null;
            var data = Ext.clone(record.raw);
            data.children = [];
            newNode = buildData(record, data);
            //批量替换掉旧的_id
            JSObjectEachItem(newNode, function (data, i) {
                if (data.clazz == 'Container') {
                    if (data.items) {
                    } else {
                        data.items = [];
                    }
                }
            });
            return newNode;
        };
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            width: 400,
            height: 120,
            title: i18n.getKey('select') + i18n.getKey('node') + '(请选择非layer节点)',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    name: 'elementId',
                    xtype: 'treecombo',
                    fieldLabel: i18n.getKey('node'),
                    itemId: 'elementId',
                    //这里用其地方加载了的store
                    store: Ext.data.StoreManager.getByKey('layerTreeStore'),
                    displayField: 'clazz',
                    valueField: '_id',
                    editable: false,
                    rootVisible: false,
                    multiselect: false,
                    allowBlank: false,
                    width: 350,
                    regex: /[^Layer]/,
                    regexText: '不允许为Layer节点',
                    extraListeners: {
                        afterrender: function (comp) {
                            this.expandAll();
                        }
                    },
                    defaultColumnConfig: {
                        renderer: function (value, madate, record) {
                            return record.get('clazz') + '(' + record.get('_id') + ')';
                        }
                    }
                }
            ],
            bbar: [
                '->',
                {
                    text: i18n.getKey('confirm'),
                    itemId: 'okBtn',
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var combo = win.items.items[0];
                        if (combo.isValid()) {
                            var nodeId = combo.getValue();
                            var node = combo.store.getNodeById(nodeId);
                            var result = buildNodeData(node);
                            var rootNode = treePanel.getRootNode();
                            rootNode.removeAll();
                            rootNode.appendChild(result);
                            win.close();
                        }
                    }
                }, {
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
    },
    isValid: function () {
        var me = this;
        var layer = me.getComponent('layer');
        return layer.isValid();
    },
    getValue: function () {
        var me = this;
        var layer = me.getComponent('layer');
        if (me.rendered == true) {
            //旧的pcs中会在外围包一层layers
            var result = layer.getValue();
            result = result.layers[0];
            return {
                itemTemplate: result
            };
        } else {
            return {
                itemTemplate: me.rawData
            }
        }
    },
    setValue: function (data) {
        var me = this;
        var layer = me.getComponent('layer');
        if (data) {
            me.rawData = data.itemTemplate;
            layer.setValue(Ext.clone(data.itemTemplate));
        }
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
        me.items = [
            {
                xtype: 'layers',
                header: false,
                itemId: 'layer',
                LayerLeftTreePanelConfig: {
                    rootType: 'container',
                    diyTbar: {
                        items: [
                            {
                                xtype: 'splitbutton',
                                text: i18n.getKey('add') + i18n.getKey('node'),
                                iconCls: 'icon_add',
                                itemId: 'addBtn',
                                menu: [
                                    {
                                        text: i18n.getKey('Container'),
                                        handler: function (btn) {
                                            var splitbutton = btn.ownerCt.ownerButton;
                                            var treePanel = splitbutton.ownerCt.ownerCt;
                                            var rootNode = treePanel.getRootNode();
                                            treePanel.ownerCt.el.mask('加载中...');
                                            treePanel.ownerCt.updateLayout();
                                            setTimeout(function () {
                                                treePanel.controller.addDisplayObjectWin(null, 'Container', treePanel, rootNode);
                                                treePanel.ownerCt.el.unmask();
                                            }, 100);
                                        }
                                    },
                                    {
                                        text: i18n.getKey('DisplayObject'),
                                        handler: function (btn) {
                                            var splitbutton = btn.ownerCt.ownerButton;
                                            var treePanel = splitbutton.ownerCt.ownerCt;
                                            var rootNode = treePanel.getRootNode();
                                            treePanel.controller.selectDisplayObjectType(treePanel, rootNode);
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('expandAll'),
                                iconCls: 'icon_expandAll',
                                count: 0,
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
                                text: i18n.getKey('从PCS中导入') + i18n.getKey('node'),
                                iconCls: 'icon_import',
                                itemId: 'importBtn',
                                handler: function (btn) {
                                    var treePanel = btn.ownerCt.ownerCt;
                                    var itemTemplatePanel = treePanel.ownerCt.ownerCt;
                                    itemTemplatePanel.importNode();
                                }
                            },
                            '->',
                            {
                                xtype: 'button',
                                componentCls: 'btnOnlyIcon',
                                iconCls: 'icon_help',
                                fieldStyle: {
                                    color: 'red'
                                },
                                handler: function (btn) {
                                    alert('可拖拽改变树中节点位置');
                                },
                                tooltip: '可拖拽改变树中节点位置'
                            }
                        ]
                    },
                    setValue: function (data) {
                        var me = this;
                        //转换数据结
                        var rootNode = me.store.getRootNode();
                        rootNode.removeAll()
                        JSReplaceKeyName(data, 'items', 'children');
                        //如果是container类型，必须有items
                        JSObjectEachItem(data, function (data, i) {
                            if (data.clazz == 'Container') {
                                if (data.items) {
                                } else {
                                    data.items = [];
                                }
                            }
                        })
                        rootNode.appendChild(data);
                        me.expandAll();


                    },
                },
                isValid: function () {
                    var me = this;
                    var data = me.getValue();
                    if (data.layers.length == 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        ];
        me.callParent();
    }
})