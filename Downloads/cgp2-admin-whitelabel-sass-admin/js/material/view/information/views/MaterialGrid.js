Ext.Loader.syncRequire([
    'CGP.common.field.MaterialSelectField'
]);
Ext.define('CGP.material.view.information.views.MaterialGrid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    itemId: 'materialGrid',
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.material.store.MaterialList');
        var controller = Ext.create('CGP.material.controller.Controller');
        me.gridCfg = {
            editAction: false,
            deleteAction: false,
            store: me.store,
            defaults: {
                width: 180

            },
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add') + ('SMT'),
                    iconCls: 'icon_create',
                    handler: function () {
                        var treepanel = me.ownerCt.ownerCt.down('treepanel');
                        var category = treepanel.getSelectionModel().getSelection()[0];
                        var gridStore = me.down('grid').getStore();
                        controller.categoryAddMaterial(category, gridStore, treepanel, 'MaterialType');
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('add') + ('SMU'),
                    iconCls: 'icon_create',
                    handler: function () {
                        var treepanel = me.ownerCt.ownerCt.down('treepanel');
                        var category = treepanel.getSelectionModel().getSelection()[0];
                        var gridStore = me.down('grid').getStore();
                        controller.categoryAddMaterial(category, gridStore, treepanel, 'MaterialSpu');
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('batch') + i18n.getKey('modify') + i18n.getKey('catalog'),
                    iconCls: 'icon_batch',
                    handler: function () {
                        var grid = me.down('grid');
                        var treePanel = me.ownerCt.ownerCt.down('treepanel');
                        var materialIdArr = [];
                        var selects = grid.getSelectionModel().getSelection();
                        Ext.Array.each(selects, function (item) {
                            materialIdArr.push(item.getId())
                        });
                        if (Ext.isEmpty(selects)) {
                            Ext.Msg.alert(i18n.getKey('prompt'), '请选择需要修改类目的物料！');
                        } else {
                            var categoryId = selects[0].get('category');
                            controller.batchModifyCategory(materialIdArr, grid, treePanel, categoryId);
                        }
                    }
                }
            ],
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('check') + i18n.getKey('materialInfo'),
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var treePanel = me.ownerCt.ownerCt.down('treepanel');
                                var id = record.getId();
                                var isLeaf = record.get('isLeaf');
                                var parentId = me.data.parentId;
                                JSOpen({
                                    id: 'material' + '_edit',
                                    url: path + "partials/material/edit.html?materialId=" + id + '&isLeaf=' + isLeaf + '&parentId=' + parentId + '&isOnly=true',
                                    title: i18n.getKey('sell') + i18n.getKey('materialInfo') + '(' + i18n.getKey('id') + ':' + id + ')',
                                    refresh: true
                                });
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actiondelete',
                            tooltip: i18n.getKey('remove'),
                            isDisabled: function () {
                                var isHide = arguments[4].data.isLeaf;
                                return !isHide;
                                //console.log(arguments);
                            },
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var store = view.getStore();
                                var treePanel = me.ownerCt.ownerCt.down('treepanel');
                                var parentNode = treePanel.getSelectionModel().getSelection()[0];
                                var treeStore = treePanel.getStore();
                                controller.deleteMaterial(record.getId(), parentNode, treeStore, record, me.ownerCt, store);
                            }
                        }
                    ]
                },
                {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    tdCls: 'vertical-middle',
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var clazz = record.get('clazz');
                        var materialData = record.raw;
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            default: {
                                width: 100
                            },
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('check') + i18n.getKey('materialTree'),
                                                disabledCls: 'menu-item-display-none',
                                                hidden: record.get('type') == 'MaterialSpu',
                                                handler: function () {
                                                    var id = record.getId();
                                                    var isLeaf = record.get('isLeaf');
                                                    var name = record.get('name');
                                                    JSOpen({
                                                        id: 'materialstree',
                                                        url: path + "partials/material/materialtree.html?materialId=" + id + '&materialName=' + name + '&isLeaf=' + isLeaf,
                                                        title: i18n.getKey('sell') + i18n.getKey('materialTree'),
                                                        refresh: true
                                                    });
                                                }
                                            },
                                            {
                                                text: i18n.getKey('check') + i18n.getKey('bomStructure'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var id = record.getId();
                                                    var name = record.get('name');
                                                    var type = record.get('type');
                                                    var leaf = Ext.isEmpty(record.raw.childItems) ? true : false;
                                                    JSOpen({
                                                        id: 'bomtree',
                                                        url: path + "partials/material/bomtree.html?materialId=" + id + '&materialName=' + name + '&type=' + type + '&leaf=' + leaf,
                                                        title: i18n.getKey('sell') + i18n.getKey('bomTree'),
                                                        refresh: true
                                                    });
                                                }
                                            },
                                            {
                                                text: i18n.getKey('modify') + i18n.getKey('catalog'),
                                                disabledCls: 'menu-item-display-none',
                                                hidden: me.ownerCt.ownerCt.down('treepanel').getItemId() == 'materialTree',
                                                handler: function () {
                                                    var grid = me.down('grid');
                                                    var treePanel = me.ownerCt.ownerCt.down('treepanel');
                                                    var categoryId = record.get('category');
                                                    controller.modifyCategory(record.getId(), grid, treePanel, categoryId)
                                                }
                                            },
                                            {
                                                text: i18n.getKey('checkOrderLineItem'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var materialId = record.get('_id');
                                                    var isTest = record.get('isTest');
                                                    JSOpen({
                                                        id: 'orderlineitempage',
                                                        url: path + 'partials/orderlineitem/orderlineitem.html' +
                                                            '?materialId=' + materialId +
                                                            '&isTest2=' + isTest,
                                                        title: '订单项管理 所有状态',
                                                        refresh: true
                                                    });
                                                }
                                            },
                                            {
                                                text: i18n.getKey('add') + 'BomItem',
                                                itemId: 'addBomItem',
                                                disabled: materialData.leaf == false,//有子物料就不能修改
                                                menu: [
                                                    {
                                                        text: i18n.getKey('固定件'),
                                                        clazz: 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem',
                                                        handler: function (btn) {
                                                            var grid = me.down('grid');
                                                            controller.quickCreateBomItem(btn.clazz, materialData, grid);
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('可选件'),
                                                        disabled: clazz == 'com.qpp.cgp.domain.bom.MaterialSpu',
                                                        clazz: 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem',
                                                        handler: function (btn) {
                                                            var grid = me.down('grid');
                                                            controller.quickCreateBomItem(btn.clazz, materialData, grid);
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('待定件'),
                                                        disabled: clazz == 'com.qpp.cgp.domain.bom.MaterialSpu',
                                                        clazz: 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem',
                                                        handler: function (btn) {
                                                            var grid = me.down('grid');
                                                            controller.quickCreateBomItem(btn.clazz, materialData, grid);
                                                        }
                                                    }
                                                ]
                                            },
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    width: 180,
                    tdCls: 'vertical-middle',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 180,
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    tdCls: 'vertical-middle',
                    sortable: true,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    width: 180,
                    xtype: 'gridcolumn',
                    itemId: 'code',
                    sortable: true,
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    width: 180,
                    tdCls: 'vertical-middle',
                    itemId: 'type',
                    sortable: false,
                    renderer: function (value, metadata) {
                        var type;
                        if (value == 'MaterialSpu') {
                            type = '<div style="color: green">' + i18n.getKey('SMU') + '</div>'
                        } else if (value == 'MaterialType') {
                            type = '<div style="color: blue">' + i18n.getKey('SMT') + '</div>'
                        }
                        return type;
                    }
                }
            ]
        };
        me.filterCfg = {
            height: 100,
            header: false,
            defaults: {
                width: 280,
                isLike: false
            },
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code'
                },
                {
                    name: 'clazz',
                    xtype: 'combo',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: 'MaterialType', value: 'com.qpp.cgp.domain.bom.MaterialType'},
                            {
                                name: 'MaterialSpu', value: 'com.qpp.cgp.domain.bom.MaterialSpu'
                            }
                        ]
                    }),
                    editable: false,
                    displayField: 'name',
                    valueField: 'value',
                    queryMode: 'local',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type'
                }
            ]
        };
        me.callParent(arguments);
    },
    refreshData: function (data) {
        var me = this;
        var store = me.down('grid').getStore();
        me.data = data;
        store.proxy.url = adminPath + 'api/materialCategories/' + data.getId() + '/materials';
        if (data.searchMaterialId) {
            me.filter.getComponent('id').setValue(data.searchMaterialId)
        } else {
            me.filter.getComponent('id').setValue(null)
        }
        me.ownerCt.setTitle("<font color=black>" + data.get('name') + "</font>" + '类目下所有物料');
        store.loadPage(1);

    },
    searchMaterial: function (materialId) {
        var me = this;
        var store = me.down('grid').getStore();
        store.proxy.url = store.proxy.url + '?_id=' + materialId;
        store.load();
    }
});
