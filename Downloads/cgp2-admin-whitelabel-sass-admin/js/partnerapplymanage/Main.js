/**
 * Created by nan on 2018/1/30.
 * 合作伙伴申请管理，用于审核申请，只有通过，和不通过，待审核三个状态
 */
Ext.syncRequire([
    'CGP.partnerapplymanage.store.PartnerApplyInfoStore',
    'Ext.ux.grid.column.UxArrayColumn',
    'CGP.common.field.WebsiteCombo'
]);
Ext.onReady(function () {
    var status = {
        'waiting_verify': 'blue',
        'agree': 'green',
        'refuse': 'red'
    };
    var websiteStore = Ext.create("CGP.partnerapplys.store.WebsiteAll");
    var store = Ext.create("CGP.partnerapplymanage.store.PartnerApplyInfoStore");
    var controller = Ext.create('CGP.partnerapplymanage.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        gridCfg: {
            deleteAction: false,
            editAction: false,
            selType: 'rowmodel',
            multiSelect: false,
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    width: 70
                },
                {
                    text: i18n.getKey('audit'),
                    dataIndex: 'audit',
                    width: 144,
                    draggable: false,//不予许拖动
                    columns: [
                        {
                            id: 'agree',
                            dataIndex: 'agree',
                            xtype: 'componentcolumn',
                            text: i18n.getKey('agree'),
                            menuDisabled: true,
                            sortable: false,
                            draggable: false,
                            renderer: function (value, metaData, record, rowIndex) {
                                if (record.get("status") == 'waiting_verify') {
                                    return Ext.create('Ext.toolbar.Toolbar', {
                                        layout: 'fit',
                                        width: 80,
                                        padding: '0 0 0 0',
                                        margin: '0 0 0 0 ',
                                        border: '0 0 0 0 ',
                                        items: {
                                            text: i18n.getKey('agree'),
                                            xtype: 'button',
                                            itemId: 'audit',
                                            margin: '0 0 0 0 ',
                                            width: 80,
                                            handler: function () {
                                                Ext.create('CGP.partnerapplymanage.view.ConfirmWindow', {
                                                    recordId: Number.parseInt(record.get("_id")),
                                                    partnerStore: store,
                                                    website: (websiteStore.findRecord('id', record.get('websiteId'))).get('name'),
                                                    applicant: record.get("partnerApplyInfo").name
                                                }).show();
                                            }
                                        }
                                    });
                                } else {
                                    return null
                                }
                            }
                        },
                        {
                            text: i18n.getKey('REJECTED'),
                            dataIndex: 'REJECTED',
                            xtype: 'componentcolumn',
                            sortable: false,
                            draggable: false,
                            menuDisabled: true,
                            renderer: function (value, metaData, record, rowIndex) {
                                if (record.get("status") == 'waiting_verify') {
                                    return Ext.create('Ext.toolbar.Toolbar', {
                                        width: 60,
                                        layout: 'fit',
                                        padding: '0 0 0 0',
                                        margin: '0 0 0 0 ',
                                        border: '0 0 0 0 ',
                                        items: {
                                            text: i18n.getKey('REJECTED'),
                                            xtype: 'button',
                                            width: 60,
                                            margin: '0 0 0 0 ',
                                            itemId: 'audit',
                                            handler: function () {
                                                Ext.create('CGP.partnerapplymanage.view.RefuseWindow', {
                                                    recordId: Number.parseInt(record.get("_id")),
                                                    partnerStore: store,
                                                    website: (websiteStore.findRecord('id', record.get('websiteId'))).get('name'),
                                                    applicant: record.get("partnerApplyInfo").name
                                                }).show();
                                            }
                                        }
                                    });
                                } else {
                                    return null
                                }
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('applicant'),
                    dataIndex: 'partnerApplyInfo',
                    xtype: 'componentcolumn',
                    width: 150,
                    renderer: function (value) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-materialViewType" style="text-decoration: none">' + value.name + '</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-materialViewType');
                                    clickElement.addEventListener('click', function () {
                                        controller.showApplicantInfo(value, websiteStore);
                                    }, false);

                                }
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('status'),           //状态
                    dataIndex: 'status',
                    renderer: function (value, metadata) {
                        metadata.style = 'color:' + status[value];
                        if (value == 'agree') {
                            return i18n.getKey('agreed');
                        }
                        if (value == 'refuse') {
                            return i18n.getKey('rejected');
                        }
                        if (value == 'waiting_verify') {
                            return i18n.getKey('waitaudit');
                        }
                    }
                }, {
                    text: i18n.getKey('cooperationBusinessRole'),//合作的业务类型
                    dataIndex: 'cooperationBusinesses',
                    xtype: 'uxarraycolumn',
                    valueField: 'businessName',
                    maxLineCount: 2,//数据量大于该配置值时，使用自定义的展示方式
                    lineNumber: 1,//一行多少数据
                    showContext: function (id, title) {//自定义展示多数据时的方式
                        var store = window.store;
                        var record = store.findRecord('_id', id);
                        var data = [];
                        for (var i = 0; i < record.get('cooperationBusinesses').length; i++) {
                            var item = [];
                            item.push(record.get('cooperationBusinesses')[i].businessName);
                            data.push(item);
                        }
                        var win = Ext.create('Ext.window.Window', {
                            title: i18n.getKey('check') + i18n.getKey('cooperationBusinessRole'),
                            height: 250,
                            width: 250,
                            layout: 'fit',
                            items: {
                                xtype: 'grid',
                                border: false,
                                autoScroll: true,
                                columns: [
                                    {
                                        width: 50,
                                        sortable: false,
                                        xtype: 'rownumberer'
                                    },
                                    {
                                        width: 150,
                                        text: i18n.getKey('cooperationBusinessRole'),
                                        dataIndex: 'type',
                                        sortable: false,
                                        menuDisabled: true
                                    }

                                ],
                                store: Ext.create('Ext.data.ArrayStore', {
                                    fields: [
                                        {name: 'type', type: 'string'}
                                    ],
                                    data: data
                                })
                            }
                        }).show();
                    },
                    width: 120,
                    sortable: false
                },
                {
                    text: i18n.getKey('website'),       //"网站名称"
                    dataIndex: 'websiteId',
                    width: 150,
                    renderer: function (value, view, record) {
                        var record = websiteStore.findRecord('id', value);
                        if (record) {
                            return record.get('name');
                        }
                    }
                },
                {
                    text: i18n.getKey('refundApplyDate'),//申请日期
                    dataIndex: 'createDate',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        metadata.style = "color: gray";
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                },
                {
                    text: i18n.getKey('审核人'),    //"修改人"
                    dataIndex: 'email',
                    width: 150
                },
                {
                    text: i18n.getKey('remark'),       //"网站名称"
                    dataIndex: 'remark',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('modifiedDate'),    //"修改日期"
                    dataIndex: 'updateDate',
                    width: 150,
                    renderer: function (value, metadata, record) {
                        metadata.style = "color: gray";
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                }
            ]
        },
        tbarCfg: {
            hidden: true,
            hiddenButtons: ['create', 'config', 'delete', 'export', 'import', 'help']
        },
        //过滤查询配置项
        filterCfg: {
            items: [
                {
                    //id: 'idSearchField',      //通过id查询
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    id: 'refundApplyDate',
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'createDate',
                    xtype: 'datefield',
                    itemId: 'refundApplyDate',
                    fieldLabel: i18n.getKey("refundApplyDate"),
                    format: 'Y/m/d',
                    scope: true
                },
                {
                    id: 'modifiedDate',
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'updateDate',
                    xtype: 'datefield',
                    itemId: 'modifiedDate',
                    fieldLabel: i18n.getKey("modifiedDate"),
                    format: 'Y/m/d',
                    scope: true
                },
                {
                    id: 'statusSearchField',      //状态查询
                    name: 'status',
                    xtype: "combo",
                    editable: false,
                    haveReset: true,
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    displayField: 'name',
                    valueField: 'value',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: "value", type: 'stirng'},
                            {name: 'name', type: 'string'}
                        ],
                        data: [
                            {
                                value: 'waiting_verify', name: i18n.getKey('waitaudit')
                            },
                            {
                                value: 'agree', name: i18n.getKey('agreed')
                            },
                            {
                                value: 'refuse', name: i18n.getKey('rejected')
                            }
                        ]
                    }),
                    triggerAction: 'all'
                },
                {
                    name: 'partnerApplyInfo.name',
                    xtype: 'textfield',
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('applicant'),
                    itemId: 'applicant'
                },
                {
                    name: 'email',
                    xtype: 'textfield',
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('modifiedBy'),
                    itemId: 'modifiedBy',
                    isLike: false
                },
                {
                    id: 'websiteSearchField',
                    name: 'websiteId',
                    xtype: 'websitecombo',
                    itemId: 'websiteCombo',
                    value: 11,
                    hidden: true,
                }
            ]
        }
    });

});