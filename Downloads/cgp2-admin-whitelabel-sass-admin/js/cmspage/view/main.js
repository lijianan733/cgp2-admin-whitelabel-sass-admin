Ext.Loader.syncRequire([ 'Ext.ux.form.field.MultiCombo', 'Ext.ux.form.field.TriggerField', 'Ext.ux.form.field.FileField']);
Ext.onReady(function () {
    // 用于下面的资源


    // 初始化资源

    var website = Ext.create("CGP.cmspage.store.Website");
    var controller = Ext.create('CGP.cmspage.controller.Controller');
    var tbarController = Ext.create('CGP.cmspage.controller.TbarController');
    var cmspageStore = Ext.create("CGP.cmspage.store.CmsPage");

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('cmspage'),
        block: 'cmspage',
        editPage: 'edit.html',
        gridCfg: {
            //store.js
            store: cmspageStore,
            frame: false,
            id: 'gridPageId',
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var receiver = record.get('receiver');
                        var id = record.get('id');
                        var enable = record.get('enable');
                        var btnName;
                        var isActive;
                        if (enable == true) {
                            btnName = i18n.getKey('disable');
                            isActive = false;
                        } else {
                            btnName = i18n.getKey('enable');
                            isActive = true;
                        }
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            default: {
                                width: 100
                            },
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('preview'),
                                                disabledCls: 'menu-item-display-none',
                                                //预览页面
                                                handler: function () {
                                                    controller.previewPage(record)
                                                }
                                            },
                                            {
                                                text: i18n.getKey('producePage'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    controller.createPage(record, cmspageStore);
                                                }
                                            }, {
                                                text: i18n.getKey('cmsvariable'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    controller.showCmsVariable(record);
                                                }
                                            }, {
                                                text: btnName + i18n.getKey('page'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    Ext.Msg.confirm('提示', '是否' + btnName + '该页面？', callback);

                                                    function callback(id) {
                                                        if (id === 'yes') {
                                                            record.set('enable', isActive);
                                                            record.save();
                                                        }
                                                    }
                                                }
                                            }, {
                                                text: i18n.getKey('managerProductQuery'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var productQueryId = record.get('productQueryId');
                                                    var type = 'query';
                                                    var title = 'productQuery';
                                                    controller.managerQueryOrFilter(productQueryId, type, title, id)
                                                }
                                            }, {
                                                text: i18n.getKey('managerProductFilter'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var productFilterId = record.get('productFilterId');
                                                    var type = 'filter';
                                                    var title = 'productFilter';
                                                    controller.managerQueryOrFilter(productFilterId, type, title, id);
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 80,
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                }, {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        metadata.style = "font-weight:bold";
                        return value;
                    }

                }, {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    xtype: 'gridcolumn',
                    itemId: 'type',
                    sortable: false
                }, {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    itemId: 'description',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('sourcePath'),
                    dataIndex: 'sourcePath',
                    xtype: 'gridcolumn',
                    width: 250,
                    itemId: 'sourcePath',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('outputUrl'),
                    dataIndex: 'outputUrl',
                    xtype: 'gridcolumn',
                    itemId: 'outputUrl',
                    width: 200,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('pageTitle'),
                    dataIndex: 'pageTitle',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'pageTitle',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('pageKeywords'),
                    dataIndex: 'pageKeywords',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'pageKeywords',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('pageDescription'),
                    dataIndex: 'pageDescription',
                    xtype: 'gridcolumn',
                    width: 120,
                    itemId: 'pageDescription',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    text: i18n.getKey('website'),
                    dataIndex: 'website',
                    xtype: 'gridcolumn',
                    itemId: 'website',
                    sortable: false,
                    flex: 1,
                    renderer: function (value) {
                        return value['name'];
                    }
                }]
        },
        filterCfg: {
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'type',
                xtype: 'combo',
                editable: false,
                haveReset:true,
                fieldLabel: i18n.getKey('type'),
                itemId: 'type',
                store: Ext.create('Ext.data.Store', {
                    fields: ['type', "value"],
                    data: [
                        {
                            type: 'normal', value: 'normal'
                        },
                        {
                            type: 'product', value: 'product'
                        }
                    ]
                }),
                displayField: 'type',
                valueField: 'value',
                queryMode: 'local'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                id: 'outputUrlSearchField',
                name: 'outputUrl',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('outputUrl'),
                itemId: 'outputUrl'
            }, {
                fieldLabel: i18n.getKey('website'),
                id: 'websiteSearch',
                name: 'website.id',
                itemId: 'website',
                xtype: 'combo',
                store: website,
                displayField: 'name',
                valueField: 'id',
                editable: false,
                value: 11
            }]
        },

        listeners: {
            afterload: function (page) {
                tbarController.addBatchcreateBtn(page, cmspageStore);
            }
        }
    });
});