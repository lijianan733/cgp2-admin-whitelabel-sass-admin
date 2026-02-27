/**
 *Createdbynanon2018/1/10.
 */
Ext.syncRequire(['CGP.partner.view.partnerorderreportconfigmanage.store.PartnerOrderReportConfigStore']);
Ext.onReady(function () {
    var partnerId = JSGetQueryString('partnerId')
    var websiteId = JSGetQueryString('websiteId');
    var store = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.store.PartnerOrderReportConfigStore', {
        partnerId: partnerId
    })
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('PartnerOrderReportConfigManage'),
        block: 'partnerorderreportconfigmanage',
        editPage: 'edit.html',
        accessControl: false,
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            editActionHandler: function (grid, rowIndex, colIndex) {
                var m = grid.getStore().getAt(rowIndex);
                JSOpen({
                    id: 'partnerOrderReportConfigManageEdit',
                    url: path + "partials/partnerorderreportconfigmanage/edit.html?recordId=" + m.get('_id') + '&partnerId=' + partnerId,
                    title: i18n.getKey('edit') + '_' + i18n.getKey('partnerOrderReportConfig'),
                    refresh: true
                });
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: '_id',
                    sortable: true
                },
                {
                    text: i18n.getKey('partner') + i18n.getKey('id'),
                    dataIndex: 'partnerId',
                    itemId: 'partnerId'
                },
                {
                    text: i18n.getKey('clazz'),
                    dataIndex: 'clazz',
                    hidden: true,
                    itemId: 'clazz'
                },
                {
                    text: i18n.getKey('dateInterval') + '(' + i18n.getKey('day') + ')',
                    dataIndex: 'dateInterval',
                    itemId: 'dateInterval'
                },
                {
                    text: 'cron' + i18n.getKey('expression'),
                    dataIndex: 'expression',
                    itemId: 'expression',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                        return  value
                    }
                },
                {
                    text: i18n.getKey('excelSheetIndex'),
                    dataIndex: 'sheetIndex',
                    itemId: 'sheetIndex',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value

                    }
                },
                {
                    text: i18n.getKey('status') + i18n.getKey('id'),
                    dataIndex: 'statusId',
                    itemId: 'statusId'
                },
                {
                    text: i18n.getKey('title'),
                    dataIndex: 'title',
                    itemId: 'title',
                    width: 150,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value

                    }
                },
                {
                    text: i18n.getKey('mailTemplate') + i18n.getKey('fileName'),
                    dataIndex: 'fileName',
                    itemId: 'fileName',
                    width: 150,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value
                    }
                },
                {
                    text: i18n.getKey('reportTemplateFilePath'),
                    dataIndex: 'filePath',
                    itemId: 'filePath',
                    width: 150,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return  value

                    }
                },
                {
                    text: i18n.getKey('titlePositions'),
                    dataIndex: 'titlePositions',
                    itemId: 'titlePositions',
                    width: 150,
                    xtype: "componentcolumn",
                    renderer: function (value, metadata, record) {
                        if (!Ext.isEmpty(value)) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('titlePositions') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        display.getEl().on("click", function () {
                                            var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
                                            controller.showTitlePositions(value);
                                        });
                                    }
                                }}
                        } else {
                            return null;
                        }
                    }
                },
                {
                    text: i18n.getKey('report') + i18n.getKey('detail') + i18n.getKey('config'),
                    dataIndex: 'partnerReportDetailsConfig',
                    itemId: 'partnerReportDetailsConfig',
                    width: 200,
                    xtype: "componentcolumn",
                    renderer: function (value, metadata, record) {
                        if (!Ext.isEmpty(value)) {
                            value.clazz = value.clazz.substring(value.clazz.lastIndexOf('.') + 1, value.clazz.length);
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('report') + i18n.getKey('detail') + i18n.getKey('config') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        display.getEl().on("click", function () {
                                            var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
                                            controller.showPartnerReportDetailsConfig(value);
                                        });
                                    }
                                }}
                        } else {
                            return null;
                        }
                    }
                },
                {
                    text: i18n.getKey('report') + i18n.getKey('summary') + i18n.getKey('config'),
                    dataIndex: 'partnerReportSummaryConfig',
                    itemId: 'partnerReportSummaryConfig',
                    width: 200,
                    xtype: "componentcolumn",
                    renderer: function (value, metadata, record) {
                        if (!Ext.isEmpty(value)) {
                            value.clazz = value.clazz.substring(value.clazz.lastIndexOf('.') + 1, value.clazz.length);
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('report') + i18n.getKey('summary') + i18n.getKey('config') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        display.getEl().on("click", function () {
                                            var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
                                            controller.showPartnerReportSummaryConfig(value);
                                        });
                                    }
                                }}
                        } else {
                            return null;
                        }
                    }
                },
                {
                    text: i18n.getKey('mailTemplate') + i18n.getKey('config'),
                    dataIndex: 'mailTemplateConfig',
                    itemId: 'mailTemplateConfig',
                    width: 200,
                    xtype: "componentcolumn",
                    renderer: function (value, metadata, record) {
                        if (!Ext.isEmpty(value)) {
                            value.clazz = value.clazz.substring(value.clazz.lastIndexOf('.') + 1, value.clazz.length);
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('mail') + i18n.getKey('template') + i18n.getKey('config') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        display.getEl().on("click", function () {
                                            var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
                                            controller.showMailTemplateConfigDetail(value);
                                        });
                                    }
                                }}
                        } else {
                            return null;
                        }
                    }
                },
                {
                    text: i18n.getKey('product') + i18n.getKey('config'),
                    dataIndex: 'productConfigs',
                    itemId: 'productConfigs',
                    xtype: "componentcolumn",
                    width: 200,
                    renderer: function (value, metadata, record) {
                        if (!Ext.isEmpty(value)) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('product') + i18n.getKey('config') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        display.getEl().on("click", function () {
                                            var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
                                            controller.showProductDetaile(value);
                                        });
                                    }
                                }}
                        } else {
                            return null;
                        }
                    }
                }
            ]
        },
        tbarCfg: {
            btnCreate: {
                handler: function () {
                    JSOpen({
                        id: 'partnerOrderReportConfigManageEdit',
                        url: path + "partials/partnerorderreportconfigmanage/edit.html?partnerId=" + partnerId,
                        title: i18n.getKey('create') + '_' + i18n.getKey('partnerOrderReportConfig'),
                        refresh: true
                    });
                }
            }
        },
        filterCfg: {
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    isLike: false,
                    itemId: '_id'
                },
                {
                    fieldLabel: i18n.getKey('orderStatus') + i18n.getKey('id'),
                    id: 'statusId',
                    name: 'statusId',
                    itemId: 'statusId',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('CGP.common.store.OrderStatuses'),
                    displayField: 'id',
                    valueField: 'id'
                }
            ]
        }
    });
});
