Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': path + 'ClientLibs/extjs/ux'
    }
});
Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function () {
    var PartnerStore = Ext.create('CGP.partner.store.PartnerStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('partner'),
        block: 'partner',
        editPage: 'edit.html',
        gridCfg: {
            store: PartnerStore,
            frame: false,
            editDisabled: true,
            viewConfig: {
                enableTextSelection: true
            },
            columnDefaults: {
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('audit'),
                    dataIndex: 'id',
                    sortable: false,
                    width: 80,
                    getDisplayName: function (audit) {
                        return '<a href="#" style="text-decoration: none">' + i18n.getKey('audit') + '</a>'
                    },
                    clickHandler: function (value, metadata, record) {
                        var url = adminPath + 'api/partners/' + value + '/check';
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('is') + i18n.getKey('audit') + i18n.getKey('approve'), function (selector) {
                            if (selector == 'yes') {
                                JSAjaxRequest(url, 'PUT', true, null, false, function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        if (responseText.success) {
                                            Ext.Msg.alert(i18n.getKey('audit') + i18n.getKey('result'), '审核已通过', function () {
                                                PartnerStore.load();
                                            })
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('audit') + i18n.getKey('result'), '审核未通过', function () {
                                                PartnerStore.load();
                                            })
                                        }
                                    }
                                }, false)
                            }
                        })
                    }
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 80
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    sortable: false,
                    width: 200
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 200,
                    sortable: false
                }, {
                    text: i18n.getKey('partner') + i18n.getKey('type'),
                    sortable: false,
                    dataIndex: 'partnerType',
                    renderer: function (value) {
                        var map = {
                            'INTERNAL': i18n.getKey('inner'),
                            'EXTERNAL': i18n.getKey('outside')
                        }
                        return map[value];
                    }
                }, {
                    text: i18n.getKey('checkout') + i18n.getKey('type'),
                    sortable: false,
                    dataIndex: 'settlementType',
                    width: 200,
                    renderer: function (value) {
                        return i18n.getKey(value);
                    }
                },
                {
                    text: i18n.getKey('contactor'),
                    sortable: false,
                    dataIndex: 'contactor'
                },
                {
                    text: i18n.getKey('telephone'),
                    sortable: false,
                    width: 120,
                    dataIndex: 'telephone'
                },
                {
                    text: i18n.getKey('email'),
                    dataIndex: 'email',
                    width: 120,
                    sortable: false,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('audit') + i18n.getKey('status'),
                    dataIndex: 'partnerStatus',
                    sortable: false,
                    width: 120,
                    hidden: true,
                    renderer: function (value, metadata, record) {
                        var newValue = null;
                        if (value == 'APPROVED') {
                            newValue = '已审核';
                        } else if (value == 'LOGOFF') {
                            newValue = '已注销';
                        }
                        return newValue;
                    }
                },
                /*,
                {
                    text: i18n.getKey('cooperationBusinessRole'),
                    dataIndex: 'cooperationBusinesses',
                    xtype: 'uxarraycolumn',
                    valueField: 'businessName',//如果数组中的集合是对象，指定要处理的键名
                    maxLineCount: 2,//数据量大于该配置值时，使用自定义的展示方式
                    lineNumber: 1,//一行多少数据
                    showContext: function (id, title) {//自定义展示多数据时的方式
                        var store = window.store;
                        var record = store.findRecord('id', id);
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
                }*/
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    allowDecimals: false,
                    hideTrigger: true,
                    itemId: 'id'
                },
                {
                    name: 'code',
                    xtype: 'textfield',
                    itemId: 'code',
                    fieldLabel: i18n.getKey('code')
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    itemId: 'name',
                    fieldLabel: i18n.getKey('name')
                },
                {
                    name: 'cooperationType',
                    xtype: 'combo',
                    itemId: 'cooperationType',
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: i18n.getKey('nest'), value: 'nest'
                            },
                            {
                                type: i18n.getKey('api'), value: 'api'
                            }
                        ]
                    }),
                    fieldLabel: i18n.getKey('cooperationType'),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'
                },
                {
                    name: 'contactor',
                    itemId: 'contactor',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('contactor')
                },
                {
                    name: 'businessName',
                    itemId: 'businessName',
                    xtype: 'combo',
                    haveReset: true,
                    isLike: false,
                    fieldLabel: i18n.getKey('cooperationBusinessRole'),
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'value', type: 'string'}
                        ],
                        data: [
                            {
                                name: i18n.getKey('ecommerce'),
                                value: 'seller'
                            },
                            {
                                name: i18n.getKey('supplier'),
                                value: 'producer'
                            },
                            {
                                name: i18n.getKey('undistributed'),
                                value: 'none'
                            }
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    editable: false
                },
                {
                    name: 'partnerStatus',
                    xtype: 'combo',
                    itemId: 'partnerStatus',
                    fieldLabel: i18n.getKey('audit') + i18n.getKey('status'),
                    displayField: 'value',
                    valueField: 'key',
                    editable: false,
                    hidden: true,
                    haveReset: true,
                    value: 'REGISTRATION',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'key'],
                        data: [
                            {
                                value: '已审核', key: 'APPROVED'
                            },
                            {
                                value: '已注册', key: 'REGISTRATION'
                            },
                            {
                                value: '已注销', key: 'LOGOFF'
                            }
                        ]
                    }),
                }
            ]
        },
        tbarCfg: {
            hidden: true
        },
        listeners: {
            afterrender: function (panel) {
                var grid = panel.grid;
                var toolbar = grid.getDockedItems('toolbar[dock="top"]')[0];
                toolbar.add({
                    xtype: 'button',
                    width: 90,
                    iconCls: 'icon_refresh',
                    text: i18n.getKey('syncpartner'),
                    handler: function () {
                        var selections = grid.getSelectionModel().getSelection();
                        if (selections.length == 0) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('未选择partner'));
                            return;
                        }
                        if (selections.length > 0) {
                            var partnerList = [];
                            Ext.each(selections, function (partner) {
                                partnerList.push(partner.data);
                            })
                            Ext.create('CGP.partner.view.syncpartner.InputFormWin', {
                                partnerList: partnerList,
                                page: page
                            })
                        }
                    }
                });
            }
        }
    })
})
