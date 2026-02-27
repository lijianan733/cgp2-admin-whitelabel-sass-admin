Ext.define("CGP.material.view.information.BomItem", {
    extend: "Ext.panel.Panel",
    itemId: 'bomItem',
    alias: 'widget.bomItemPanel',
    autoScroll: true,
    viewConfig: {
        enableTextSelection: true
    },
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    isCreate: false,//是否为新建物料的流程
    data: null,//物料相关信息
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('bomItem');
        var controller = Ext.create('CGP.material.controller.Controller');
        me.store = Ext.create("CGP.material.store.BomItem", {
            data: [],
            id: 'BomItem'
        });
        me.tbar = {
            width: '100%',
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add') + 'BomItem',
                    itemId: 'addBomItem',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                text: i18n.getKey('固定件'),
                                clazz: 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem',
                                handler: function (btn) {
                                    var splitbutton = btn.ownerCt.ownerButton;
                                    var bomItemPanel = splitbutton.ownerCt.ownerCt;
                                    var grid = splitbutton.ownerCt.ownerCt;
                                    var bomItemType = btn.clazz;
                                    controller.editBomItem(grid.store, null, 'add', bomItemPanel.data, bomItemType);
                                }
                            },
                            {
                                text: i18n.getKey('可选件'),
                                clazz: 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem',
                                handler: function (btn) {
                                    var splitbutton = btn.ownerCt.ownerButton;
                                    var bomItemPanel = splitbutton.ownerCt.ownerCt;
                                    var grid = splitbutton.ownerCt.ownerCt;
                                    var bomItemType = btn.clazz;
                                    controller.editBomItem(grid.store, null, 'add', bomItemPanel.data, bomItemType);
                                }
                            },
                            {
                                text: i18n.getKey('待定件'),
                                clazz: 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem',
                                handler: function (btn) {
                                    var splitbutton = btn.ownerCt.ownerButton;
                                    var bomItemPanel = splitbutton.ownerCt.ownerCt;
                                    var grid = splitbutton.ownerCt.ownerCt;
                                    var bomItemType = btn.clazz;
                                    controller.editBomItem(grid.store, null, 'add', bomItemPanel.data, bomItemType);
                                }
                            }

                        ]
                    }
                },
                {
                    text: i18n.getKey('check') + i18n.getKey('bomStructure'),
                    xtype: 'button',
                    hidden: me.isCreate,
                    itemId: 'checkBomStructure',
                    handler: function () {
                        var id = me.data['_id'];
                        var name = me.data['name'];
                        var clazz = me.data['clazz'];
                        var type;
                        if (clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                            type = 'MaterialSpu'
                        } else if (clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
                            type = 'MaterialType'
                        }
                        var leaf = Ext.isEmpty(me.data.childItems) ? true : false;
                        JSOpen({
                            id: 'bomtree',
                            url: path + "partials/material/bomtree.html?materialId=" + id + '&materialName=' + name + '&type=' + type + '&leaf=' + leaf,
                            title: i18n.getKey('sell') + i18n.getKey('bomTree'),
                            refresh: true
                        });
                    }
                },
                {
                    xtype: 'displayfield',
                    hidden: true,
                    itemId: 'tipMsg',
                    value: '<font color="red">SMU只允许有固定件,请把其他类型的bomItem转换为固定件.</font>'
                }
            ]
        };
        var UnassignBOMItemGridStore = Ext.create("CGP.material.store.BomItem", {
            data: [],
            storeId: 'UnassignBOMItemGridStore'
        });
        var FixedBOMItemGridStore = Ext.create("CGP.material.store.BomItem", {
            data: [],
            storeId: 'FixedBOMItemGridStore'
        });
        var OptionalBOMItemGridStore = Ext.create("CGP.material.store.BomItem", {
            data: [],
            storeId: 'OptionalBOMItemGridStore'
        });
        me.callParent(arguments);
        me.content = me;
    },
    getValue: function () {
        var me = this;
        if (me.rendered == false) {
            var attributes = [];
            me.store.data.items.forEach(function (item) {
                var attributeData = item.data;
                attributes.push(attributeData);
            });
            return attributes;
        } else {
            var FixedBOMItemGridStore = Ext.data.StoreManager.getByKey('FixedBOMItemGridStore');
            var UnassignBOMItemGridStore = Ext.data.StoreManager.getByKey('UnassignBOMItemGridStore');
            var OptionalBOMItemGridStore = Ext.data.StoreManager.getByKey('OptionalBOMItemGridStore');
            var result = [];
            var stores = [FixedBOMItemGridStore, UnassignBOMItemGridStore, OptionalBOMItemGridStore];
            for (var i = 0; i < stores.length; i++) {
                stores[i].data.items.forEach(function (item) {
                    var bomItemData = item.data;
                    result.push(bomItemData);
                });
            }
            return result;
        }

    },
    /**
     * 这里动态的添加三种grid是为了好动态的根据物料类型进行控制
     * @param data
     */
    refreshData: function (data) {
        var me = this;
        me.data = data;
        var store = me.store;
        store.removeAll();
        me.removeAll();
        var childItems = data.childItems;
        //其结构上已经有继承的子物料了,就不允许添加和编辑
        var FixedBOMItemGridStore = Ext.data.StoreManager.getByKey('FixedBOMItemGridStore');
        var UnassignBOMItemGridStore = Ext.data.StoreManager.getByKey('UnassignBOMItemGridStore');
        var OptionalBOMItemGridStore = Ext.data.StoreManager.getByKey('OptionalBOMItemGridStore');
        var FixedBOMItemGrid = Ext.create('CGP.material.view.information.views.bomItemSubGrid.FixedBOMItemGrid', {
            gridstore: FixedBOMItemGridStore,
            hidden: true,
            data: me.data,
            title: '<font color=green>' + i18n.getKey('FixedBOMItem') + '</font>'

        });
        var UnassignBOMItemGrid = Ext.create('CGP.material.view.information.views.bomItemSubGrid.UnassignBOMItemGrid', {
            gridstore: UnassignBOMItemGridStore,
            hidden: true,
            data: me.data,
            title: '<font color=green>' + i18n.getKey('UnassignBOMItem') + '</font>'
        });
        var OptionalBOMItemGrid = Ext.create('CGP.material.view.information.views.bomItemSubGrid.OptionalBOMItemGrid', {
            gridstore: OptionalBOMItemGridStore,
            hidden: true,
            data: me.data,
            title: '<font color=green>' + i18n.getKey('OptionalBomItem') + '</font>'
        });
        me.add([FixedBOMItemGrid, UnassignBOMItemGrid, OptionalBOMItemGrid]);
        FixedBOMItemGridStore.removeAll();
        UnassignBOMItemGridStore.removeAll();
        OptionalBOMItemGridStore.removeAll();
        if (!Ext.isEmpty(childItems)) {
            store.add(childItems);
            Ext.Array.each(childItems, function (record) {
                if (record.clazz == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                    UnassignBOMItemGridStore.add(record);
                    if (UnassignBOMItemGrid.isHidden()) {
                        UnassignBOMItemGrid.setVisible(true);
                    }
                } else if (record.clazz == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem') {
                    FixedBOMItemGridStore.add(record);
                    if (FixedBOMItemGrid.isHidden) {
                        FixedBOMItemGrid.setVisible(true);
                    }
                } else if (record.clazz == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                    OptionalBOMItemGridStore.add(record);
                    if (OptionalBOMItemGrid.isHidden) {
                        OptionalBOMItemGrid.setVisible(true);
                    }
                }
            });
        }

        //按钮控制
        var isVisible = (data.parentId == 'root' || data.parentId == null) && (data.leaf == 'true' || data.leaf == true);
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        toolbar.getComponent('addBomItem').setDisabled(!isVisible);
        //如果是SMU就只能添加固定件
        var isEnable = (me.data.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu');
        toolbar.getComponent('addBomItem').menu.items.items[1].setDisabled(isEnable);
        toolbar.getComponent('addBomItem').menu.items.items[2].setDisabled(isEnable);
        //如果没有bomItem就不能查看bom结构按钮
        toolbar.getComponent('checkBomStructure').setDisabled(childItems.length == 0);


    },
    /**
     * 校验，当为SMU物料时，只能有固定件存在
     * @returns {boolean}
     */
    isValid: function () {
        var me = this;
        var type = me.data.clazz;
        var isValid = true;
        if (type == 'com.qpp.cgp.domain.bom.MaterialSpu') {
            var UnassignBOMItemGridStore = Ext.data.StoreManager.getByKey('UnassignBOMItemGridStore');
            var OptionalBOMItemGridStore = Ext.data.StoreManager.getByKey('OptionalBOMItemGridStore');
            if (UnassignBOMItemGridStore.getCount() > 0 || OptionalBOMItemGridStore.getCount() > 0) {
                isValid = false;
            }
        }
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        toolbar.getComponent('tipMsg').setVisible(!isValid);
        return isValid;
    }
});
