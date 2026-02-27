/**
 * @author nan
 * @date 2026/1/26
 * @description TODO
 */
Ext.Loader.syncRequire([
    'CGP.partner.view.PartnerGridCombo'
])
Ext.onReady(function () {
    var controller = Ext.create(`CGP.partner_credit.controller.Controller`);
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: 'partner信贷管理(待审核)',
        block: 'partner_credit',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                disabled: true,
            },
            btnDelete: {
                disabled: true,
            },
            btnHelp: {
                disabled: false,
                handler: function (btn) {
                    controller.showConfigHelp();
                }
            }
        },
        gridCfg: {
            deleteAction: false,
            editAction: false,
            store: Ext.create("CGP.partner_credit.store.PartnerCreditStore"),
            hiddenButtons: ['delete', 'read', 'clear', 'sepQuery'],
            deleteActionHandler: function (gridview, rowIndex, colIndex, view, event, record, dom) {
                Ext.MessageBox.confirm('confirm', 'deleteConfirm', function (btn) {
                    if (btn == 'yes') {
                        var removeId = record.getId();
                        controller.deleteRecords(removeId, page.grid);
                    }
                })
            },
            columns: [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id'),
                    width: 120,
                },
                {
                    xtype: "componentcolumn",
                    text: '操作',
                    width: 100,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var status = record.get('status');
                        var partner = record.get('partner');
                        var id = record.get('_id');
                        return {
                            xtype: 'container',
                            flex: 1,
                            layout: {
                                type: 'hbox',
                                align: 'center',
                                pack: 'center'
                            },
                            defaults: {
                                flex: 1,
                                margin: '5 5 5 0'
                            },
                            items: [{
                                xtype: 'button',
                                text: '审核',
                                handler: function (btn) {
                                    JSOpen({
                                        id: 'partner_credit_edit',
                                        url: path + `partials/partner_credit/edit.html?partnerId=${partner.id}&id=${id}&action=audit&status=${status}`,
                                        title: i18n.getKey('审核') + '_' + `partner信贷配置(${id})`,
                                        refresh: true
                                    });
                                }
                            }]
                        };
                    }
                },
                {
                    text: '状态',
                    dataIndex: 'status',
                    renderer: function (value, metaData, record) {
                        // ['Pending', 'Valid', 'Invalid', 'Remove'],
                        var map = {
                            Pending: '<font color="red" style="font-weight: bold">待审核</font>',
                            Valid: '<font color="green" style="font-weight: bold">启用</font>',
                            Invalid: '<font color="red" style="font-weight: bold">禁用</font>',
                            Remove: '<font color="red" style="font-weight: bold">已删除</font>',
                        };
                        return map[value];
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: 'Partner',
                    dataIndex: 'partner',
                    itemId: 'partner',
                    width: 150,
                    sortable: false,
                    getDisplayName: function (value, metaData, record) {
                        var str = `<a href="#" style="color: blue;">${value.id}</a>`;
                        var items = [
                            {
                                title: i18n.getKey('id'),
                                value: str
                            },
                            {
                                title: '名称',
                                value: value.name
                            },
                            {
                                title: '邮箱',
                                value: value.email
                            },
                        ]
                        return JSCreateHTMLTable(items);
                    },
                    clickHandler: function (value, metaData, record) {
                        var partnerId = value.id
                        JSOpen({
                            id: 'partnerpage',
                            url: path + 'partials/partner/main.html' +
                                '?id=' + partnerId,
                            title: 'partner',
                            refresh: true
                        });
                    }
                },
                {
                    xtype: 'auto_bread_word_column',
                    text: '客户简称',
                    width: 120,
                    sortable: false,
                    dataIndex: 'customerAbbreviation',
                },
                {
                    xtype: 'auto_bread_word_column',
                    text: '客户英文名称',
                    dataIndex: 'customerEnName',
                    width: 120,
                    sortable: false,
                },
                {
                    text: '货币',
                    dataIndex: 'currencyCode',
                    width: 80,
                    sortable: false,
                },
                {
                    text: '应付款',
                    sortable: false,
                    dataIndex: 'receivableNum',
                },
                {
                    text: '风险信贷额',
                    dataIndex: 'riskCreditLimit',
                    width: 120,
                    sortable: false,
                },
                {
                    text: '管理信贷额',
                    dataIndex: 'creditLimit',
                    width: 120,
                    sortable: false,
                },
                {
                    text: '付款期(天)',
                    dataIndex: 'paymentTermDays',
                    width: 100,
                    sortable: false,
                },
                {
                    text: '宽限期(天)',
                    dataIndex: 'gracePeriodDays',
                    width: 100,
                    sortable: false,
                }, {
                    xtype: 'diy_date_column',
                    text: '创建日期',
                    dataIndex: 'configCreatedDate',
                    format: 'Y-m-d',
                },
                {
                    xtype: 'diy_date_column',
                    text: '审批日期',
                    dataIndex: 'auditDate',
                    minWidth: 100,
                    flex: 1,
                    format: 'Y-m-d',
                },
            ]
        },
        filterCfg: {
            items: [
                {
                    xtype: 'textfield',
                    name: 'customerAbbreviation',
                    isLike: false,
                    fieldLabel: '客户简称',
                    itemId: 'customerAbbreviation'
                },
                {
                    xtype: 'textfield',
                    name: 'customerEnName',
                    isLike: false,
                    fieldLabel: '客户英文名',
                    itemId: 'customerEnName'
                },
                {
                    xtype: 'combo',
                    name: 'status',
                    isLike: false,
                    fieldLabel: 'status',
                    itemId: 'status',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    hidden: true,
                    value: 'Pending',
                    // ['Pending', 'Valid', 'Invalid', 'Remove'],
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'Pending',
                                display: '待审核'
                            },
                            {
                                value: 'Valid',
                                display: '启用'
                            },
                            {
                                value: 'Invalid',
                                display: '禁用'
                            }
                        ]
                    }
                },
                {
                    xtype: 'partner_grid_combo',
                    itemId: 'partner.id',
                    name: 'partner.id',
                    fieldLabel: 'Partner',
                    gridCfg: {
                        selType: 'rowmodel',
                    }
                }
            ]
        }
    });
});
