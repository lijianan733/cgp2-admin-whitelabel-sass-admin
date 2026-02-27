Ext.Loader.syncRequire([
    'CGP.cmscontext.store.cmsContextStore'
]);
Ext.onReady(function () {
    var cmsContextStore = Ext.create('CGP.cmscontext.store.cmsContextStore');
    Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('CMSContext'),
        block: 'cmscontext',
        editPage: 'edit.html',
        filterCfg: {
            defaults: {
                isLike: false
            },
            layout: {
                type: 'table',
                columns: 2,
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id',
                    name: '_id'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    name: 'name'
                }
            ]
        },
        gridCfg: {
            store: cmsContextStore,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id'
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    flex: 1
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('variables'),
                    dataIndex: 'variables',
                    flex: 2,
                    getDisplayName: function (value) {
                        return '<a href="#" style="text-decoration: none">' + i18n.getKey('check') + '</a>'
                    },
                    clickHandler: function (value, metadata, record) {
                        var configStore = Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'key',
                                    type: 'string'
                                },

                                {
                                    name: 'valueType',
                                    type: 'string'
                                },
                                {
                                    name: 'value',
                                    type: 'string'
                                },
                                {
                                    name: 'builderInFunction',
                                    type: 'object'
                                }
                            ],
                            proxy: {
                                type: 'pagingmemory'
                            },
                            data: value,
                            pageSize: 25
                        });
                        var win = Ext.create('Ext.ux.window.Window', {
                            title: Ext.String.format('查看{0}', i18n.getKey('variables')),
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
                                            dataIndex: 'key',
                                            width: 100,
                                            text: i18n.getKey('key')
                                        },
                                        {
                                            dataIndex: 'valueType',
                                            flex: 1,
                                            text: i18n.getKey('valueType')
                                        },
                                        {
                                            text: i18n.getKey('value'),
                                            flex: 2,
                                            renderer: function (value, metaData, record) {
                                                var data = record.getData();
                                                var displayInfo = [];
                                                if (data.value) {
                                                    displayInfo = [
                                                        {
                                                            title: 'value',
                                                            value: data.value
                                                        }
                                                    ];
                                                } else if (data.builderInFunction.name) {
                                                    displayInfo = [
                                                        {
                                                            title: 'builderInFunction',
                                                            value: data.builderInFunction.name
                                                        }
                                                    ];
                                                }
                                                return JSAutoWordWrapStr(JSCreateHTMLTable(displayInfo));
                                            }
                                        }
                                    ],
                                    bbar: {
                                        xtype: 'pagingtoolbar',
                                        store: configStore,
                                        pageSize: 25,
                                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                        emptyMsg: i18n.getKey('noData')
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