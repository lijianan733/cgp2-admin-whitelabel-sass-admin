/**
 * @Description: cmsConfig分为两类，产品类目，产品类目，
 * 根据URL中的参数判断，type的值为ProductDetail/ProductCategory/NormalPage
 * @author nan
 * @date 2022/4/28
 */
Ext.Loader.syncRequire([
    'CGP.cmsconfig.store.CmsConfigStore',
    'CGP.cmspages.store.CMSPageStore',
    'CGP.common.field.ProductGridCombo',
    'CGP.cmspage.model.CmsPage',
    'CGP.common.field.ProductCategoryCombo',
    'CGP.cmsconfig.config.Config',
    'CGP.cmslog.view.PublishNormalPageConfirmWin',
    'CGP.cmsconfig.view.CatalogGridCombo'
]);
Ext.onReady(function () {
    var cmsPageStore = Ext.create('CGP.cmspages.store.CMSPageStore');
    var cmsConfigStore = Ext.create('CGP.cmsconfig.store.CmsConfigStore');
    var type = JSGetQueryString('type');
    var clazz = CGP.cmsconfig.config.Config.clazz[type];
    var isProduction = /*false;*/(JSWebsiteIsStage() && (JSWebsiteIsTest() == false));
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('cmsConfig'),
        block: 'cmsconfig',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function (btn) {
                    JSOpen({
                        id: 'cmsconfig_edit',
                        url: path + 'partials/cmsconfig/edit.html?type=' + type,
                        title: i18n.getKey('create') + '_' + CGP.cmsconfig.config.Config.translate[type],
                        refresh: true
                    })
                }
            },
            btnDelete: {
                width: 100,
                hidden: false,//产品详情页隐藏发布功能
                text: i18n.getKey('publish'),
                iconCls: 'server_go',
                disabled: isProduction,
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt;
                    var selected = grid.selectedRecords;
                    if (selected.length == 0) {
                        Ext.Msg.alert(i18n.getKey('prompt'), '请选择要发布的配置')
                    } else {
                        var selectedData = [];
                        selected.items.map(function (item) {
                            selectedData.push(item.getData());
                        });
                        if (JSGetQueryString('type') == 'ProductDetail') {
                            /*     //发布产品
                                 var win = Ext.create('CGP.cmslog.view.PublishProductConfirmWin', {
                                     selectedData: selectedData
                                 });
                                 win.show();*/
                            var win = Ext.create('CGP.cmslog.view.PublishCmsConfigConfirmWin', {
                                selectedData: [record.getData()],
                                title: '发布产品指定版本CMS发布配置'
                            });
                            win.show();
                        } else if (JSGetQueryString('type') == 'ProductCategory') {
                            //发布类目
                            selectedData = selectedData.map(function (item) {
                                return item.category;
                            });
                            var win = Ext.create('CGP.cmslog.view.PublishCategoryConfirmWin', {
                                selectedData: selectedData
                            });
                            win.show();
                        } else if (JSGetQueryString('type') == 'NormalPage') {
                            //发布普通页
                            var win = Ext.create('CGP.cmslog.view.PublishNormalPageConfirmWin', {
                                selectedData: selectedData
                            });
                            win.show();
                        }
                    }
                }
            },
            btnImport: {
                hidden: JSGetQueryString('type') != 'ProductCategory',
                disabled: false,
                width: 110,
                text: i18n.getKey('publish') + i18n.getKey('catalog') + i18n.getKey('page'),
                iconCls: 'server_go',
                handler: function (btn) {
                    JSOpen({
                        id: 'publishcatalogpage',
                        url: path + 'partials/cmsconfig/main.html?type=NormalPage',
                        title: i18n.getKey('normalPagePublishConfig'),
                        refresh: true
                    })
                }
            },
            /**
             * 预览发布的功能，发布到不同的服务器目录下
             */
            btnExport: {
                hidden: false,
                disabled: false,
                width: 100,
                text: i18n.getKey('preview') + i18n.getKey('publish'),
                iconCls: 'server_go',
                handler: function (btn) {
                    Ext.Msg.alert('prompt', '设计中...');
                }
            }
        },
        gridCfg: {
            store: cmsConfigStore,
            customPaging: [
                {value: 25},
                {value: 50},
                {value: 75},
                {value: 100}
            ],
            editActionHandler: function (view, rowIndex, colIndex, obj, event, record, dom) {
                JSOpen({
                    id: 'cmsconfig_edit',
                    url: path + 'partials/cmsconfig/edit.html?id=' + record.getId() + '&type=' + type,
                    title: i18n.getKey('edit') + '_' + CGP.cmsconfig.config.Config.translate[type] + '(' + record.getId() + ')',
                    refresh: true
                });
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    minWidth: 120
                },
                {
                    text: i18n.getKey('CMSPages'),
                    dataIndex: 'cmsPageId',
                    itemId: 'CMSPage',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        if (value) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="text-decoration: none">' + value + '</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        if (ela) {
                                            ela.on("click", function () {
                                                JSOpen({
                                                    id: 'cmspagespage',
                                                    url: path + 'partials/cmspages/main.html?_id=' + value,
                                                    title: i18n.getKey('CMSPages'),
                                                    refresh: true
                                                });
                                            });
                                        }
                                    }
                                }
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('html') + i18n.getKey('pageName'),
                    dataIndex: 'pageName',
                    itemId: 'pageName',
                    width: 300,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + (value) + '"';
                        return JSAutoWordWrapStr(value)
                    }
                },
                {
                    text: i18n.getKey('pageTitle'),
                    dataIndex: 'pageTitle',
                    itemId: 'pageTitle',
                    width: 300,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + (value) + '"';
                        return JSAutoWordWrapStr(value)
                    }
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    minWidth: 150,
                    flex: 1,
                    renderer: function (value, matadata, record) {
                        if (value == 1) {
                            return '<font color="red">草稿</font>';
                        } else if (value == 3) {
                            return '<font color="green">正式</font>';
                        }
                    },
                },
                {
                    text: i18n.getKey('product'),
                    dataIndex: 'productListDTO',
                    minWidth: 350,
                    flex: 1,
                    xtype: 'atagcolumn',
                    hidden: !(type == 'ProductDetail'),
                    getDisplayName: function (value, metadata, record) {
                        var items = [
                            {
                                title: i18n.getKey('id'),
                                value: '<a href="#" style="text-decoration: none">' + value.id + '</a>'
                            },
                            {
                                title: i18n.getKey('productMode'),
                                value: value.mode
                            },
                            {
                                title: i18n.getKey('name'),
                                value: value.name
                            }, {
                                title: i18n.getKey('type'),
                                value: value.type
                            }]
                        return JSCreateHTMLTable(items);
                    },
                    clickHandler: function (value, metadata, record) {
                        JSOpen({
                            id: 'productpage',
                            url: path + 'partials/product/product.html?id=' + value.id,
                            title: i18n.getKey('product'),
                            refresh: true
                        });
                    }
                },
                {
                    xtype: 'imagecolumn',
                    width: 300,
                    tdCls: 'vertical-middle',
                    dataIndex: 'defaultImageInCatalog',
                    hidden: !(type == 'ProductDetail'),
                    text: i18n.getKey('类目页中的产品图'),
                    //订单的缩略图特殊位置
                    buildUrl: function (value, metadata, record) {
                        if (value) {
                            var imageUrl = value.name;
                            var src = imageServer + imageUrl;
                            return src;
                        }
                    },
                    //订单的缩略图特殊位置
                    buildPreUrl: function (value, metadata, record) {
                        if (value) {
                            var imageUrl = value.name;
                            var src = imageServer + imageUrl;
                            return src;
                        }
                    },
                    buildTitle: function (value, metadata, record) {
                        var imageUrl = value.name;
                        return `${i18n.getKey('check')} < ${imageUrl} > 预览图`;
                    }
                },
                {
                    text: i18n.getKey('catalog'),
                    dataIndex: 'category',
                    width: 150,
                    xtype: 'atagcolumn',
                    hidden: !(type == 'ProductCategory'),
                    getDisplayName: function (value, metadata, record) {
                        var items = [
                            {
                                title: i18n.getKey('id'),
                                value: '<a href="#" style="text-decoration: none">' + value.id + '</a>'
                            },
                            {
                                title: i18n.getKey('name'),
                                value: value.name
                            }, {
                                title: i18n.getKey('type'),
                                value: value.showAsProductCatalog ? '产品类目' : '营销类目'
                            }]
                        return JSCreateHTMLTable(items);
                    },
                    clickHandler: function (value, metadata, record) {
                        //跳转到类目
                        if (value.showAsProductCatalog) {
                            JSOpen({
                                id: 'productCatalog',
                                url: path + 'partials/productcatalog/main.html?id=' + value.id,
                                title: i18n.getKey('productCatalog'),
                                refresh: true
                            });
                        } else {
                            JSOpen({
                                id: 'saleProductCatalog',
                                url: path + 'partials/saleproductcatalog/main.html?id=' + value.id,
                                title: i18n.getKey('saleProductCatalog'),
                                refresh: true
                            });
                        }

                    }
                },
            ],
            listeners: {
                afterrender: function (grid) {
                    var view = grid.getView();
                    Ext.create('Ext.tip.ToolTip', {
                        target: view.el,//目标元素
                        dismissDelay: 5000,//5秒后消失
                        title: 'CMS页面信息',
                        delegate: 'td.x-grid-cell-CMSPage',//目标元素下子元素
                        trackMouse: false,//  为真时行间移动不会隐藏
                        closable: false,
                        autoHide: true,
                        items: [
                            {
                                xtype: 'container',
                                items: []
                            }
                        ],
                        listeners: {
                            // 当元素被显示时动态改变内容.
                            beforeshow: function updateTipBody(tip) {
                                var id = tip.triggerElement.innerText;
                                var container = tip.items.items[0];
                                container.removeAll();
                                CGP.cmspages.model.CMSPageModel.load(id, {
                                    success: function (record) {
                                        var data = record.raw;
                                        var src = null;
                                        if (data.staticPreviewFile) {
                                            src = imageServer + data.staticPreviewFile;
                                        }
                                        var items = [
                                            {
                                                title: i18n.getKey('name'),
                                                value: data.name
                                            },
                                            {
                                                title: i18n.getKey('status'),
                                                value: data.status == '3' ? '正式' : '草稿'
                                            },
                                            {
                                                title: '预览图',
                                                value: '<img width="100px" height="100px" src="' + src + '">'
                                            }
                                        ];
                                        container.add({
                                            xtype: 'displayfield',
                                            value: JSCreateHTMLTable(items)
                                        })
                                    }
                                })
                            }
                        }
                    });
                }
            }
        },
        filterCfg: {
            defaults: {
                isLike: false
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id',
                    name: '_id'
                },
                {
                    name: 'cmsPageId',
                    itemId: 'cmsPageId',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('CMSPages'),
                    editable: false,
                    matchFieldWidth: false,
                    haveReset: true,
                    displayField: 'name',
                    valueField: '_id',
                    store: cmsPageStore,
                    filterCfg: {
                        defaults: {
                            isLike: false,
                            width: 200,
                            labelWidth: 60
                        },
                        items: [
                            {
                                name: '_id',
                                itemId: '_id',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('id')
                            },
                            {
                                name: 'name',
                                itemId: 'name',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name')
                            },
                            {
                                name: 'cmsType',
                                itemId: 'cmsType',
                                xtype: 'combo',
                                editable: false,
                                displayField: 'key',
                                valueField: 'value',
                                fieldLabel: i18n.getKey('type'),
                                value: type,
                                store: {
                                    xtype: 'store',
                                    fields: ['key', 'value'],
                                    data: [
                                        {
                                            'key': '产品详情',
                                            'value': 'ProductDetail'
                                        },
                                        {
                                            'key': '产品类目',
                                            'value': 'ProductCategory'
                                        }
                                    ]
                                }
                            },
                            {
                                name: 'status',
                                xtype: 'combo',
                                editable: false,
                                fieldLabel: i18n.getKey('status'),
                                itemId: 'status',
                                displayField: 'key',
                                isNumber: true,
                                valueField: 'value',
                                store: {
                                    xtype: 'store',
                                    fields: ['key', 'value'],
                                    data: [
                                        {
                                            key: '正式', value: '3'
                                        },
                                        {
                                            key: '草稿', value: '1'
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    gridCfg: {
                        store: cmsPageStore,
                        height: 400,
                        width: 720,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 90,
                                dataIndex: '_id'
                            },
                            {
                                text: i18n.getKey('name'),
                                width: 350,
                                dataIndex: 'name'
                            },
                            {
                                text: i18n.getKey('type'),
                                flex: 1,
                                dataIndex: 'cmsType',
                                renderer: function (value, matadata, record) {
                                    if (value == 'ProductDetail') {
                                        return '产品详情'
                                    } else if (value == 'ProductCategory') {
                                        return '产品类目'
                                    }
                                }
                            },
                            {
                                text: i18n.getKey('status'),
                                flex: 1,
                                dataIndex: 'status',
                                renderer: function (value) {
                                    if (value == 1) {
                                        return '草稿';
                                    } else if (value == 3) {
                                        return '正式';
                                    }
                                }
                            }
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: cmsPageStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyText: i18n.getKey('noDat')
                        }
                    },
                },
                {
                    xtype: 'productgridcombo',
                    hidden: !(type == 'ProductDetail'),
                    gotoConfigHandler: undefined,
                    productType: null,
                },
                {
                    xtype: 'catalog_gridcombo',
                    itemId: 'subCategories2',
                    hidden: !(type == 'ProductCategory'),
                    name: 'category._id',
                },
                {
                    name: 'pageName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('pageName'),
                    itemId: 'pageName'
                },
                {
                    name: 'pageTitle',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('pageTitle'),
                    itemId: 'pageTitle'
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
                    name: 'product.mode',
                    itemId: 'mode',
                    fieldLabel: i18n.getKey('productMode'),
                    xtype: 'combo',
                    editable: false,
                    haveReset: true,
                    displayField: 'key',
                    hidden: !(type == 'ProductDetail'),
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['key', 'value'],
                        data: [
                            {
                                key: 'TEST', value: 'TEST'
                            },
                            {
                                key: 'RELEASE', value: 'RELEASE'
                            }
                        ]
                    }
                },
                {
                    name: 'clazz',
                    xtype: 'textfield',
                    allowReset: false,
                    hidden: true,
                    fieldLabel: i18n.getKey('clazz'),
                    itemId: 'clazz',
                    value: clazz
                },
            ]
        },
    });
});
