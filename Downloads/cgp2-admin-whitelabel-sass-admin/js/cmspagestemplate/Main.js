Ext.Loader.syncRequire([
    'CGP.cmspagestemplate.store.CMSPageTemplateStore'
])
Ext.onReady(function () {
    var CMSPageTemplateStore = Ext.create('CGP.cmspagestemplate.store.CMSPageTemplateStore')
    Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('cmspagestemplate'),
        block: 'cmspagestemplate',
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
                            {'key': '产品详细', 'value': 'ProductDetail'},
                            {'key': '产品分类目录', 'value': 'ProductCategory'}
                        ]
                    }
                }
            ]
        },
        gridCfg: {
            store: CMSPageTemplateStore,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id'
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 90,
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'cmsType',
                    width: 120,
                    renderer: function (value, matadata, record) {
                        if (value == 'ProductDetail') {
                            return '产品详细'
                        } else if (value == 'ProductCategory') {
                            return '产品分类目录'
                        }
                    }
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    width: 90,
                    renderer: function (value, matadata, record) {
                        if (value == 1) {
                            return '草稿';
                        } else if (value == 3) {
                            return '正式';
                        }
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('CMS编译') + i18n.getKey('context'),
                    dataIndex: 'cmsContext',
                    minWidth: 300,
                    getDisplayName: function (value) {
                        return value.name + '_上下文' + ' <a href="#" style="text-decoration: none">' + i18n.getKey('check') + '</a>'
                    },
                    clickHandler: function (value, metadata, record) {
                        JSOpen({
                            id: value._id,
                            url: cmsPagePath + 'api/cms-saas-context' + '?id=' + value._id,    //?
                            title: i18n.getKey('context'),
                            refresh: true
                        });
                    }
                },
                {
                    text: i18n.getKey('templateFilePath'),
                    dataIndex: 'templateFilePath',
                    minWidth: 150,
                    flex: 1,
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
    })
})