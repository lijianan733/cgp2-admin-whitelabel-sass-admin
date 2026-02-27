Ext.define("CGP.resource.view.compositeDisplayObject.DisplayObject", {
    extend: 'CGP.pagecontentschema.view.Layers',
    alias: 'widget.displayobject',
    requires: [],
    config:{
        LayerLeftTreePanelConfig: {
            rootType: 'container',
            diyTbar: {
                items: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('DisplayObject'),
                        iconCls: 'icon_add',
                        itemId: 'addDOBtn',
                        handler: function (btn) {
                            var treePanel = btn.ownerCt.ownerCt;
                            var rootNode = treePanel.getRootNode();
                            treePanel.controller.selectDisplayObjectType(treePanel, rootNode);

                        }
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
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent(config);
    },
    initComponent: function () {
        var me = this;
        me.callParent();
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
})