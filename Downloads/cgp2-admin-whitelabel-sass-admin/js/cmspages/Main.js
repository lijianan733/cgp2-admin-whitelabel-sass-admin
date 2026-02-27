Ext.Loader.syncRequire([
    'CGP.cmspages.store.CMSPageStore',
    'CGP.cmspages.store.CMSPageTemplateStore'
]);
Ext.onReady(function () {
    var CMSStore = Ext.create('CGP.cmspages.store.CMSPageStore');
    var CMSPageTemplateStore = Ext.create('CGP.cmspages.store.CMSPageTemplateStore');
    Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('CMSPages'),
        block: 'cmspages',
        editPage: 'edit.html',
        filterCfg: {
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    name: 'status',
                    xtype: 'combo',
                    isLike: false,
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    editable: false,
                    isNumber: true,
                    haveReset: true,
                    displayField: 'key',
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['key', 'value'],
                        data: [
                            {'key': '正式', 'value': 3},
                            {'key': '草稿', 'value': 1}
                        ]
                    }
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'cmsType',
                    xtype: 'combo',
                    isLike: false,
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    editable: false,
                    haveReset: true,
                    displayField: 'key',
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['key', 'value'],
                        data: [
                            {'key': '普通页', 'value': 'Normal'},
                            {'key': '产品详情页', 'value': 'ProductDetail'},
                            {'key': '产品类目页', 'value': 'ProductCategory'}
                        ]
                    }
                },
                {
                    name: 'tags',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('tags'),
                    itemId: 'tags'
                },
            ]
        },
        gridCfg: {
            store: CMSStore,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 200,
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'cmsType',
                    width: 120,
                    renderer: function (value, matadata, record) {
                        if (value == 'ProductDetail') {
                            return '产品详情页'
                        } else if (value == 'ProductCategory') {
                            return '产品类目页'
                        } else if (value == 'Normal') {
                            return '普通页'
                        }
                    }
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    width: 100,
                    renderer: function (value, matadata, record) {
                        if (value == 1) {
                            return '草稿';
                        } else if (value == 3) {
                            return '正式';
                        }
                    },
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('CMS编译') + i18n.getKey('context'),
                    dataIndex: 'cmsContext',
                    minWidth: 300,
                    getDisplayName: function (value) {
                        return value.name + '_上下文' + '<a href="#" style="text-decoration: none">' + i18n.getKey('check') + '</a>'
                    },
                    clickHandler: function (value, metadata, record) {
                        JSOpen({
                            id: 'cmscontextpage',
                            url: path + 'partials/cmscontext/main.html?_id=' + value._id,
                            title: i18n.getKey('context'),
                            refresh: true,
                        });
                    },
                },
                {
                    text: i18n.getKey('templateFilePath'),
                    dataIndex: 'templateFilePath',
                    width: 350,
                    flex: 1,
                    renderer: function (value) {
                        return JSAutoWordWrapStr(value)
                    }
                },
                {
                    xtype: 'arraycolumn',
                    text: i18n.getKey('tags'),
                    dataIndex: 'tags',
                    width: 150
                },
                {
                    xtype: 'imagecolumn',
                    width: 120,
                    tdCls: 'vertical-middle',
                    dataIndex: 'staticPreviewFile',
                    text: i18n.getKey('staticPreviewFile'),
                    buildUrl: function (value, metadata, record) {
                        var imageUrl = value;
                        imageUrl = imageServer + imageUrl;
                        return imageUrl;
                    },
                    buildPreUrl: function (value, metadata, record) {
                        var imageUrl = value;
                        imageUrl = imageServer + imageUrl;
                        return imageUrl;
                    },
                    buildTitle: function (value, metadata, record) {
                        var imageUrl = value;
                        imageUrl = imageServer + imageUrl;
                        return `${i18n.getKey('check')} < ${imageUrl} > 预览图`;
                    }
                },
            ]
        },
        tbarCfg: {
            btnCreate: {
                xtype: 'splitbutton',
                iconCls: 'icon_add',
                text: i18n.getKey('create'),
                width: 80,
                menu: [
                    {
                        text: i18n.getKey('create'),
                        handler: function () {
                            JSOpen({
                                id: 'cmspages' + '_edit',
                                url: path + 'partials/cmspages/edit.html',
                                title: i18n.getKey('create') + '_' + i18n.getKey('CMSPages'),
                                refresh: true
                            });
                        }
                    },
                    {
                        text: i18n.getKey('templates') + i18n.getKey('create'),
                        handler: function (btn) {
                            var win = Ext.create('Ext.window.Window', {
                                modal: true,
                                constrain: true,
                                title: i18n.getKey('pleaseChoose') + i18n.getKey('templates'),
                                layout: {
                                    type: 'fit'
                                },
                                bbar: {
                                    xtype: 'bottomtoolbar',
                                    saveBtnCfg: {
                                        handler: function (btn) {
                                            var id = grid.grid.selectedRecords.keys[0];
                                            if (id) {
                                                JSOpen({
                                                    id: 'cmspages' + '_edit',
                                                    url: path + 'partials/cmspages/edit.html' + '?templateId=' + id,
                                                    title: i18n.getKey('create') + '_' + i18n.getKey('CMSPages'),
                                                    refresh: true
                                                });
                                            } else {
                                                Ext.Msg.alert(i18n.getKey('提示'), i18n.getKey('请选择模板'))
                                            }

                                        }
                                    }
                                }
                            });
                            var grid = Ext.create('CGP.common.commoncomp.QueryGrid', {
                                autoScroll: true,
                                filterCfg: {
                                    header: false,
                                    items: [
                                        {
                                            name: '_id',
                                            xtype: 'textfield',
                                            isLike: false,
                                            fieldLabel: i18n.getKey('id'),
                                            itemId: '_id'
                                        },
                                        {
                                            name: 'name',
                                            xtype: 'textfield',
                                            isLike: false,
                                            fieldLabel: i18n.getKey('name'),
                                            itemId: 'name'
                                        },
                                        {
                                            name: 'cmsType',
                                            xtype: 'combo',
                                            isLike: false,
                                            fieldLabel: i18n.getKey('type'),
                                            itemId: 'type',
                                            editable: false,
                                            displayField: 'key',
                                            valueField: 'value',
                                            store: {
                                                xtype: 'store',
                                                fields: ['key', 'value'],
                                                data: [
                                                    {'key': '普通页', 'value': 'Normal'},
                                                    {'key': '产品详细', 'value': 'ProductDetail'},
                                                    {'key': '产品分类目录', 'value': 'ProductCategory'}
                                                ]
                                            }
                                        }
                                    ]
                                },
                                gridCfg: {
                                    multiSelect: false,
                                    selType: 'rowmodel',
                                    store: CMSPageTemplateStore,
                                    isReadOnly: true,
                                    editDisabled: true,
                                    columns: [
                                        {
                                            text: i18n.getKey('id'),
                                            dataIndex: '_id'
                                        },
                                        {
                                            text: i18n.getKey('name'),
                                            dataIndex: 'name',
                                            minWidth: 90,
                                            flex: 1
                                        },
                                        {
                                            text: i18n.getKey('type'),
                                            dataIndex: 'cmsType',
                                            minWidth: 120,
                                            flex: 1,
                                            renderer: function (value, matadata, record) {
                                                if (value == 'ProductDetail') {
                                                    return '产品详细'
                                                } else if (value == 'ProductCategory') {
                                                    return '产品分类目录'
                                                }
                                            }
                                        },
                                        {
                                            text: i18n.getKey('templateFilePath'),
                                            dataIndex: 'templateFilePath',
                                            minWidth: 150,
                                            flex: 2,
                                            renderer: function (value) {
                                                return JSAutoWordWrapStr(value)
                                            }
                                        },
                                        {
                                            xtype: 'imagecolumn',
                                            width: 130,
                                            tdCls: 'vertical-middle',
                                            dataIndex: 'staticPreviewFile',
                                            text: i18n.getKey('staticPreviewFile'),
                                            buildUrl: function (value, metadata, record) {
                                                var imageUrl = value;
                                                if (imageUrl.indexOf('.pdf') != -1) {
                                                    imageUrl += '?format=png';
                                                }
                                                imageUrl = imageServer + imageUrl;
                                                return imageUrl;
                                            },
                                            buildPreUrl: function (value, metadata, record) {
                                                var imageUrl = value;
                                                if (imageUrl.indexOf('.pdf') != -1) {
                                                    imageUrl += '?format=png';
                                                }
                                                imageUrl = imageServer + imageUrl;
                                                return imageUrl;
                                            },
                                            buildTitle: function (value, metadata, record) {
                                                var imageUrl = value;
                                                if (imageUrl.indexOf('.pdf') != -1) {
                                                    imageUrl += '?format=png';
                                                }
                                                return `${i18n.getKey('check')} < ${imageUrl} > 预览图`;
                                            }
                                        },
                                    ]
                                }
                            });
                            win.add(grid)
                            win.show();
                        }
                    }
                ],
            }
        }

    });
});
