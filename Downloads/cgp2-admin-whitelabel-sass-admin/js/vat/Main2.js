/**
 * @Description:qp VAT
 * @author nan
 * @date 2023/8/2
 */
Ext.Loader.syncRequire([
    'CGP.vat.view.CountryGridCombo'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('QP税资质'),
        block: 'vat',
        editPage: 'edit.html',
        //权限控制
        accessControl: false,
        tbarCfg: {
            btnImport: {
                disabled: false,
                text: '批量操作',
                width: 100,
                iconCls: 'icon_batch',
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt;
                    var selection = grid.getSelectionModel().getSelection();
                    if (selection.length == 0) {
                        Ext.Msg.alert(i18n.getKey('prompt'), '请先选择至少一条数据');
                    } else {
                        var controller = Ext.create('CGP.vat.controller.Controller');
                        controller.batchModifyWin(grid, selection);
                    }
                }
            }
        },
        gridCfg: {
            store: Ext.create('CGP.vat.store.QPVatStore'),
            frame: false,
            columnDefaults: {
                width: 200,
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    width: 100,
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    width: 100,
                    renderer: function (value, metaData, record) {
                        var result = '';
                        if (value == 'Pending') {//未审核
                            result = JSCreateFont('orange', true, '未审核');

                        } else if (value == 'Valid') {//已通过
                            result = JSCreateFont('green', true, '生效');

                        } else if (value == 'Invalid') {//未通过
                            result = JSCreateFont('red', true, '无效');
                        }
                        return result;
                    }
                },
                {
                    text: i18n.getKey('operation'),
                    dataIndex: 'operation',
                    xtype: 'componentcolumn',
                    width: 150,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var status = record.get('status');
                        var grid = view.ownerCt;
                        return {
                            xtype: 'container',
                            layout: 'hbox',
                            width: '100%',
                            defaults: {
                                flex: 1,
                            },

                            items: [
                                {
                                    xtype: 'button',
                                    text: status == 'Valid' ? '作废' : '启用',
                                    margin: '0 25 0 5',
                                    cls: 'a-btn',
                                    border: false,
                                    handler: function (btn) {
                                        var controller = Ext.create('CGP.vat.controller.Controller');
                                        controller.showModifyWin(status == 'Valid' ? 'Invalid' : 'Valid', grid, record, 'QPVAT', (status == 'Valid' ? '作废' : '启用'));
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: '历史',
                                    margin: '0 5 0 0',
                                    cls: 'a-btn',
                                    border: false,
                                    handler: function (btn) {
                                        var controller = Ext.create('CGP.vat.controller.Controller');
                                        controller.showOperationHistory(record);
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('VAT ID'),
                    dataIndex: 'vatId',
                    getDisplayName: function (value, metaData, record) {
                        return value /*+ ' <a href="#">查看</a>';*/
                    },
                    clickHandler: function (value, metaData, record) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('开发中...'));
                    },
                },
                {
                    text: i18n.getKey('countryName'),
                    dataIndex: 'countryName',
                    renderer: function (value, mateData, record) {
                        return value + ' : ' + record.get('countryCode');
                    }
                },
                {
                    text: i18n.getKey('remark'),
                    dataIndex: 'remark',
                    flex: 1,
                }
            ]
        },
        filterCfg: {
            items: [
                {
                    name: '_id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    xtype: 'country_gridcombo',
                    name: 'countryCode',
                    itemId: 'countryCode',
                    fieldLabel: i18n.getKey('国家/地区'),
                    valueType: 'id',
                },
                {
                    name: 'status',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status2',
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    store: {
                        xtype: 'store',
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'Valid',
                                display: '生效'
                            },
                            {
                                value: 'Invalid',
                                display: '无效'
                            }
                        ]
                    }
                },
            ]
        }
    });
});