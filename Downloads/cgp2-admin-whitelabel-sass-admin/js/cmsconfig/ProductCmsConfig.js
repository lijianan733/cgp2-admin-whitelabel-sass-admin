/**
 * @Description:
 * @author nan
 * @date 2023/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cmsconfig.store.CmsConfigStore',
    'CGP.cmspages.store.CMSPageStore',
    'CGP.common.field.ProductGridCombo',
    'CGP.cmspage.model.CmsPage',
    'CGP.common.field.ProductCategoryCombo',
    'CGP.cmsconfig.config.Config',
    'CGP.cmslog.view.PublishNormalPageConfirmWin'
]);
Ext.onReady(function () {
    var type = 'ProductDetail';
    var cmsProductStore = Ext.create('CGP.cmsconfig.store.CmsProductStore');
    var isProduction = (JSWebsiteIsStage() && (JSWebsiteIsTest() == false));
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('cmsConfig'),
        block: 'cmsconfig',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function (btn) {
                    JSOpen({
                        id: 'cmsconfig_edit',
                        url: path + 'partials/cmsconfig/edit.html' +
                            '?type=' + type,
                        title: i18n.getKey('create') + '_' + CGP.cmsconfig.config.Config.translate[type],
                        refresh: true
                    });
                }
            },
            btnDelete: {
                hidden: false,
                width: 150,
                text: i18n.getKey('发布产品最新配置版本'),
                iconCls: 'server_go',
                disabled: isProduction,
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt;
                    var selected = grid.selectedRecords;
                    if (selected.length == 0) {
                        Ext.Msg.alert(i18n.getKey('prompt'), '请选择要发布的配置');
                    } else {
                        var selectedData = [];
                        selected.items.map(function (item) {
                            var images = item.get('medias') || [];
                            var newImages = [];
                            images.map(function (item) {
                                newImages.push({
                                    small: {
                                        name: item.name
                                    }
                                });
                            });
                            selectedData.push({
                                productImages: newImages,
                                productListDTO: item.getData()
                            });
                        });
                        //发布产品
                        var win = Ext.create('CGP.cmslog.view.PublishProductConfirmWin', {
                            selectedData: selectedData
                        });
                        win.show();
                    }
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
            store: cmsProductStore,
            plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl: new Ext.XTemplate(
                    '<div  style="width: 100%" id="log-{id}" ></div>'
                )
            }],
            customPaging: [
                {value: 25},
                {value: 50},
                {value: 75},
                {value: 100}
            ],
            viewConfig: {
                listeners: {
                    expandbody: function (tr, record, selector, event) {
                        var raw = record.raw;
                        var dom = document.getElementById('log-' + raw.id);
                        var productId = record.getId();
                        JSSetLoading(true);
                        if (Ext.isEmpty(dom.innerHTML)) {
                            setTimeout(function () {
                                var grid = Ext.create('CGP.cmsconfig.view.ProductCmsGrid', {
                                    renderTo: 'log-' + raw.id,
                                    width: 1600,
                                    productId: productId,
                                    id: 'log-' + raw.id + '-grid',
                                    listeners: {
                                        el: {
                                            dblclick: function (event) {
                                                event.stopEvent();
                                            }
                                        }
                                    }
                                });
                                JSSetLoading(false);
                            }, 250);
                        } else {
                            JSSetLoading(false);
                        }
                    }
                },
            },
            editAction: false,
            deleteAction: false,
            editActionHandler: function (view, rowIndex, colIndex, obj, event, record, dom) {
                JSOpen({
                    id: 'cmsconfig_edit',
                    url: path + 'partials/cmsconfig/edit.html?id=' + record.getId() + '&type=ProductDetail',
                    title: i18n.getKey('edit') + '_' + CGP.cmsconfig.config.Config.translate[type] + '(' + record.getId() + ')',
                    refresh: true
                });
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    minWidth: 120
                },
                {
                    text: i18n.getKey('product') + i18n.getKey('name'),
                    dataIndex: 'name',
                    minWidth: 450
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    minWidth: 120
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('产品CMS配置数'),
                    dataIndex: 'configSize',
                    minWidth: 120,
                    flex: 1,
                    getDisplayName: function (value, metaData, record) {
                        return value + '<a href="#" style="color: blue;margin-left: 50px">添加</a>'
                    },
                    clickHandler: function (value, metaData, record) {
                        var productId = record.getId();
                        JSOpen({
                            id: 'cmsconfig_edit',
                            url: path + 'partials/cmsconfig/edit.html' +
                                '?type=ProductDetail' +
                                '&productId=' + productId,
                            title: i18n.getKey('create') + '_' + CGP.cmsconfig.config.Config.translate[type],
                            refresh: true
                        });
                    }
                },

            ],
        },
        filterCfg: {
            defaults: {
                isLike: false
            },
            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('product') + i18n.getKey('id'),
                    itemId: 'id',
                    name: 'id',
                    hideTrigger: true,
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('product') + i18n.getKey('name'),
                    itemId: 'name',
                    name: 'name'
                },
                {
                    name: 'type',
                    xtype: 'combo',
                    isLike: true,
                    fieldLabel: i18n.getKey('type'),
                    store: {
                        xtype: 'store',
                        fields: ['name', 'value'],
                        data: [
                            {
                                name: 'Sku',
                                value: 'sku'
                            },
                            {
                                name: 'Configurable',
                                value: 'configurable'
                            },
                            {
                                name: i18n.getKey('allType'),
                                value: ''
                            }
                        ]
                    },
                    displayField: 'name',
                    valueField: 'value',
                    itemId: 'type',
                    editable: false,
                },
            ]
        },
    });
});