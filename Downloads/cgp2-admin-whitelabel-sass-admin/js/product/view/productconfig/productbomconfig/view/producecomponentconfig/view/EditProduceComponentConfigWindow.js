/**
 * Created by nan on 2018/10/25.
 */
Ext.define('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.view.EditProduceComponentConfigWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    width: 400,
    minHeight: 190,
    title: '',
    modal: true,
    constrain: true,
    maximizable: true,
    createOrEdit: 'create',
    recordId: null,
    record: null,
    materialPath: null,
    materialName: null,
    productConfigBomId: null,
    treePanel: null,
    gridPanel: null,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        var availablePrintersData = [];
        if (me.record) {
            var availablePrinters = me.record.get('availablePrinters') || [];//这个字段可能为空
            for (var i = 0; i < availablePrinters.length; i++) {
                availablePrintersData.push({
                    code: availablePrinters[i]
                })

            }
        }
        var PrintMachineStore = Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.store.PrintMachineStore');
        var form = Ext.create('Ext.form.Panel', {
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'

            },
            defaults: {
                labelAlign: 'right',
                width: 300
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    name: 'name',
                    allowBlank: false,
                    value: me.record ? me.record.get('name') : me.materialName
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: i18n.getKey('isNeedPrint'),
                    checked: me.record ? me.record.get('isNeedPrint') : false,
                    name: 'isNeedPrint',
                    inputValue: true,
                    value: me.record ? me.record.get('isNeedPrint') : null,
                    listeners: {
                        'change': function (view, newValue, oldValue) {
                            var availablePrinters = view.ownerCt.getComponent('availablePrinters');
                            if (newValue == true) {
                                availablePrinters.show();
                                availablePrinters.setDisabled(false);
                            } else {
                                availablePrinters.hide();
                                availablePrinters.setDisabled(true);
                            }
                        }
                    }
                },
                {
                    name: 'availablePrinters',
                    xtype: 'gridcombo',
                    hidden: me.record ? !me.record.get('isNeedPrint') : true,
                    disabled: me.record ? !me.record.get('isNeedPrint') : true,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('availablePrinters'),
                    itemId: 'availablePrinters',
                    editable: false,
                    multiSelect: true,
                    valueField: 'code',
                    store: PrintMachineStore,
                    displayField: 'code',
                    matchFieldWidth: false,
                    value: me.record ? availablePrintersData : null,
                    gridCfg: {
                        hideHeaders: true,
                        height: 280,
                        width: 350,
                        store: PrintMachineStore,
                        autoScroll: true,
                        selType: 'checkboxmodel',
                        btnSearch: function (btn) {
                            var query = [];
                            var items = btn.ownerCt.items.items;
                            var store = btn.ownerCt.ownerCt.getStore();
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].xtype != 'checkbox' && items[i].xtype != 'button' && items[i].xtype != 'tbfill' && !Ext.isEmpty(items[i].getValue())) {
                                    var filter = {};
                                    filter.value = items[i].getValue();
                                    filter.name = items[i].name;
                                    filter.type = 'string';
                                    query.push(filter);
                                }
                            }
                            if (!Ext.isEmpty(query)) {
                                store.proxy.extraParams = {
                                    filter: Ext.JSON.encode(query)
                                };
                            } else {
                                store.proxy.extraParams = null;
                            }
                            store.loadPage(1);
                        },
                        /**
                         *
                         * @param btn
                         */
                        clearSearch: function (btn) {
                            var items = btn.ownerCt.items.items;
                            var store = btn.ownerCt.ownerCt.getStore();
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].xtype == 'button'||items[i].xtype == 'tbfill') {
                                    continue;
                                }
                                items[i].setValue(null);
                            }
                            store.proxy.extraParams = null;
                        },
                        tbar: {
                            layout: {
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    labelAlign: 'left',
                                    name: 'code',
                                    isLike: false,
                                    flex: 2,
                                    labelWidth: 50,
                                    fieldLabel: i18n.getKey('code')
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    text: i18n.getKey('query'),
                                    handler: function (view) {
                                        view.ownerCt.ownerCt.btnSearch(view);
                                    }
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    text: i18n.getKey('clear'),
                                    handler: function (view) {
                                        view.ownerCt.ownerCt.clearSearch(view);
                                        view.ownerCt.ownerCt.store.load();
                                    }
                                }
                            ]
                        },
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
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var win = form.ownerCt;
                        if (form.isValid()) {
                            var data = form.getValues();
                            var jsonData = {};
                            var url = '';
                            var method = '';
                            if (data.hasOwnProperty('availablePrinters')) {
                                jsonData = {
                                    "availablePrinters": data.availablePrinters,
                                    "name": data.name,
                                    "materialName": win.materialName,
                                    "isNeedPrint": data.isNeedPrint,
                                    "materialPath": win.materialPath,
                                    "productConfigBomId": win.productConfigBomId,
                                    "clazz": "com.qpp.cgp.domain.product.config.ProduceComponentConfig"
                                };
                            } else {
                                jsonData = {
                                    "isNeedPrint": false,
                                    "name": data.name,
                                    "materialName": win.materialName,
                                    "materialPath": win.materialPath,
                                    "productConfigBomId": win.productConfigBomId,
                                    "clazz": "com.qpp.cgp.domain.product.config.ProduceComponentConfig"
                                };
                            }
                            if (win.createOrEdit == 'create') {
                                url = adminPath + 'api/produceComponentConfigs';
                                method = 'POST';
                            } else {
                                url = adminPath + 'api/produceComponentConfigs/' + win.recordId;
                                method = 'PUT';
                            }
                            Ext.Ajax.request({
                                url: url,
                                method: method,
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                jsonData: jsonData,
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        var id = responseMessage.data._id;
                                        var grid = win.gridPanel.items.items[0].grid;
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                                            win.treePanel.produceComponentConfigStore.load(function () {
                                                win.treePanel.store.load({
                                                    node: win.treePanel.getRootNode(),
                                                    callback: function () {
                                                        win.treePanel.expandAll();
                                                        grid.store.load(function (records) {
                                                            var record = grid.store.findRecord('_id', id);
                                                            grid.getSelectionModel().select(record);
                                                        });
                                                    }
                                                });
                                            })
                                            win.close();
                                        });
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
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
                        btn.ownerCt.ownerCt.ownerCt.close();

                    }
                }
            ]
        });
        me.add(form);
    }
})
