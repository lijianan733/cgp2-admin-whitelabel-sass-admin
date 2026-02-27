Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function () {


    var countryStore = new Ext.data.Store({
        storeId: 'treeStore',
        fields: [
            {
                name: 'id',
                type: 'int'
            },
            'name'
        ],
        proxy: {
            type: 'uxrest',
            url: adminPath + 'api/countries',
            reader: {
                type: 'json',
                root: 'data.content'
            }
        }
    });


    var rowEditing = new Ext.grid.plugin.CellEditing({
        clicksToEdit: 1,
        listeners: {
            edit: function (editor, e) {
                e.record.commit();
            }
        }
    });

    var numberEditorConfig = {
        xtype: 'numberfield',
        allowBlnk: false,
        hideTrigger: true,
        allowExponential: false,
        decimalPrecision: 2
    }

    var rulesGrid = {
        width: 850,
        height: 800,
        plugins: [rowEditing],
        tbar: [
            {
                xtype: 'button',
                text: i18n.getKey('addRangeRule'),
                handler: function () {
                    var store = this.ownerCt.ownerCt.getStore();
                    if (store.getCount() == 0) {
                        //第一条  默认为0.1到9999999.9
                        store.insert(0, {
                            startWeight: 0.1,
                            endWeight: 9999999.9,
                            firstWeight: 2,
                            firstFee: 10,
                            plusWeight: 2,
                            plusFee: 5,
                            extraFeeRate: 0
                        })
//
                    } else {
                        var preRecord = store.getAt(store.getCount() - 1).data;
                        var newRecord = Ext.merge({}, preRecord);
                        newRecord.startWeight = newRecord.endWeight + 0.1;
                        newRecord.firstWeight = newRecord.startWeight;
                        newRecord.endWeight = 9999999.9;
                        newRecord.firstWeight = newRecord.startWeight;
                        store.insert(store.getCount(), newRecord);
                    }
                    newRecord.submit();
                    //                rowEditing.startEdit(store.getCount() - 1, 0);
                }
            }
        ],
        store: new Ext.data.Store({
            model: 'CGP.model.PostageTemplate'
        }),
        columns: [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                resizable: false,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        handler: function (view, rowIndex, colIndex) {
                            var store = view.getStore();
                            store.removeAt(rowIndex);
                        }
                    }
                ]
            },
            {
                dataIndex: 'startWeight',
                text: i18n.getKey('startWeight'),
                editor: numberEditorConfig
            },
            {
                dataIndex: 'endWeight',
                text: i18n.getKey('endWeight'),
                editor: numberEditorConfig
            },
            {
                dataIndex: 'firstWeight',
                text: i18n.getKey('firstWeight'),
                editor: numberEditorConfig
            },
            {
                dataIndex: 'firstFee',
                text: i18n.getKey('firstFee'),
                editor: numberEditorConfig
            },
            {
                dataIndex: 'plusWeight',
                text: i18n.getKey('plusWeight'),
                editor: numberEditorConfig
            },
            {
                dataIndex: 'plusFee',
                text: i18n.getKey('plusFee'),
                editor: numberEditorConfig
            },
            {
                dataIndex: 'extraFeeRate',
                width: 150,
                text: i18n.getKey('extraFeeRate'),
                editor: {
                    xtype: 'numberfield',
                    allowBlnk: false,
                    hideTrigger: true,
                    allowExponential: false,
                    decimalPrecision: 4
                }
            }
        ]

    };


    var page = Ext.widget({
        block: 'postage',
        xtype: 'uxeditpage',
        formCfg: {
            model: 'CGP.model.ExpressPostage',
            columnCount: 1,
            items: [
                {
                    name: 'country',
                    xtype: 'gridcombo',
                    displayField: 'name',
                    useRealValue: true,
                    valueField: 'id',
                    fieldLabel: i18n.getKey('address'),
                    pickerAlign: 'bl',
                    store: countryStore,
                    itemId: 'country',
                    multiSelect: false,
                    gridCfg: {
                        store: countryStore,
                        height: 300,
                        width: 400,
                        columns: [
                            {
                                xtype: 'rownumberer',
                                itemId: 'rownumberer',
                                resizable: true,
                                menuDisabled: true
                            },
                            {
                                text: 'name',
                                dataIndex: 'name',
                                width: 230
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: countryStore,
                            displayInfo: true,
                            displayMsg: 'Displaying {0} - {1} of {2}',
                            emptyMsg: i18n.getKey('noData')
                        })
                    },
                    listeners: {
                        afterrender: function () {
                            this.setDisabled(this.ownerCt.getCurrentMode() == 'editing');
                        }
                    }
                },
                {
                    name: 'websiteId',
                    itemId: 'websiteId',
                    xtype: 'websitecombo',
                    editable: false,
                },
                {
                    name: 'rules',
                    xtype: 'gridfield',
                    fieldLabel: i18n.getKey('rules'),
                    itemId: 'rules',
                    gridConfig: rulesGrid
                }
            ]
        }
    });


});