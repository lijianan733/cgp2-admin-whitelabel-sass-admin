Ext.syncRequire([]);
Ext.define("CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.NavigationTree", {
    extend: "Ext.tree.Panel",
    alias: 'widget.navigationtree',
    itemId: 'navigationTree',
    region: 'west',
    width: 350,
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
    split: true,
    autoScroll: true,
    children: null,
    rootVisible: false,
    header: false,
    deselectRecord: null,//记录将被取消选择的记录
    recordData: null,//builderViewDto的数据
    objectValueEqual: function (val1, val2) {
        var me = this;
        if (Ext.Object.isEmpty(val1) || Ext.Object.isEmpty(val2)) {
            if (Ext.Object.isEmpty(val1) && Ext.Object.isEmpty(val2)) {
                return true;
            } else {
                console.log('val1');
                console.log(val1);

                console.log('val2');
                console.log(val2);
                return false;
            }
        }
        var val1PropertyNameArray = Object.getOwnPropertyNames(val1);//获取到对象中所有的属性名的数组
        var val2PropertyNameArray = Object.getOwnPropertyNames(val2);//获取到对象中所有的属性名的数组
        if (val1PropertyNameArray.length != val2PropertyNameArray.length) {
            console.log('val1');
            console.log(val1);

            console.log('val2');
            console.log(val2);
            return false;
        }
        for (var i = 0; i < val1PropertyNameArray.length; i++) {
            var propName = val1PropertyNameArray[i];
            var propA = val1[propName];
            var propB = val2[propName];
            if ((typeof (propA) === 'object')) {
                if (me.objectValueEqual(propA, propB)) {
                    //return true
                } else {

                    console.log('val1');
                    console.log(val1);

                    console.log('val2');
                    console.log(val2);
                    return false
                }
            } else {
                if (propA == propB) {

                } else {
                    console.log('val1'+propA);
                    console.log('val1'+propB);
                    return false;
                }
            }
        }
        return true;
    },
    initComponent: function () {
        var me = this;
        var editViewConfigs = me.recordData ? me.recordData.editViewConfigs : null;
        var store = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.store.NavigationStore', {
            navigationDTOId: JSGetQueryString('navigationId'),
            root: {
                id: 0,
                name: 'root'
            }
        });
        me.store = store;
        store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                var type = item.get('clazz');
                if (type.split('.').pop() == 'FixedNavItemDto' || type.split('.').pop() == 'DynamicNavItemDTO') {
                    item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/node.png');
                    if (editViewConfigs) {
                        for (var i = 0; i < me.recordData.editViewConfigs.length; i++) {
                            var editViewConfig = me.recordData.editViewConfigs[i];
                            if (item.get('id') == editViewConfig.navItemId) {
                                item.set('editViewConfigDTO', editViewConfig);
                                continue;
                            }
                        }
                    }
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
                        var treepanel = button.ownerCt.ownerCt;
                        treepanel.getSelectionModel().deselectAll();
                        var centerPanel = treepanel.ownerCt.getComponent('centerBuilderViewConfigPanel');
                        button.setDisabled(true);
                        centerPanel.refreshData();
                        me.store.load({
                            callback: function () {
                                button.setDisabled(false)
                            }
                        });
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
                    var name = !Ext.isEmpty(record.get("description")) ? record.get("description") : record.get("displayName");
                    return name + '<' + record.get('id') + '>' + '[' + record.get('clazz').split('.').pop() + ']';
                }
            }
        ];
        me.listeners = {
            beforeselect: function (rowModel, record, index) {
                console.log('select');
                //检查是否未保存,就选择其他记录
                console.log('deselect');
                var leftNavigation = rowModel.view.ownerCt;
                var deselectRecord = leftNavigation.deselectRecord;
                var centerPanel = leftNavigation.ownerCt.getComponent('centerBuilderViewConfigPanel');
                var saveBtn = centerPanel.getDockedItems('toolbar[dock="top"]')[0].getComponent('saveBtn');
                if (deselectRecord) {
                    if (
                        deselectRecord.get('clazz') == 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavItemDto' ||
                        deselectRecord.get('clazz') == 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavItemDto'
                    ) {
                        var editViewConfigDTO = deselectRecord.get('editViewConfigDTO');
                        if (Ext.isEmpty(centerPanel.record)) {
                            return true;
                        }
                        var newEditViewConfigDTO = centerPanel.getValue();
                        if (Ext.isEmpty(editViewConfigDTO)) {
                            //新建
                            if (Ext.isEmpty(newEditViewConfigDTO)) {
                                return true;
                            } else {
                                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否保存组件配置?'), function (selector) {
                                    if (selector == 'yes') {
                                        deselectRecord.set('editViewConfigDTO', newEditViewConfigDTO);
                                        leftNavigation.deselectRecord = null;
                                        var result = saveBtn.handler();
                                        result ? rowModel.select(record) : null;
                                    } else {
                                        leftNavigation.deselectRecord = null;
                                        rowModel.select(record);
                                        //centerPanel.refreshData(deselectRecord.getData(), deselectRecord);
                                    }
                                })
                                return false;
                            }
                        } else {
                            if (leftNavigation.objectValueEqual(editViewConfigDTO, newEditViewConfigDTO)) {
                                return true;
                            } else {
                                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否保存组件配置?'), function (selector) {
                                    if (selector == 'yes') {
                                        deselectRecord.set('editViewConfigDTO', newEditViewConfigDTO);
                                        leftNavigation.deselectRecord = null;
                                        var result = saveBtn.handler();
                                        result ? rowModel.select(record) : null;
                                    } else {
                                        leftNavigation.deselectRecord = null;
                                        rowModel.select(record);
                                        //centerPanel.refreshData(deselectRecord.get('editViewConfigDTO'), deselectRecord);
                                    }
                                })
                                return false;
                            }
                        }
                    }
                }
            },
            beforedeselect: function (rowModel, record, index) {
                var leftNavigation = rowModel.view.ownerCt;
                leftNavigation.deselectRecord = record;
            },
            select: function (rowModel, record) {
                var clazz = record.get('clazz');
                var centerPanel = rowModel.view.ownerCt.ownerCt.getComponent('centerBuilderViewConfigPanel');
                if (clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavItemDto') {
                    centerPanel.refreshData(record.get('editViewConfigDTO') || {}, record)
                } else {
                    centerPanel.refreshData();
                }
            },
            itemexpand: function (node) {
                if (node.childNodes.length > 0) {//展开节点时，更改父节点图标样式
                    //node.getUI().getIconEl().src="../themes/images/default/editor/edit-word-text.png";
                }
                //更改当前节点下的所有子节点的图标
                //node.set('iconCls','icon_config');
                for (var i = 0, len = node.childNodes.length; i < len; i++) {
                    var curChild = node.childNodes[i];
                    var type = curChild.get('clazz');
                    var isLeaf = curChild.get('isLeaf');
                    if (type.split('.').pop() == 'FixedNavItemDto' || type.split('.').pop() == 'DynamicNavItemDTO') {
                        curChild.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/node.png');
                    } else {
                        curChild.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/category.png');
                    }
                }
            },
            afterrender: function () {
                var me = this;
                me.expandAll();
            }
        };
        me.callParent();
    }
});
