Ext.syncRequire(['Ext.ux.form.field.SingleGridComBox', 'Ext.form.field.GridComboBox'])
Ext.define('CGP.bommaterial.edit.module.bom.ChildMaterialForm', {
    extend: 'Ext.form.Panel',
    border: false,
    padding: '10 10 0 10',
    initComponent: function () {
        var me = this;
        me.fieldDefaults = {
            width: 450,
            allowBlank: false
        };
        var controller = Ext.create('CGP.bommaterial.edit.controller.Controller');
        var BomItemType = {
            xtype: 'combo',
            fieldLabel: i18n.getKey('bomType'),
            itemId: 'BomItemType',
            allowBlank: false,
            name: 'type',
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'name', type: 'string'},
                    {name: 'value', type: 'string'}
                ],
                data: [
                    {value: 'FIXED', name: i18n.getKey('FIXED')},
                    {value: 'OPTIONAL', name: i18n.getKey('OPTIONAL')},
                    {value: 'UNASSIGN', name: i18n.getKey('UNASSIGN')}
                ]
            }),
            editable: false,
            valueField: 'value',
            displayField: 'name'
        };
        me.items = [BomItemType];
        me.dockedItems = [
            {
                xtype: 'toolbar',
                //hidden: true,
                dock: 'bottom',
                border: false,
                items: [
                    '->', {
                        type: 'button',
                        text: i18n.getKey('nextStep'),
                        handler: function () {
                            var field = this.ownerCt.ownerCt;
                            if (field.isValid()) {
                                this.setVisible(false);
                                this.ownerCt.getComponent('confirm').setVisible(true);
                                this.ownerCt.getComponent('cancel').setVisible(true);
                                var bomType = field.getComponent('BomItemType').setReadOnly(true);
                                var itemMaterialType = field.getComponent('BomItemType').getValue();
                                if (itemMaterialType == 'OPTIONAL') {
                                    field.add([parentMaterialId, bomName, quantityStrategy, itemMaterial, selectableMaterials])
                                } else if (itemMaterialType == 'UNASSIGN') {
                                    field.add([parentMaterialId, bomName, itemRangeMin, itemRangeMax, quantityStrategy, itemMaterial])
                                } else {
                                    field.add([parentMaterialId, bomName, quantityStrategy, itemMaterial])
                                }
                            }
                        }
                    }, {
                        type: 'button',
                        itemId: 'confirm',
                        hidden: true,
                        text: i18n.getKey('confirm'),
                        handler: function () {
                            var form = this.ownerCt.ownerCt;
                            controller.addChildMaterial(form, me.tree, me.showWindow);
                        }
                    }, {
                        type: 'button',
                        itemId: 'cancel',
                        hidden: true,
                        text: i18n.getKey('cancel'),
                        handler: function () {
                            me.showWindow.close();
                        }
                    }
                ]
            }
        ];

        me.callParent(arguments);
        var store = Ext.create('CGP.bommaterial.store.MaterialStore',{
            pageSize: 10000
        });
        store.load();
        store.on('load', function () {
            store.filter([
                {filterFn: function (item) {
                    return item.get("id") != me.parentMaterialId;
                }}
            ]);
        });
        var parentMaterialId = {
            xtype: 'numberfield',
            name: 'parentMaterialId',
            fieldLabel: 'parentMaterialId',
            hidden: true,
            value: me.parentMaterialId,
            itemId: 'parentMaterialId'
        };
        var bomName = {
            xtype: 'textfield',
            name: 'name',
            fieldLabel: i18n.getKey('name'),
            itemId: 'bomName'
        };
        var quantityStrategy = {
            xtype: 'combo',
            name: 'quantityStrategy',
            fieldLabel: i18n.getKey("quantityStrategy"),
            itemId: 'quantityStrategy',
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'name', type: 'string'}
                ],
                data: [
                    {name: 'basic'}
                ]
            }),
            editable: false,
            allowBlank: false,
            valueField: 'name',
            displayField: 'name'
        };
        var store1 = Ext.create('CGP.bommaterial.store.MaterialStore',{
            pageSize: 10000
        });
        var itemMaterial = {
            name: "itemMaterial",
            xtype: 'gridcombo',
            allowBlank: false,
            fieldLabel: i18n.getKey('itemMaterial'),
            itemId: 'itemMaterial',
            displayField: 'name',
            valueField: 'id',
            autoScroll: true,
            editable: false,
            store: store,
            matchFieldWidth: false,
            multiSelect: false,
            listeners: {
                change: function (combo, record, index) {
                    var itemMaterialType = me.getComponent('BomItemType').getValue();
                    if (!Ext.isEmpty(Object.keys(combo.getValue())) && itemMaterialType == 'OPTIONAL') {
                        var itemMaterialId = parseInt(Object.keys(combo.getValue()));
                        store1.load();
                        store1.on('load', function () {
                            store1.clearFilter();
                            store1.filter([
                                {filterFn: function (item) {
                                    return item.get("id") != itemMaterialId
                                }},
                                {filterFn: function (item) {
                                    return item.get("id") != me.parentMaterialId
                                }}
                            ]);
                        });
                        me.getComponent('selectableMaterials').setVisible(true);
                    }
                }
            },
            gridCfg: {
                store: store,
                height: 200,
                width: 500,
                //hideHeaders : true,
                columns: [
                    {
                        text: i18n.getKey('id'),
                        width: 70,
                        dataIndex: 'id'
                    },
                    {
                        text: i18n.getKey('name'),
                        width: 200,
                        dataIndex: 'name',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            metadata.style = "font-weight:bold";
                            return value;
                        }
                    },
                    {
                        text: i18n.getKey('description'),
                        width: 200,
                        dataIndex: 'description',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            metadata.style = "font-weight:bold";
                            return value;
                        }
                    }
                ]/*,
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: store,
                    displayInfo: true,
                    displayMsg: 'Displaying {0} - {1} of {2}',
                    emptyMsg: i18n.getKey('noData')
                })*/
            }
        };
        var itemRangeMin = {
            xtype: 'numberfield',
            minValue: 0,
            fieldLabel: i18n.getKey('itemRangeMin'),
            itemId: 'itemRangeMin',
            name: 'itemRangeMin'
        };
        var itemRangeMax = {
            xtype: 'numberfield',
            minValue: 0,
            fieldLabel: i18n.getKey('itemRangeMax'),
            itemId: 'itemRangeMax',
            name: 'itemRangeMax'
        };
        var selectableMaterials = {
            name: "selectableMaterials",
            xtype: 'gridcombo',
            hidden: true,
            allowBlank: false,
            fieldLabel: i18n.getKey('selectableMaterials'),
            itemId: 'selectableMaterials',
            displayField: 'name',
            valueField: 'id',
            autoScroll: true,
            editable: false,
            store: store1,
            matchFieldWidth: false,
            multiSelect: true,
            gridCfg: {
                store: store1,
                height: 200,
                width: 500,
                selType: 'checkboxmodel',
                columns: [
                    {
                        text: i18n.getKey('id'),
                        width: 70,
                        dataIndex: 'id'
                    },
                    {
                        text: i18n.getKey('name'),
                        width: 200,
                        dataIndex: 'name',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            metadata.style = "font-weight:bold";
                            return value;
                        }
                    },
                    {
                        text: i18n.getKey('description'),
                        width: 200,
                        dataIndex: 'description',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            metadata.style = "font-weight:bold";
                            return value;
                        }
                    }
                ]/*,
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: store1,
                    displayInfo: true,
                    displayMsg: 'Displaying {0} - {1} of {2}',
                    emptyMsg: i18n.getKey('noData')
                })*/
            }
        }
    }
})