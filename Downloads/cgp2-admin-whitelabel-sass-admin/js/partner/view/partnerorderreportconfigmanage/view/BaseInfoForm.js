Ext.Loader.syncRequire(['CGP.mailhistory.controller.overridesubmit']);
Ext.syncRequire(['CGP.mailhistory.controller.Controller', 'CGP.mailhistory.controller.overridesubmit', 'CGP.common.store.OrderStatuses']);
Ext.define('CGP.partner.view.partnerorderreportconfigmanage.view.BaseInfoForm', {
    extend: 'Ext.ux.form.Panel',
    autoScroll: true,
    itemsId: 'baseInfoForm',
    constructor: function (config) {
        var me = this;
        Ext.apply(Ext.form.field.VTypes, {
            Rowcomplare: function (val, field) {
                var startRowValue = Ext.getCmp('titlePositions').getComponent('startRow').getValue();
                var endRowValue = Ext.getCmp('titlePositions').getComponent('endRow').getValue();
                if (!Ext.isEmpty(startRowValue) && !Ext.isEmpty(endRowValue)) {
                    if (startRowValue > endRowValue) {
                        return false;
                    } else {
                        return true;
                    }
                }
                return true;

            },
            complareText: 'start值必须小于end值'
        });
        Ext.apply(Ext.form.field.VTypes, {
            Colcomplare: function (val, field) {
                var startColValue = Ext.getCmp('titlePositions').getComponent('startCol').getValue();
                var endColValue = Ext.getCmp('titlePositions').getComponent('endCol').getValue();
                if (!Ext.isEmpty(startColValue) && !Ext.isEmpty(endColValue)) {
                    if (startColValue > endColValue) {
                        return false;
                    } else {
                        return true;
                    }
                }
                return true;

            },
            complareText: 'start值必须小于end值'
        });
        var recordId = config.recordId;
        var partnerId = config.partnerId;
        var createOrUpdate = config.createOrUpdate;
        var configRecode = config.configRecode;
        var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
        var configStore = config.configStore;
        appayConfig1 = {
            columnCount: 1,
            fieldDefaults: {
                labelAlign: 'left',
                padding: 10,
                width: 650,
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 150
            },
            msgTarget: 'side',
            title: config.title,
            items: [
                {
                    xtype: 'hiddenfield',
                    name: 'clazz',
                    value: 'com.qpp.cgp.domain.partner.report.settle.config.PartnerOrderReportConfig'
                },
                {
                    xtype: 'textfield',
                    name: '_id',
                    itemId: '_id',
                    editable: false,
                    allowBlank: true,
                    fieldLabel: i18n.getKey('id'),
                    hidden: true,
                    fieldStyle: 'background-color:silver',
                    value: configRecode.get('_id')
                },
                {
                    xtype: 'textfield',
                    name: 'partnerId',
                    itemId: 'partnerId',
                    editable: false,
                    allowBlank: false,
                    hidden: true,
                    fieldLabel: i18n.getKey('partner') + i18n.getKey('id'),
                    fieldStyle: 'background-color:silver',
                    value: partnerId
                },

                {
                    xtype: 'textfield',
                    name: 'expression',
                    id: 'expression',
                    fieldLabel: 'cron' + i18n.getKey('expression'),
                    value: configRecode.get('expression')
                },
                {
                    xtype: 'textfield',
                    name: 'fileName',
                    itemId: 'fileName',
                    fieldLabel: i18n.getKey('reportTemplateName'),
                    value: configRecode.get('fileName')
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    name: 'filePath',
                    itemId: 'filePath',
                    width: 800,
                    fieldLabel: i18n.getKey('reportTemplateFilePath'),
                    items: [
                        {
                            xtype: 'textarea',
                            name: 'filePath',
                            itemId: 'filePath',
                            readOnly: true,
                            width: 420,
                            value: configRecode.get('filePath')
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '5 0 0 10',
                                    width: 60,
                                    text: Ext.isEmpty(configRecode.get('filePath')) ? i18n.getKey('add') : i18n.getKey('edit'),
                                    handler: function () {
                                        controller.changeReportTemplateFilePath(this.ownerCt.ownerCt.getComponent('filePath'));
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('download'),
                                    //action: 'download',
                                    width: 60,
                                    margin: '10 0 0 10',
                                    handler: function () {
                                        var fileUrl = this.ownerCt.ownerCt.getComponent('filePath').getValue();
                                        if (!Ext.isEmpty(fileUrl)) {
                                            var fileName = 'file';
                                            const a = document.createElement('a');
                                            a.setAttribute('href', fileUrl);
                                            a.setAttribute('download', fileName);
                                            a.click();
                                        }
                                    }
                                }
                            ]
                        }

                    ]
                },
                {
                    xtype: 'numberfield',
                    name: 'sheetIndex',
                    itemId: 'sheetIndex',
                    minValue: 0,
                    allowDecimals: false,
                    enableKeyEvents: false,
                    fieldLabel: i18n.getKey('excelSheetIndex'),
                    value: configRecode.get('sheetIndex')
                },
                {
                    fieldLabel: i18n.getKey('orderStatus'),
                    id: 'statusId',
                    name: 'statusId',
                    itemId: 'statusId',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('CGP.common.store.OrderStatuses'),
                    displayField: 'name',
                    valueField: 'id',
                    value: configRecode.get('statusId')
                },

                {
                    xtype: 'textfield',
                    name: 'expression',
                    itemId: 'expression',
                    fieldLabel: 'cron' + i18n.getKey('expression'),
                    value: configRecode.get('expression')
                },
                {
                    xtype: 'numberfield',
                    minValue: 1,
                    allowDecimals: false,
                    enableKeyEvents: false,
                    name: 'dateInterval',
                    itemId: 'dateInterval',
                    fieldLabel: i18n.getKey('dateInterval') + '(天)',
                    value: configRecode.get('dateInterval')
                },
                {
                    xtype: 'textfield',
                    name: 'title',
                    itemId: 'title',
                    fieldLabel: i18n.getKey('report') + i18n.getKey('title'),
                    value: configRecode.get('title')
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'titlePositions',
                    itemId: 'titlePositions',
                    id: 'titlePositions',
                    labelAlign: 'top',
                    allowBlank: true,
                    colspan: 2,
                    fieldLabel: i18n.getKey('titlePositions'),
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    defaults: {
                        margin: '10 0 10 50',
                        allowBlank: true,
                        width: 250,
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            hideTrigger: true,
                            name: 'startCol',
                            itemId: 'startCol',
                            value: Ext.isEmpty(configRecode.get('titlePositions')) ? 0 : configRecode.get('titlePositions').startCol,
                            fieldLabel: i18n.getKey('startCol'),
                            vtype: 'Colcomplare'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'startRow',
                            hideTrigger: true,
                            itemId: 'startRow',
                            value: Ext.isEmpty(configRecode.get('titlePositions')) ? 0 : configRecode.get('titlePositions').startRow,
                            fieldLabel: i18n.getKey('startRow'),
                            vtype: 'Rowcomplare'
                        },
                        {
                            xtype: 'numberfield',
                            hideTrigger: true,
                            name: 'endCol',
                            itemId: 'endCol',
                            vtype: 'Colcomplare',
                            value: Ext.isEmpty(configRecode.get('titlePositions')) ? null : configRecode.get('titlePositions').endCol,
                            fieldLabel: i18n.getKey('endCol')

                        },
                        {
                            xtype: 'numberfield',
                            hideTrigger: true,
                            name: 'endRow',
                            itemId: 'endRow',
                            vtype: 'Rowcomplare',
                            value: Ext.isEmpty(configRecode.get('titlePositions')) ? null : configRecode.get('titlePositions').endRow,
                            fieldLabel: i18n.getKey('endRow')
                        }
                    ],
                    listeners: {
                        'change': function (view, newValue, oldValue) {
                        }
                    }
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
                            controller.saveFormValue(partnerId, allFormValue, createOrUpdate, me.tab);

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
        me.callParent([appayConfig1]);
    },
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
    }
})
