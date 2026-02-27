/**
 * @Description:
 * @author nan
 * @date 2023/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cmslog.view.PublishCmsConfigConfirmWin'
])
Ext.define('CGP.cmsconfig.view.ProductCmsGrid', {
    extend: 'Ext.grid.Panel',
    productId: null,
    autoScroll: true,
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.cmsconfig.store.CmsConfigStore', {
            params: {
                filter: Ext.JSON.encode([
                    {"name": "product._id", "value": me.productId, "type": "number"},
                    {"name": "clazz", "value": "com.qpp.cgp.domain.cms.ProductDetailCMSConfig", "type": "string"}
                ])
            }
        });
        me.columns = {
            defaults: {
                menuDisabled: true,
                sortable: false,
                width: 120
            },
            items: [
                {
                    xtype: 'rownumberer'
                },
                {
                    xtype: 'actioncolumn',
                    tdCls: 'vertical-middle',
                    itemId: 'actioncolumn',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex, obj, event, record, dom) {
                                var type = 'ProductDetail';
                                JSOpen({
                                    id: 'cmsconfig_edit',
                                    url: path + 'partials/cmsconfig/edit.html?id=' + record.getId() + '&type=' + type,
                                    title: i18n.getKey('edit') + '_' + CGP.cmsconfig.config.Config.translate[type] + '(' + record.getId() + ')',
                                    refresh: true
                                });
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                Ext.Msg.confirm('提示', '确定删除？', callback);

                                function callback(id) {
                                    if (id === 'yes') {
                                        store.removeAt(rowIndex);
                                        store.sync({
                                            callback: function () {
                                                Ext.Msg.alert(i18n.getKey('prompt'), '删除成功!', function () {
                                                    store.load();
                                                })
                                            }
                                        });
                                    }
                                }
                            }
                        },
                        {
                            iconCls: 'icon_copy',
                            itemId: 'copy',
                            tooltip: 'copy',
                            handler: function (view, rowIndex, colIndex, obj, event, record, dom) {
                                var store = view.getStore();
                                Ext.Msg.confirm('提示', '确定复制？', callback);

                                function callback(id) {
                                    if (id === 'yes') {
                                        var data = record.getData();
                                        delete data._id;
                                        var url = adminPath + 'api/cms-configs';

                                        JSAjaxRequest(url, 'POST', true, data, '复制成功！', function (require, success, response) {
                                            JSSetLoading(false);
                                            if (success) {
                                                store.load();
                                            }
                                        },true);
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    minWidth: 150,
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    value: value
                                },
                                {
                                    xtype: 'button',
                                    text: '发布',
                                    iconCls: 'server_go',
                                    margin: '0 5',
                                    ui: 'default-toolbar-small',
                                    handler: function () {
                                        var win = Ext.create('CGP.cmslog.view.PublishCmsConfigConfirmWin', {
                                            selectedData: [record.getData()],
                                            title: '发布产品指定版本CMS发布配置'
                                        });
                                        win.show();
                                    }
                                }
                            ]
                        }
                    }
                },
                /*{
                    xtype: 'atagcolumn',
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    minWidth: 150,
                    getDisplayName: function (value, metadata, record) {
                        return value + '<a href="#" style="color: blue;margin-left: 10px;">发布</a>'
                    },
                    clickHandler: function (value, metadata, record) {
                        var win = Ext.create('CGP.cmslog.view.PublishCmsConfigConfirmWin', {
                            selectedData: [record.getData()],
                            title: '发布产品指定版本CMS发布配置'
                        });
                        win.show();
                    }
                },*/
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('CMSPages'),
                    dataIndex: 'cmsPageId',
                    renderer: function (value, metadata, record) {
                        if (value) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#" style="color: blue;">' + value + '</a>',
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
                    width: 300,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + (value) + '"';
                        return JSAutoWordWrapStr(value)
                    }
                },
                {
                    text: i18n.getKey('pageTitle'),
                    dataIndex: 'pageTitle',
                    width: 300,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + (value) + '"';
                        return JSAutoWordWrapStr(value)
                    }
                },
                {
                    text: i18n.getKey('配置版本'),
                    dataIndex: 'configVersion',
                    width: 100,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + (value) + '"';
                        if (value == 0) {
                            return '无'
                        } else {
                            return JSAutoWordWrapStr(value)
                        }
                    }
                },
                {
                    text: i18n.getKey('属性版本'),
                    dataIndex: 'versionedProductAttributeId',
                    width: 250,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + (value) + '"';
                        if (!Ext.isEmpty(value) && value == 0) {
                            return '自动获取最新属性版本';
                        } else if (Ext.isEmpty(value)) {
                            return '无';
                        } else {
                            return JSAutoWordWrapStr(value)
                        }
                    }
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    minWidth: 120,
                    renderer: function (value, matadata, record) {
                        if (value == 1) {
                            return '草稿';
                        } else if (value == 3) {
                            return '正式';
                        }
                    },
                },
                {
                    xtype: 'imagecolumn',
                    width: 300,
                    flex: 1,
                    dataIndex: 'defaultImageInCatalog',
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
                }]
        };
        me.bbar = {
            xtype: 'pagingtoolbar',
            store: me.store
        };
        me.callParent();
    }
})