Ext.syncRequire(['CGP.material.model.Material', 'CGP.material.override.Filter']);
Ext.define("CGP.material.view.MaterialTreePanel", {
    extend: "Ext.tree.Panel",
    region: 'west',
    mixins: {
        Filter: 'CGP.material.override.Filter'
    },
    width: 350,
    collapsible: true,
    config: {
        rootVisible: true,
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
    itemId: 'materialTree',
    selModel: {
        selType: 'rowmodel'
    },

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('sell') + i18n.getKey('materialTree');
        var controller = Ext.create('CGP.material.controller.Controller');
        me.rootVisible = !(me.getQueryString('materialId') == 'root');
        var store = Ext.create('CGP.material.store.Material', {
            rootVisible: !(me.getQueryString('materialId') == 'root'),
            root: {
                _id: me.getQueryString('materialId'),
                name: me.getQueryString('materialName'),
                type: 'MaterialType'
            }
        });
        me.store = store;
        store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                var type = item.get('type');
                if (type == 'MaterialSpu') {
                    item.set('icon', '../material/S.png');
                } else {
                    item.set('icon', '../material/T.png');
                }
            });
        });
        me.tbar = {
            layout: {
                type: 'table',
                columns: 4,
            },
            defaults: {
                width: 75
            },
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('addMaterial'),
                    iconCls: 'icon_create',
                    width: 80,
                    //hidden:
                    handler: function () {
                        var rootNode = me.getRootNode();
                        controller.selectMaterialType(me, rootNode);
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('deleteMaterial'),
                    iconCls: 'icon_delete',
                    width: 80,
                    handler: function () {
                        var treeStore = me.getStore();
                        var node = me.getSelectionModel().getSelection()[0];
                        var infoTab = me.ownerCt.getComponent('infoTab');
                        if (node) {
                            var materialId = node.getId();
                            var parentNode = node.parentNode;
                            controller.deleteMaterial(materialId, parentNode, treeStore, node, infoTab);
                        } else {
                            Ext.Msg.alert('提示', "请选择物料！");
                        }
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
                },
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
                },
                {
                    xtype: 'trigger',
                    colspan: 2,
                    margin: '6 0 0 0 ',
                    width: 160,
                    defaultValue: null,
                    itemId: 'nameSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '按名称查找',
                    hidden: me.getQueryString('materialId') != 'root',
                    onTrigger2Click: function () {//按钮操作
                        var me = this;
                        var treePanel = me.ownerCt.ownerCt;
                        var store = treePanel.store;
                        store.load();
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
                    vtype: 'number',
                    colspan: 2,
                    width: 160,
                    margin: '6 0 0 0 ',
                    defaultValue: null,
                    itemId: 'idSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    minLength: 6,
                    hidden: me.getQueryString('materialId') != 'root',
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '按Id查找',
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
                            treePanel.store.load();
                        }
                    }
                }
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
                    return record.get("name") + '<' + record.get('_id') + '>';
                }
            },
            {
                text: i18n.getKey('type'),
                flex: 1,
                dataIndex: 'type',
                renderer: function (value, mate, record) {
                    var type;
                    if (value == 'MaterialSpu') {
                        type = '<div style="color: green">' + i18n.getKey('SMU') + '</div>'
                    } else if (value == 'MaterialType') {
                        type = '<div style="color: blue">' + i18n.getKey('SMT') + '</div>'
                    }
                    return type;
                }

            }
        ];
        me.bbar = Ext.create('Ext.PagingToolbar', {//底端的分页栏
            store: store,
            displayInfo: false, // 是否 ? 示， 分 ? 信息
            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
            emptyMsg: i18n.getKey('noData')
        });
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
                var infoTab = rowModel.view.ownerCt.ownerCt.getComponent('infoTab');
                var treeStore = me.getStore();
                controller.refreshData(record, infoTab, isLeaf, parentId);
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                var centerPanel = view.ownerCt.ownerCt.getComponent('centerPanel');
                var parentId = record.get('parentId');
                var isLeaf = record.get('isLeaf');
                controller.itemEventMenu(view, record, e, parentId, isLeaf);
            },
            itemexpand: function (node) {
                if (node.childNodes.length > 0) {//展开节点时，更改父节点图标样式
                    //node.getUI().getIconEl().src="../themes/images/default/editor/edit-word-text.png";
                }
                //更改当前节点下的所有子节点的图标
                node.set('icon', '../material/T.png');
                //node.set('iconCls','icon_config');
                for (var i = 0, len = node.childNodes.length; i < len; i++) {
                    var curChild = node.childNodes[i];
                    var type = curChild.get('type');
                    var isLeaf = curChild.get('isLeaf');
                    if (type == 'MaterialSpu') {
                        curChild.set('icon', '../material/S.png');
                    } else {
                        curChild.set('icon', '../material/T.png');
                    }
                }
            },
            afterrender: function (view) {
                view.getHeader().insert(1, {
                    xtype: 'displayfield',
                    hidden: !(me.getQueryString('materialId') == 'root'),//只有在root节点下才能切换视图
                    value: '<a  style="color:#eef6fb" href="#")>' + i18n.getKey('switch') + i18n.getKey('view') + '</a>',
                    listeners: {
                        render: function (display) {
                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                            ela.on("click", function () {
                                console.log(view);
                                JSOpen({
                                    id: 'materialpage',
                                    url: path + 'partials/material/material.html',
                                    title: i18n.getKey('sellMaterial') + i18n.getKey('catalog') + i18n.getKey('view'),
                                    refresh: true
                                });
                            });
                        }
                    }
                });
                var toolbar = view.getDockedItems('toolbar[dock="top"]')[0];
                var nameSearch = toolbar.getComponent('nameSearch');
                var idSearch = toolbar.getComponent('idSearch');
                view.store.on('beforeload', function (store, operator) {
                    var proxy = store.getProxy();
                    var nameSearchValue = nameSearch.getValue();
                    var idSearchValue = idSearch.getValue();
                    if (nameSearchValue || idSearchValue) {
                        var filter = [];
                        if (nameSearchValue) {
                            filter.push({
                                name: 'name',
                                type: 'string',
                                value: nameSearchValue
                            })
                        }
                        if (idSearchValue) {
                            //处理刷新，和加载下层节点
                            //这里改变url中替换{id}的值
                            operator.id = idSearchValue;
                            if (operator.id == operator.node.getId()) {
                                filter.push({
                                    name: "isQueryChildren",
                                    value: true,
                                    type: "boolean"
                                })
                            } else {
                                filter.push({
                                    name: "isQueryChildren",
                                    value: false,
                                    type: "boolean"
                                })
                            }
                        }
                        store.proxy.extraParams = {
                            filter: Ext.JSON.encode(filter)
                        };
                    } else {
                        store.proxy.extraParams = null
                    }
                })
            }
        };
        me.callParent(arguments);

    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
});
