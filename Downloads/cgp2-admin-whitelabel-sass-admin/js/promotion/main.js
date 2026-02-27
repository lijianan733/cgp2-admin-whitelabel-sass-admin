/**
 * @Description:
 * @author nan
 * @date 2023/7/5
 */
Ext.Loader.syncRequire([
    'CGP.promotion.view.DateRangeV2'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('优惠活动'),
        block: 'promotion',
        editPage: 'edit.html',
        tbarCfg: {
            btnConfig: {
                xtype: 'button',
                text: '批量修改状态和生效环境',
                hidden: false,
                disabled: false,
                width: 180,
                iconCls: 'icon_batch',
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt;
                    var selection = grid.getSelectionModel().getSelection();
                    if (selection.length > 0) {
                        var ids = selection.map(function (item) {
                            return item.getId()
                        });
                        var win = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            title: '批量修改状态和生效环境',
                            items: [{
                                xtype: 'errorstrickform',
                                itemId: 'form',
                                defaults: {
                                    valueField: 'value',
                                    displayField: 'display',
                                    editable: false,
                                    haveReset: true,
                                    margin: '5 25'
                                },
                                items: [
                                    {
                                        xtype: 'combo',
                                        name: 'status',
                                        fieldLabel: i18n.getKey('状态'),
                                        itemId: 'status',
                                        store: {
                                            xtype: 'store',
                                            fields: ['value', 'display'],
                                            data: [{
                                                value: 'invalid',
                                                display: i18n.getKey('作废')
                                            }, {
                                                value: 'effective',
                                                display: i18n.getKey('启用')
                                            }]
                                        }
                                    },
                                    {
                                        xtype: 'combo',
                                        fieldLabel: i18n.getKey('生效环境'),
                                        itemId: 'mode',
                                        name: 'mode',
                                        store: {
                                            xtype: 'store',
                                            fields: ['value', 'display'],
                                            data: [{
                                                value: 'Stage',
                                                display: i18n.getKey('Stage')
                                            }, {
                                                value: 'Production',
                                                display: i18n.getKey('Release')
                                            }]
                                        }
                                    },
                                ]
                            }],
                            bbar: {
                                xtype: 'bottomtoolbar',
                                saveBtnCfg: {
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var form = win.getComponent('form');
                                        var data = form.getValue();
                                        if (!Ext.isEmpty(data)) {
                                            JSSetLoading(true);
                                            var isValid = false;
                                            if (data.mode) {
                                                var url = adminPath + `api/promotion/mode/${data.mode}?ids=${ids.toString()}`;
                                                JSAjaxRequest(url, 'PUT', false, false, false, function (require, success, response) {
                                                    if (success) {
                                                        var responseText = Ext.JSON.decode(response.responseText);
                                                        if (responseText.success) {
                                                            isValid = true;
                                                        }
                                                    }
                                                });
                                            }
                                            if (data.status) {
                                                var url = adminPath + `api/promotion/status/${data.status}?ids=${ids.toString()}`;
                                                JSAjaxRequest(url, 'PUT', false, false, false, function (require, success, response) {
                                                    if (success) {
                                                        var responseText = Ext.JSON.decode(response.responseText);
                                                        if (responseText.success) {
                                                            isValid = true;
                                                        }
                                                    }
                                                });
                                            }
                                            if (isValid) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('修改成功'));
                                                win.close();
                                                grid.store.load();
                                            }
                                            JSSetLoading(false);
                                        }
                                    }
                                }
                            }
                        });
                        win.show();
                    } else {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请选择需修改的记录'));
                    }
                }
            },
        },
        gridCfg: {
            store: Ext.create('CGP.promotion.store.Promotion'),
            columnDefaults: {
                width: 150
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                },
                {
                    text: i18n.getKey('displayName'),
                    dataIndex: 'displayName',
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                },
                {
                    text: i18n.getKey('生效时间范围'),
                    dataIndex: 'effectiveTime',
                    width: 350,
                    renderer: function (value, metaData, record) {
                        metaData.style = "color: gray";
                        if (value) {
                            var startDate = '无开始时间限制';
                            var endDate = '无结束时间限制';
                            if (value.startDate) {
                                startDate = Ext.Date.format(new Date(value.startDate), 'Y/m/d H:i:s');
                            }
                            if (value.endDate) {
                                endDate = Ext.Date.format(new Date(value.endDate), 'Y/m/d H:i:s');
                            }
                            var string = `${startDate} ~ ${endDate}`;
                            metaData.tdAttr = 'data-qtip="' + string + '"';
                            return string
                        } else {
                            return '无时间限制';
                        }
                    }
                },
                {
                    text: i18n.getKey('支持的订单类型'),
                    dataIndex: 'effectiveOrders',

                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    renderer: function (value, metaData, record) {
                        if (value == 'effective') {
                            return '<font color="green">启用</font>';
                        } else if (value == 'invalid') {
                            return '<font color="red">作废</font>';
                        } else if (value == 'draft') {
                            return '<font color="orange">草稿</font>';
                        }
                    }
                },
                {
                    text: i18n.getKey('生效环境'),
                    dataIndex: 'mode',
                    flex: 1,
                    minWidth: 100,
                    renderer: function (value, metaData, record) {
                        if (value == 'Production') {
                            return '<font color="green">Release</font>';
                        } else if (value == 'Stage') {
                            return '<font color="red">Stage</font>';
                        }
                    }
                },
            ]
        },
        filterCfg: {
            items: [
                {
                    name: '_id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                },
                {
                    name: 'displayName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('displayName'),
                    itemId: 'displayName'
                },
                {
                    xtype: 'combo',
                    name: 'status',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    haveReset: true,
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'invalid',
                                display: i18n.getKey('草稿')
                            }, {
                                value: 'invalid',
                                display: i18n.getKey('作废')
                            }, {
                                value: 'effective',
                                display: i18n.getKey('启用')
                            }]
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('生效环境'),
                    itemId: 'mode',
                    name: 'mode',
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    haveReset: true,
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'Stage',
                                display: i18n.getKey('Stage')
                            }, {
                                value: 'Production',
                                display: i18n.getKey('Release')
                            }]
                    }
                },
                {
                    name: 'effectiveOrders',
                    xtype: 'multicombobox',
                    isArray: true,
                    fieldLabel: i18n.getKey('支持的订单类型'),
                    itemId: 'effectiveOrders',
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    haveReset: true,
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [{
                            value: 'Sample',
                            display: 'Sample'
                        }, {
                            value: 'BulkOrder',
                            display: 'BulkOrder'
                        }]
                    }
                },
                {
                    xtype: 'daterangev2',
                    name: 'effectiveTime',
                    itemId: 'effectiveTime',
                    editable: false,
                    defaults: {
                        editable: false,
                    },
                    fieldLabel: i18n.getKey('生效时间范围'),
                    width: 360,
                    format: 'Y/m/d H:i:s',
                },
            ]
        }
    })
})
