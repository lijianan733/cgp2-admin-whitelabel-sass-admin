Ext.Loader.syncRequire(['Ext.ux.form.field.MultiCombo', 'CGP.mailhistory.controller.overridesubmit', 'CGP.mailhistory.view.DiyArrayColumn',
    'Ext.ux.form.field.MultiCombo', 'Ext.ux.grid.column.ArrayColumn', 'CGP.common.store.WebsiteObject']);
Ext.onReady(function () {
    var store = Ext.create('CGP.mailhistory.store.Store');
    var websiteStore = Ext.StoreManager.lookup('websiteStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey("mailhistories"),
        block: 'mailhistories',
        editPage: 'edit.html',
        //		accessControl: true,
        tbarCfg: {
            disabledButtons: ['create', 'delete', 'config']
        },
        gridCfg: {
            store: store,
            frame: false,
            deleteAction: false,
            editAction: false,
            columnDefaults: {
                autoSizeColumn: true,
                sortable: false,
            },
            viewConfig: {
                enableTextSelection: true
            },
            columns: [
                {
                    xtype: 'componentcolumn',
                    itemId: "reSend",
                    renderer: function (value, metaData, record, rowIndex) {
                        var receiver = record.get('receiver');
                        var id = record.get('id');
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            border: false,
                            style: 'padding:0',
                            items: [
                                {
                                    text: i18n.getKey('reSend'),
                                    itemId: 'reSend',
                                    width: '100%',
                                    handler: function () {
                                        Ext.create('CGP.mailhistory.view.ResendWin', {
                                            receiver: receiver,
                                            record: record,
                                            recordId: id
                                        }).show();
                                    }

                                }
                            ]
                        };

                    }
                },
                {
                    text: i18n.getKey("subject"),
                    dataIndex: 'subject',
                    xtype: 'gridcolumn',
                    width: 250,
                    itemId: 'subject',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        metadata.style = "font-weight:bold";
                        return value;
                    }
                },
                {
                    xtype: 'gridcolumn',
                    text: i18n.getKey('shippingName'),
                    dataIndex: 'from',
                    width: 160,
                    itemId: 'from',
                    renderer: function (value, metaData) {
                        metaData.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey("receiver"),
                    dataIndex: 'to',
                    xtype: 'diyarraycolumn',
                    width: 180,
                    itemId: 'receiver',
                    maxLineCount: 5,
                    lineNumber: 1,
                    renderer: function (value, metaData) {
                        metaData.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey("isSuccess"),
                    dataIndex: 'success',
                    xtype: 'gridcolumn',
                    width: 80,
                    itemId: 'isSuccess',
                    renderer: function (v) {
                        return JSCreateFont(v ? 'green' : 'red', true, i18n.getKey(v || false));
                    }
                },
                {
                    text: i18n.getKey("errorMessage"),
                    dataIndex: 'errorMessage',
                    xtype: 'atagcolumn',
                    width: 120,
                    itemId: 'errorMessage',
                    getDisplayName: function (value, metaData, record) {
                        return '<a href="#" style="text-decoration: none;color: blue">查看</a>'
                    },
                    clickHandler: function (value, metaData, record) {
                        JSShowJsonData(value, '错误信息', {
                            grow: true,
                            vtype: null,
                            width: 450,
                        }, {
                            width: null,
                            height: null,
                        });
                    }
                },
                {
                    text: i18n.getKey("content"),
                    dataIndex: 'text',
                    xtype: 'componentcolumn',
                    itemId: 'content',
                    sortable: false,
                    width: 120,
                    renderer: function (value, metaData, record, rowIndex) {
                        return {
                            xtype: 'displayfield',
                            value: "<a href='#' style='text-decoration: none;color: blue;'>" + i18n.getKey('check') + "</font>",
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        if (Ext.getCmp('winShow')) {
                                            Ext.getCmp('winShow').body.dom.innerHTML = value;
                                        } else {
                                            var win = Ext.create("Ext.window.Window", {
                                                id: "winShow",
                                                width: 800,
                                                layout: 'fit',
                                                constrain: true,
                                                autoScroll: true,
                                                title: i18n.getKey("content"),
                                                html: value
                                            });
                                            //主显示页面的高度
                                            var pageHeight = page.getHeight();
                                            Ext.getCmp('winShow').setHeight(pageHeight * 0.8);
                                            win.show();
                                        }
                                    });
                                }
                            }
                        }

                    }

                },
                {
                    text: i18n.getKey("sendDate"),
                    dataIndex: 'sendDate',
                    xtype: 'gridcolumn',
                    itemId: 'sendDate',
                    align: 'center',
                    renderer: function (value, metadata, record) {
                        metadata.style = "color: gray";
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                },
                {
                    text: i18n.getKey("checkAttachments"),
                    dataIndex: 'attachments',
                    width: 160,
                    xtype: 'arraycolumn',
                    itemId: 'attachments',
                    lineNumber: 1,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        var urlName = value['name'];
                        var url = value['url'];
                        return "<a target='_blank' style='text-decoration: none' href=" + url + '>' + urlName + '</a>';
                    }
                },
            ]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                isLike: false
            },
            items: [
                {
                    name: 'from',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey("shippingName"),
                    itemId: 'from',
                    isLike: true
                },
                {
                    name: 'to',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey("receiver"),
                    itemId: 'receiver',
                    isLike: true
                },
                {
                    name: 'success',
                    xtype: 'booleancombo',
                    fieldLabel: i18n.getKey("isSuccess"),
                    itemId: 'success',
                    displayField: 'display',
                    valueField: 'value',
                    haveReset: true,
                    editable: false,
                    store: {
                        xtype: 'store',
                        fields: [{
                            name: 'value',
                            type: 'boolean'
                        }, {
                            name: 'display',
                            type: 'string'
                        }],
                        data: [
                            {
                                value: true,
                                display: i18n.getKey(true)
                            },
                            {
                                value: false,
                                display: i18n.getKey(false)
                            }
                        ],
                    },
                },
                {
                    name: 'subject',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey("subject"),
                    itemId: 'subject'
                },
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'sendDate',
                    xtype: 'datefield',
                    itemId: 'CreatedDate',
                    fieldLabel: i18n.getKey("sendDate"),
                    format: 'Y/m/d',
                    scope: true,
                    width: 218
                },
            ]
        }
    });
});