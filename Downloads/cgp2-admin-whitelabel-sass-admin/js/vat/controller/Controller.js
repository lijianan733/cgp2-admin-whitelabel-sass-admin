/**
 * @Description:
 * @author nan
 * @date 2023/8/2
 */
Ext.define('CGP.vat.controller.Controller', {
    /**
     *
     * @param nextStatus
     * @param grid
     * @param record
     * @param type QPVAT||PartnerVAT
     */
    showModifyWin: function (nextStatus, grid, record, type, title) {
        var recordId = record.getId();
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: title || '修改状态',
            layout: 'fit',
            items: [
                {
                    xtype: 'errorstrickform',
                    width: 450,
                    itemId: 'form',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center',
                    },
                    defaults: {
                        width: '100%',
                        margin: '5 25'
                    },
                    items: [
                        {
                            xtype: 'textarea',
                            name: 'remark',
                            itemId: 'remark',
                            minHeight: 100,
                            fieldLabel: i18n.getKey('remark')
                        },
                        {
                            xtype: 'hiddenfield',
                            name: 'status',
                            itemId: 'status',
                            fieldLabel: i18n.getKey('status'),
                            value: nextStatus
                        }
                    ]
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var url = '';
                        var win = btn.ownerCt.ownerCt;
                        var form = win.getComponent('form');
                        var data = form.getValue();
                        var jsonData = '';
                        if (type == 'QPVAT') {
                            url = adminPath + 'api/qp/vatIds/' + recordId;
                            jsonData = Ext.Object.merge(record.getData(), {
                                "remark": data.remark || '',
                                "status": data.status
                            });
                        } else if (type == 'PartnerVAT') {
                            url = adminPath + 'api/vatIds/' + recordId;
                            jsonData = {
                                "remark": data.remark || '',
                                "status": data.status
                            };
                        }
                        JSAjaxRequest(url, 'PUT', true, jsonData, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    if (type == 'PartnerVAT') {
                                        grid.store.load();
                                        win.close();
                                        Ext.Msg.confirm(i18n.getKey('prompt'), '修改成功,是否查看修改结果', function (selector) {
                                            if (selector == 'yes') {
                                                JSOpen({
                                                    id: 'vat_checkedpage',
                                                    url: path + 'partials/vat/main.html?_id=' + recordId,
                                                    title: i18n.getKey('税资质(已审核)'),
                                                    refresh: true
                                                });
                                            }
                                        });
                                    } else if (type == 'QPVAT') {
                                        grid.store.load();
                                        win.close();
                                        Ext.Msg.alert(i18n.getKey('prompt'), '修改成功', function (selector) {
                                        });
                                    }
                                }
                            }
                        }, true);
                    }
                }
            }
        });
        win.show();
    },
    showOperationHistory: function (record) {
        var recordId = record.getId();
        var store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [
                '_id',
                'operationDate',
                'operationEmail',
                'operationName',
                'operationStatus',
                'qpVatId',
                'remark',
                'clazz'
            ],
            proxy: {
                type: 'uxrest',
                url: adminPath + `api/qp/vatIds/${recordId}/histories`,
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
        })
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: '操作历史',
            layout: 'fit',
            items: [
                {
                    xtype: 'grid',
                    store: store,
                    width: 600,
                    minHeight: 150,
                    maxHeight: 450,
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            text: '操作人',
                            dataIndex: '',
                            width: 250,
                            renderer: function (value, metaData, record) {
                                var titleData = [
                                    {
                                        title: '姓名',
                                        value: record.get('operationName')
                                    },
                                    {
                                        title: '邮箱',
                                        value: record.get('operationEmail')
                                    },
                                ];
                                return JSCreateHTMLTable(titleData);
                            }
                        },
                        {
                            text: '操作',
                            dataIndex: 'operationStatus',
                            renderer: function (value, metaData, record) {
                                return value == 'Valid' ? '启用' : '废弃';
                            }
                        },
                        {
                            text: '日期',
                            dataIndex: 'operationDate',
                            renderer: function (value, metaData, record) {
                                metaData.style = "color: gray";
                                value = Ext.Date.format(new Date(value), 'Y/m/d H:i');
                                metaData.tdAttr = 'data-qtip="' + value + '"';
                                return '<div style="white-space:normal;">' + value + '</div>';
                            }
                        },
                        {
                            text: '备注',
                            flex: 1,
                            dataIndex: 'remark',
                        },
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: store,
                    }
                }
            ],
        });
        win.show();

    },
    /**
     * 批量修改状态
     * @param nextStatus
     * @param grid
     * @param record
     * @param type
     */
    batchModifyWin: function (grid, selection) {
        var ids = selection.map(function (item) {
            return item.getId();
        });
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: '批量操作',
            layout: 'fit',
            items: [
                {
                    xtype: 'errorstrickform',
                    width: 450,
                    itemId: 'form',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center',
                    },
                    defaults: {
                        width: '100%',
                        margin: '5 25'
                    },
                    items: [
                        {
                            name: 'ids',
                            itemId: 'ids',
                            xtype: 'hiddenfield',
                            ids: ids,
                            diyGetValue: function () {
                                var me = this;
                                return me.ids;
                            }
                        },
                        {
                            name: 'status',
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('操作'),
                            itemId: 'status2',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            allowBlank: false,
                            store: {
                                xtype: 'store',
                                fields: [
                                    'value', 'display'
                                ],
                                data: [
                                    {
                                        value: 'Valid',
                                        display: '启用'
                                    },
                                    {
                                        value: 'Invalid',
                                        display: '废弃'
                                    }
                                ]
                            }
                        },
                        {
                            xtype: 'textarea',
                            name: 'remark',
                            itemId: 'remark',
                            minHeight: 100,
                            fieldLabel: i18n.getKey('remark')
                        },
                    ]
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var url = adminPath + 'api/qp/vatIds/batch/review';
                        var win = btn.ownerCt.ownerCt;
                        var form = win.getComponent('form');
                        if (form.isValid()) {
                            var data = form.getValue();
                            var jsonData = data;
                            JSAjaxRequest(url, 'PUT', true, jsonData, '修改成功', function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        grid.store.load();
                                        win.close();
                                    }
                                }
                            }, true);
                        }
                    }
                }
            }
        });
        win.show();
    },

})