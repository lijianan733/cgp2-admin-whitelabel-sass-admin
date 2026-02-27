Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.organizations.store.OrganizationStore')
    var currencyStore = Ext.create('CGP.currency.store.Currency');
    var websiteStore = Ext.create("CGP.currency.store.WebsiteAll");

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('organization'),
        block: 'organizations',
        editPage: 'edit.html',
        // 搜索框
        filterCfg: {
            defaults: {
                isLike: false,
            },
            items: [
                {
                    name: '_id',
                    itemId: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    maskRe: /[0-9]/,
                },
                {
                    name: 'name',
                    itemId: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                },
                {
                    name: 'code',
                    itemId: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                },
                {
                    name: 'currency.code',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('currency'),
                    editable: false,
                    //表格部分
                    haveReset: true,
                    autoScroll: true,
                    multiSelect: false, //复选择器
                    valueField: 'code',
                    displayField: 'displayName',
                    labelAlign: 'right',
                    store: currencyStore,
                    queryMode: 'remote',
                    pickerAlign: 'bl',
                    matchFieldWidth: false,
                    filterCfg: {
                        minHeight: 90,
                        defaults: {
                            isLike: false,
                            width: 250,
                            labelWidth: 60,
                        },
                        items: [
                            {
                                name: '_id',
                                itemId: '_id',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('id'),
                                maskRe: /[0-9]/,
                            },
                            {
                                name: 'code',
                                itemId: 'code',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('code'),
                            },
                            {
                                name: 'title',
                                itemId: 'title',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('title'),
                            },
                            {
                                name: 'symbolLeft',
                                itemId: 'symbolLeft',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('symbolLeft'),
                            },
                            {
                                value: 'WhiteLabel',
                                // displayField要与name保持一致 filter才有作用
                                name: 'website.name',
                                xtype: 'websitecombo',
                                itemId: 'websiteCombo',
                                displayField: 'name',
                                valueField: 'name',
                                hidden: true,
                                store: websiteStore,
                            },
                        ],
                    },

                    gridCfg: {
                        store: currencyStore,
                        height: 400,
                        width: 850,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 90,
                                dataIndex: 'id',
                            },
                            {
                                text: i18n.getKey('title'),
                                width: 120,
                                dataIndex: 'title',
                            },
                            {
                                text: i18n.getKey('code'),
                                flex: 1,
                                dataIndex: 'code',
                            },
                            {
                                text: i18n.getKey('exchangeRate'),
                                flex: 1,
                                dataIndex: 'value',
                            },
                            {
                                text: i18n.getKey('symbolLeft'),
                                flex: 1,
                                dataIndex: 'symbolLeft',
                            },
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: currencyStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData'),
                        },
                    },
                },
            ],
        },
        // 表格框
        gridCfg: {
            store: store,
            columns: [
                {
                    text: i18n.getKey('id'),
                    itemId: 'id',
                    dataIndex: '_id',
                },
                {
                    text: i18n.getKey('name'),
                    itemId: 'name',
                    dataIndex: 'name',
                },
                {
                    text: i18n.getKey('code'),
                    itemId: 'code',
                    dataIndex: 'code',
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('currency'),
                    itemId: 'currency',
                    minWidth: 200,
                    dataIndex: 'currency',
                    getDisplayName: function (value) {
                        var name = value.code + '<<a href="#" style="text-decoration: none">' + value.id + '</a>>'
                        return name
                    },
                    clickHandler: function (value, metadata, record) {
                        JSOpen({
                            id: value.id,
                            url: path + 'partials/currency/currency.html?id=' + value.id,
                            title: i18n.getKey('currency'),
                            refresh: true,
                        });
                    },
                    sortable: false,

                },
                {
                    xtype: 'atagcolumn',
                    dataIndex: 'countries',
                    text: i18n.getKey('country'),
                    minWidth: 80,
                    flex: 1,
                    getDisplayName: function (value) {
                        return '<a href="#" style="text-decoration: none">' + i18n.getKey('check') + '</a>'
                    },
                    clickHandler: function (value, metadata, record) {
                        var configStore = Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'id',
                                    type: 'id',
                                },
                                {
                                    name: 'name',
                                    type: 'name',
                                },
                            ],
                            proxy: {
                                type: 'pagingmemory',
                            },
                            data: value,
                            pageSize: 25,
                        });
                        var win = Ext.create('Ext.ux.window.Window', {
                            title: Ext.String.format('查看{0}', i18n.getKey('country')),
                            modal: true,
                            constrain: true,
                            width: 500,
                            height: 500,
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'grid',
                                    store: configStore,
                                    columns: [
                                        {
                                            dataIndex: 'id',
                                            width: 100,
                                            text: i18n.getKey('id'),
                                        },
                                        {
                                            dataIndex: 'name',
                                            flex: 1,
                                            text: i18n.getKey('name'),
                                        },
                                    ],
                                    bbar: {
                                        xtype: 'pagingtoolbar',
                                        store: configStore,
                                        pageSize: 25,
                                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                        emptyMsg: i18n.getKey('noData'),
                                    }
                                }
                            ]
                        });
                        win.show();
                    }
                }
            ]
        }
    })
})