Ext.onReady(function () {
    var rtTypeStore = Ext.create('CGP.material.store.RtType');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('virtualContainerType'),
        block: 'virtualcontainertype',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                xtype: 'splitbutton',
                width: 100,
                text: i18n.getKey('add'),
                menu: [
                    {
                        text: i18n.getKey('循环') + i18n.getKey('template'),
                        handler: function (btn) {
                            JSOpen({
                                url: path + 'partials/virtualcontainertype/edit.html?model=repeat',
                                id: 'virtualcontainertype_edit',
                                refresh: true,
                                title: i18n.getKey('create') + '_' + i18n.getKey('virtualContainerType')
                            });
                        }
                    },
                    {
                        text: i18n.getKey('custom') + i18n.getKey('template'),
                        handler: function (btn) {
                            JSOpen({
                                url: path + 'partials/virtualcontainertype/edit.html?model=custom',
                                id: 'virtualcontainertype_edit',
                                refresh: true,
                                title: i18n.getKey('create') + '_' + i18n.getKey('virtualContainerType')
                            });
                        }
                    },
                ]
            },
        },
        gridCfg: {
            store: Ext.create('CGP.virtualcontainertype.store.VirtualContainerTypeStore'),
            frame: false,
            columns: [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id')
                },
                {
                    dataIndex: 'description',
                    width: 250,
                    text: i18n.getKey('description')
                },
                {
                    dataIndex: 'template',
                    text: i18n.getKey('templateElement'),
                    xtype: 'componentcolumn',
                    width: 250,
                    renderer: function (value, mateData, record) {
                        if (value) {
                            var str = JSCreateHTMLTable([
                                {
                                    title: 'description',
                                    value: value._id
                                },
                                {
                                    title: 'name',
                                    value: value.name
                                },
                                {
                                    title: 'description',
                                    value: value.description
                                }
                            ]);
                            return {
                                xtype: 'displayfield',
                                value: str,
                            }
                        }
                    }
                },
                {
                    dataIndex: 'argumentType',
                    text: i18n.getKey('argumentType'),
                    xtype: 'componentcolumn',
                    width: 200,
                    renderer: function (value, metaData, record, rowIndex) {
                        return {
                            xtype: 'displayfield',
                            value: "<a href='#'>" + value._id + "</font>",
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        JSOpen({
                                            id: 'rttypespage',
                                            url: path + 'partials/rttypes/rttype.html?rtType=' + value._id,
                                            title: i18n.getKey('RtType'),
                                            refresh: true
                                        });
                                    });
                                }
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('type'),
                    renderer: function (value, metadata, record) {
                        if (record.get('template')) {
                            return i18n.getKey('自定义') + i18n.getKey('template');
                        } else {
                            return i18n.getKey('循环') + i18n.getKey('template');
                        }
                    }
                },
                {
                    dataIndex: 'virtualContainerContents',
                    text: i18n.getKey('子组件占位符'),
                    xtype: 'componentcolumn',
                    minWidth: 200,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        if (!Ext.isEmpty(value) && record.get('template')) {
                            metadata.tdAttr = 'data-qtip="查看"';
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>查看</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            var win = Ext.create('Ext.window.Window', {
                                                modal: true,
                                                constrain: true,
                                                layout: 'fit',
                                                width: 700,
                                                height: 350,
                                                title: i18n.getKey('子组件占位符'),
                                                items: [
                                                    {
                                                        xtype: 'grid',
                                                        store: {
                                                            xtype: 'store',
                                                            fields: [
                                                                'selector',
                                                                'name',
                                                                'replace',
                                                                'required',
                                                                'clazz'
                                                            ],
                                                            data: value
                                                        },
                                                        columns: [
                                                            {
                                                                dataIndex: 'selector',
                                                                width: 250,
                                                                text: i18n.getKey('selector'),
                                                                renderer: function (value, mateData, record) {
                                                                    return value;
                                                                }
                                                            },
                                                            {
                                                                dataIndex: 'name',
                                                                width: 250,
                                                                text: i18n.getKey('name'),
                                                            },
                                                            {
                                                                dataIndex: 'replace',
                                                                flex: 1,
                                                                text: i18n.getKey('replace'),
                                                            },
                                                            {
                                                                dataIndex: 'required',
                                                                flex: 1,
                                                                text: i18n.getKey('required'),
                                                            },
                                                        ],
                                                    }
                                                ]
                                            });
                                            win.show();

                                        });
                                    }
                                }
                            };
                        } else {
                            if (value && value.length > 0) {
                                return JSCreateHTMLTable([
                                    {
                                        title: i18n.getKey('name'),
                                        value: value[0].name
                                    },
                                    {
                                        title: i18n.getKey('required'),
                                        value: value[0].required
                                    }
                                ])
                            }
                        }
                    }
                },
            ]
        },
        filterCfg: {
            height: 120,
            items: [
                {
                    itemId: '_id',
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    isLike: false
                },
                {
                    itemId: 'description',
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description')
                },
                {
                    xtype: 'uxtreecombohaspaging',
                    name: 'argumentType._id',
                    itemId: 'argumentType',
                    fieldLabel: i18n.getKey('argumentType'),
                    store: rtTypeStore,
                    displayField: 'name',
                    valueField: '_id',
                    editable: false,
                    haveReset: true,
                    canSelectFolders: true,
                    allowBlank: true,
                    multiselect: false,
                    matchFieldWidth: false,
                    isLike: false,
                    defaultColumnConfig: {
                        renderer: function (value, metadata, record) {
                            return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                        }
                    },
                    showSelectColumns: [
                        {
                            dataIndex: '_id',
                            flex: 1,
                            text: i18n.getKey('id')
                        },
                        {
                            dataIndex: 'name',
                            text: i18n.getKey('name'),
                            flex: 2
                        }
                    ],
                }
            ]
        }
    });
});