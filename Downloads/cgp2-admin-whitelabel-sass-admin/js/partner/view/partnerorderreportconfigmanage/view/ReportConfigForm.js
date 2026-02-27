/**
 * Created by nan on 2018/1/12.
 */
Ext.define('CGP.partner.view.partnerorderreportconfigmanage.view.ReportConfigForm', {
    extend: 'Ext.ux.form.Panel',
    itemsId: 'reportConfigForm',
    createForm: function () {
        var me = this,
            cfg = {},
            props = me.basicFormConfigs,
            len = props.length,
            i = 0,
            prop;
        for (; i < len; ++i) {
            prop = props[i];
            cfg[prop] = me[prop];
        }
        var model = [];
        if (Ext.isString(me.model))
            model.push(me.model);
        else if (Ext.isArray(me.model))
            model = me.model;
        cfg.model = model;
        cfg.isValid = function () {
            this.owner.msgPanel.hide();
            var isValid = true;
            var errors = {};
            for (var i = 0; i < this.owner.items.items.length; i++) {
                var item = this.owner.items.items[i];
                if (item.xtype == 'uxfieldcontainer') {
                    for (var j = 0; j < item.items.items.length; j++) {
                        var itemIsValid = item.items.items[j].isValid();
                        if (!itemIsValid) {
                            errors[item.items.items[j].getFieldLabel()] = item.items.items[j].getErrors();
                            isValid = false;
                        }
                    }
                } else {
                    if (item.xtype == 'gridfield') {
                        var itemIsValid = item.validate();
                        if (!itemIsValid) {
                            errors[item.getFieldLabel()] = '该输入项为必输项';
                            isValid = false;
                        }
                    } else {
                        var itemIsValid = item.isValid();
                        if (!itemIsValid) {
                            errors[item.getFieldLabel()] = item.getErrors();
                            isValid = false;
                        }
                    }
                }
            }
            if (isValid == false) {
                this.showErrors(errors);
            }
            return isValid;
        };
        return new Ext.ux.form.Basic(me, cfg);
    },
    constructor: function (config) {
        var me = this;
        var recordId = config.recordId;
        var partnerId = config.partnerId;
        var createOrUpdate = config.createOrUpdate;
        var configRecode = config.configRecode;
        var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
        var configStore = config.configStore;
        var partnerReportDetailsConfigStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            fields: [
                {name: 'displayName', type: 'string'}
            ],
            data: []
        });
        var partnerReportSummaryConfigStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            fields: [

                {name: 'displayName', type: 'string'}
            ],
            data: []
        });
        var productConfigsStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            autoLoad: true,
            fields: [
                {name: 'clazz', type: 'string', defaultValue: 'com.qpp.cgp.domain.partner.report.settle.config.PartnerReportProductConfig'},
                {name: 'productId', type: 'string'},
                {name: 'displayName', type: 'string'},
                {name: 'price', type: 'float'}
            ],
            data: [],//configRecode.get('productConfigs'),
            listeners: {
                datachanged: function (store) {
                    partnerReportDetailsConfigStore.removeAll();
                    partnerReportSummaryConfigStore.removeAll();
                    for (var i = 0; i < store.getCount(); i++) {
                        partnerReportDetailsConfigStore.add(store.getAt(i));
                        partnerReportSummaryConfigStore.add(store.getAt(i))
                    }
                }
            }
        });
        applyConfig3 = {
            configRecode: configRecode,
            layout: 'anchor',
            fieldDefaults: {
                labelAlign: 'top',
                padding: 10,
                width: 600,
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 150
            },
            title: config.title,
            items: [
                {
                    xtype: 'gridfield',
                    name: 'productConfigs',
                    allowBlank: false,
                    itemId: 'productConfigs',
                    msgTarget: 'hide',
                    width: 870,
                    height: 300,
                    fieldLabel: i18n.getKey('product') + i18n.getKey('config'),
                    gridConfig: {
                        renderTo: 'grid99',
                        viewConfig: {
                            enableTextSelection: true
                        },
                        height: 300,
                        margin: '10 0 10 50',
                        width: 800,
                        allowBlank: false,
                        store: productConfigsStore,
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                tdCls: 'vertical-middle',
                                itemId: 'actioncolumn',
                                width: 60,
                                sortable: false,
                                resizable: false,
                                menuDisabled: true,
                                items: [
                                    {
                                        iconCls: 'icon_edit icon_margin',
                                        itemId: 'actionedit',
                                        tooltip: 'Edit',
                                        handler: function (view, rowIndex, colIndex, index4, index5, record) {
                                            var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
                                            controller.editOrcreatePartnerReportSummaryConfigItem(view, 'edit', record, partnerId);
                                        }
                                    },
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
                                text: i18n.getKey('product') + i18n.getKey('id'),
                                dataIndex: 'productId',
                                tdCls: 'vertical-middle',
                                width: 250,
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                                    return  value;
                                }

                            },
                            {
                                text: i18n.getKey('displayName'),
                                dataIndex: 'displayName',
                                tdCls: 'vertical-middle',
                                width: 200
                            },
                            {
                                text: i18n.getKey('price'),
                                dataIndex: 'price',
                                tdCls: 'vertical-middle',
                                width: 265


                            }
                        ],
                        tbar: [
                            {
                                text: i18n.getKey('add'),
                                xtype: 'button',
                                iconCls: 'icon_create',
                                handler: function () {
                                    var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
                                    controller.editOrcreatePartnerReportSummaryConfigItem(this.ownerCt.ownerCt, 'create', null, partnerId);
                                }
                            }
                        ]
                    }

                },
                {
                    xtype: 'uxfieldcontainer',
                    width: 800,
                    name: 'partnerReportDetailsConfig',
                    itemId: 'partnerReportDetailsConfig',
                    fieldLabel: i18n.getKey('report') + i18n.getKey('detail') + i18n.getKey('config'),
                    defaults: {
                        labelAlign: 'left',
                        margin: '10 0 10 50',
                        allowBlank: false,
                        width: 550
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'dateFormat',
                            allowBlank: false,
                            itemId: 'dateFormat',
                            emptyText: '如：yyyy年MM月dd日',
                            fieldLabel: i18n.getKey('dateFormat')
                        },
                        {
                            xtype: 'gridfield',
                            name: 'displayNames',
                            itemId: 'displayNames',
                            allowBlank: false,
                            width: 395,
                            fieldLabel: i18n.getKey('displayNames'),
                            gridConfig: {
                                renderTo: 'grid4',
                                selType: 'rowmodel',
                                viewConfig: {
                                    plugins: [
                                        Ext.create('Ext.grid.plugin.DragDrop', {

                                        })
                                    ],
                                    listeners: {
                                        'drop': function () {
                                            this.refresh();
                                        }
                                    },
                                    enableTextSelection: true
                                },
                                height: 200,
                                width: 395,
                                allowBlank: true,
                                store: partnerReportDetailsConfigStore,
                                columns: [
                                    {
                                        xtype: 'rownumberer',
                                        sortable: true,
                                        text: i18n.getKey('seqNo'),
                                        width: 50,
                                        align: 'center'

                                    },
                                    {
                                        text: i18n.getKey('displayName'),
                                        dataIndex: 'displayName',
                                        tdCls: 'vertical-middle',
                                        sortable: false,
                                        width: 320
                                    }
                                ],
                                listeners: {
                                    'beforerender': function (view) {
                                        view.store.removeAll();
                                        if (!Ext.isEmpty(configRecode.get('partnerReportDetailsConfig').displayNames)) {
                                            for (var i = 0; i < configRecode.get('partnerReportDetailsConfig').displayNames.length; i++) {
                                                var model = Ext.create(view.store.model);
                                                model.set('displayName', configRecode.get('partnerReportDetailsConfig').displayNames[i]);
                                                view.store.add(model);
                                            }
                                        }
                                    }

                                }
                            }
                        },
                        {
                            xtype: 'hiddenfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            fieldLabel: i18n.getKey('clazz'),
                            value: 'com.qpp.cgp.domain.partner.report.settle.config.PartnerReportDetailsConfig'
                        }

                    ]
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'partnerReportSummaryConfig',
                    width: 800,
                    itemId: 'partnerReportSummaryConfig',
                    fieldLabel: i18n.getKey('report') + i18n.getKey('summary') + i18n.getKey('config'),
                    defaults: {
                        labelAlign: 'left',
                        margin: '10 0 10 50',
                        allowBlank: false,
                        width: 550
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'dateFormat',
                            itemId: 'dateFormat',
                            allowBlank: false,
                            emptyText: '如：yyyy年MM月dd日',
                            fieldLabel: i18n.getKey('dateFormat')
                        },
                        {
                            xtype: 'textfield',
                            name: 'priceFormat',
                            allowBlank: false,
                            itemId: 'priceFormat',
                            emptyText: '如：#0.00',
                            fieldLabel: i18n.getKey('priceFormat')
                        },
                        {
                            xtype: 'gridfield',
                            name: 'displayNames',
                            itemId: 'displayNames',
                            allowBlank: false,
                            width: 450,
                            fieldLabel: i18n.getKey('displayNames'),
                            gridConfig: {
                                renderTo: 'grid6',
                                selType: 'rowmodel',
                                viewConfig: {
                                    plugins: [
                                        Ext.create('Ext.grid.plugin.DragDrop', {
                                        })
                                    ],
                                    listeners: {
                                        'drop': function () {
                                            this.refresh();
                                        }
                                    },
                                    enableTextSelection: true
                                },
                                height: 200,
                                width: 395,
                                allowBlank: true,
                                store: partnerReportSummaryConfigStore,
                                columns: [
                                    {
                                        xtype: 'rownumberer',
                                        sortable: true,
                                        text: i18n.getKey('seqNo'),
                                        width: 50,
                                        align: 'center'
                                    },
                                    {
                                        text: i18n.getKey('displayName'),
                                        dataIndex: 'displayName',
                                        tdCls: 'vertical-middle',
                                        sortable: false,
                                        width: 320
                                    }
                                ],
                                listeners: {
                                    'beforerender': function (view) {
                                        view.store.removeAll();
                                        if (!Ext.isEmpty(configRecode.get('partnerReportSummaryConfig').displayNames)) {
                                            for (var i = 0; i < configRecode.get('partnerReportSummaryConfig').displayNames.length; i++) {
                                                var model = Ext.create(view.store.model);
                                                model.set('displayName', configRecode.get('partnerReportSummaryConfig').displayNames[i]);
                                                view.store.add(model);
                                            }
                                        }
                                    }
                                }

                            }
                        },
                        {
                            xtype: 'hiddenfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            fieldLabel: i18n.getKey('clazz'),
                            value: 'com.qpp.cgp.domain.partner.report.settle.config.PartnerReportSummaryConfig'

                        }
                    ]
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'partnerReportOrderListConfig',
                    itemId: 'partnerReportOrderListConfig',
                    width: 800,
                    fieldLabel: i18n.getKey('report') + i18n.getKey('orderList') + i18n.getKey('config'),
                    defaults: {
                        labelAlign: 'left',
                        margin: '10 0 10 50',
                        allowBlank: false,
                        width: 550
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'dateFormat',
                            itemId: 'dateFormat',
                            allowBlank: false,
                            emptyText: '如：yyyy年MM月dd日',
                            fieldLabel: i18n.getKey('dateFormat')
                        },
                        {
                            xtype: 'textfield',
                            name: 'priceFormat',
                            allowBlank: false,
                            itemId: 'priceFormat',
                            emptyText: '如：#0.00',
                            fieldLabel: i18n.getKey('priceFormat')
                        },
                        {
                            xtype: 'textfield',
                            name: 'sheetName',
                            allowBlank: false,
                            itemId: 'sheetName',
                            fieldLabel: i18n.getKey('sheetName')
                        },
                        {
                            xtype: 'numberfield',
                            name: 'sheetIndex',
                            allowBlank: false,
                            itemId: 'sheetIndex',
                            minValue: 0,
                            allowDecimals: false,
                            fieldLabel: i18n.getKey('excelSheetIndex')
                        },
                        {
                            xtype: 'hiddenfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            fieldLabel: i18n.getKey('clazz'),
                            value: 'com.qpp.cgp.domain.partner.report.settle.config.PartnerReportOrderListConfig'
                        }
                    ]
                }

            ],
            tbar: [
                {
                    xtype: 'button',
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        var allFormValue = controller.getAllFormValue(this.ownerCt.ownerCt);
                        if (!Ext.isEmpty(allFormValue)) {
                            controller.saveFormValue(partnerId, allFormValue, createOrUpdate);
                        }
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'btnGrid',
                    text: i18n.getKey('grid'),
                    iconCls: 'icon_grid',
                    handler: function () {
                        JSOpen({
                            id: 'partnerOrderReportConfigManage',
                            url: path + 'partials/partnerorderreportconfigmanage/partnerOrderReportConfigManage.html?partnerId=' + partnerId + '&websiteId=' + null,
                            title: i18n.getKey('partnerOrderReportConfigManage') + '(' + i18n.getKey('partner') + i18n.getKey('id') + ':' + partnerId + ')',
                            refresh: true
                        })
                    }
                }
            ]
        };
        me.callParent([applyConfig3]);
    }
})
