/**
 * Created by nan on 2018/10/24.
 */
Ext.define('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.view.ProduceComponentConfigGrid', {
    extend: 'Ext.panel.Panel',
    region: 'center',
    layout: 'fit',
    header: false,
    itemId: 'produceComponentConfigGrid',
    flex: 1,
    produceComponentConfigStore: null,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        var PrintMachineStore = Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.store.PrintMachineStore');
        var gridConstrainer = Ext.create('CGP.common.commoncomp.QueryGrid', {
            gridCfg: {
                selType: 'rowmodel',
                store: Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.store.ProduceComponentConfigStore', {
                    params: {
                        filter: Ext.JSON.encode([
                            {
                                name: 'productConfigBomId',
                                type: 'number',
                                value: me.productConfigBomId
                            }
                        ])
                    }
                }),
                editAction: true,
                deleteAction: false,
                editActionHandler: function (btn) {
                    var record = arguments[5];
                    var recordId = arguments[5].getId();
                    var gridPanel = btn.ownerCt.ownerCt.ownerCt;
                    var materialName = record.get('materialName');
                    var materialPath = record.get('materialPath');
                    var productBomTree = gridPanel.ownerCt.getComponent('productBomTree');
                    var win = Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.view.EditProduceComponentConfigWindow', {
                        title: i18n.getKey('edit') + i18n.getKey('productComponentConfig'),
                        materialPath: materialPath,
                        productConfigBomId: gridPanel.productConfigBomId,
                        createOrEdit: 'edit',
                        recordId: recordId,
                        record: record,
                        treePanel: productBomTree,
                        gridPanel: gridPanel,
                        materialName: materialName
                    });
                    win.show();
                },
                columnDefaults: {
                    tdCls: 'vertical-middle',
                    width: 200
                },
                columns: [
                    {
                        dataIndex: '_id',
                        text: i18n.getKey('id'),
                        itemId: '_id',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'name',
                        text: i18n.getKey('name'),
                        itemId: 'name',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'materialName',
                        text: i18n.getKey('materialName'),
                        itemId: 'materialName',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'isNeedPrint',
                        text: i18n.getKey('isNeedPrint'),
                        itemId: 'isNeedPrint',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return i18n.getKey(value);
                        }
                    },
                    {
                        dataIndex: 'availablePrinters',
                        xtype: 'arraycolumn',
                        flex: 2,
                        text: i18n.getKey('availablePrinters'),
                        itemId: 'availablePrinters',
                        renderer: function (value, metadata) {
                            if (value) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            } else {
                                return null;
                            }


                        }
                    }
                ],
                listeners: {
                    select: function (thisRow, record) {
                        var materialPath = record.get('materialPath').replace(/,/g, '/');
                        var productBomTree = thisRow.view.ownerCt.ownerCt.ownerCt.ownerCt.getComponent('productBomTree');
                        productBomTree.selectPath('/' + materialPath);
                    }
                }
            },

            filterCfg: {
                height: 80,
                header: false,
                defaults: {
                    width: 280
                },
                border: false,
                items: [
                    {
                        name: '_id',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('id'),
                        itemId: '_id',
                        isLike: false
                    },
                    {
                        name: 'isNeedPrint',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('isNeedPrint'),
                        itemId: 'isNeedPrint',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: [
                                {
                                    name: i18n.getKey('true'),
                                    value: true
                                },
                                {
                                    name: i18n.getKey('false'),
                                    value: false
                                }
                            ]
                        }),
                        valueField: 'value',
                        displayField: 'name'
                    },
                    /*    {
                            name: 'availablePrinters',
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('availablePrinters'),
                            itemId: 'availablePrinters',
                            editable: false,
                            store: Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.store.PrintMachineStore'),
                            valueField: 'code',
                            displayField: 'code'
                        },*/
                    {
                        name: 'availablePrinters',
                        xtype: 'gridcombo',
                        fieldLabel: i18n.getKey('availablePrinters'),
                        itemId: 'availablePrinters',
                        editable: false,
                        valueField: 'code',
                        store: PrintMachineStore,
                        displayField: 'code',
                        matchFieldWidth: false,
                        gridCfg: {
                            hideHeaders: true,
                            height: 280,
                            width: 350,
                            store: PrintMachineStore,
                            autoScroll: true,
                            bbar: [
                                {
                                    xtype: 'pagingtoolbar',
                                    store: PrintMachineStore,   // same store GridPanel is using
                                    dock: 'bottom',
                                    displayInfo: false,
                                    prependButtons: false

                                }
                            ],
                            columns: [
                                {
                                    text: 'code',
                                    flex: 1,
                                    dataIndex: 'code'
                                }
                            ]
                        }
                    },
                    {
                        name: 'productConfigBomId',
                        xtype: 'numberfield',
                        hidden: true,
                        fieldLabel: i18n.getKey('productConfigBomId'),
                        itemId: 'productConfigBomId',
                        value: me.productConfigBomId
                    }
                ]
            }
        });
        me.add(gridConstrainer);
    }
})

