/**
 * Created by nan on 2021/4/30
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.ManageSMVTGrid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    itemId: 'smvtGrid',
    data: null,
    topTab: null,
    productConfigDesignId: null,
    productBomConfigId: null,
    simplifyBomConfigId: null,
    sbomNodeId: null,
    materialPath: null,
    createHandler: null,
    batchHandler: null,
    editActionHandler: null,
    deleteActionHandler: null,
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.store.SimplifySBOMMaterialViewType');

        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.controller.Controller');
        var designController = Ext.create('CGP.product.view.productconfig.productdesignconfig.controller.Controller');
        me.title = i18n.getKey('smvt');
        me.gridCfg = {
            editAction: false,
            deleteAction: false,
            selType: 'rowmodel',
            store: store,
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_create',
                    handler: me.createHandler || function (btn) {
                        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
                        builderConfigTab.editSimplifyBomConfig(me.productConfigDesignId, me.productBomConfigId, null, me.sbomNodeId);
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_create',
                    text: i18n.getKey('batch') + i18n.getKey('create'),
                    handler: me.batchHandler || function (btn) {
                        var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.BatchCreatePMVTWindow', {
                            configType: 'SMVT',
                            productConfigDesignId: me.productConfigDesignId,
                            productBomConfigId: me.productBomConfigId,
                            productId: me.productId,
                            materialPath: me.materialPath

                        });
                        win.show();
                    }
                }

            ],
            multiSelect: true,
            defaults: {
                width: 200
            },
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    width: 70,
                    tdCls: 'vertical-middle',
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('edit'),
                            handler: me.editActionHandler || function (view, rowIndex, colIndex, a, b, record) {
                                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
                                builderConfigTab.editSimplifyBomConfig(me.productConfigDesignId, me.productBomConfigId, record.getId(), me.sbomNodeId);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('delete'),
                            handler: me.deleteActionHandler || function (view, rowIndex, colIndex, a, b, record) {
                                controller.deleteSMVT(record.getId(), store, me.sbomNode, me.simplifyBomConfig);
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    tdCls: 'vertical-middle',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('manager') + i18n.getKey('template') + i18n.getKey('config'),
                                                handler: function () {
                                                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
                                                    builderConfigTab.managerProductMaterialViewTypeTemplateConfig(record.getId(), 'smvt', me.productConfigDesignId);
                                                }
                                            },
                                            {
                                                text: i18n.getKey('pcs') + i18n.getKey('preprocess'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var mask = me.setLoading();
                                                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
                                                    designController.judgeHavePcsConfig(me.productConfigDesignId, record.getId(), builderConfigTab, mask)
                                                }
                                            },
                                            {
                                                text: i18n.getKey('delete') + i18n.getKey('pcs') + i18n.getKey('preprocess'),
                                                handler: function () {
                                                    var pcsConfig = designController.getPcsConfig(me.productConfigDesignId, record.getId());
                                                    if (pcsConfig) {
                                                        designController.deletePcsConfig(pcsConfig._id);
                                                    } else {
                                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('当前该配置无关联的PCS预处理'));
                                                    }
                                                }
                                            },
                                            {
                                                text: i18n.getKey('PC预设'),
                                                menu: {
                                                    items: [
                                                        {
                                                            text: i18n.getKey('PCPreSetTheme'),
                                                            handler: function () {
                                                                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
                                                                builderConfigTab.addNewTab({
                                                                    id: 'PCPreSetTheme',
                                                                    url: path + 'partials/product/productconfig/productdesignconfig/productmaterialviewtype/pcpretheme/main.html' +
                                                                        '?mvtId=' + record.getId() +
                                                                        '&mvtType=com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType',
                                                                    title: i18n.getKey('manager') + '_' + i18n.getKey('PCPreSetTheme'),
                                                                    refresh: true
                                                                });

                                                            }
                                                        },
                                                        {
                                                            text: i18n.getKey('PCPreSet'),
                                                            handler: function () {
                                                                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
                                                                builderConfigTab.addNewTab({
                                                                    id: 'PCPreSet',
                                                                    url: path + 'partials/product/productconfig/productdesignconfig/productmaterialviewtype/pcpreset/main.html' +
                                                                        '?mvtId=' + record.getId() +
                                                                        '&mvtType=com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType',
                                                                    title: i18n.getKey('manager') + '_' + i18n.getKey('PCPreSet'),
                                                                    refresh: true
                                                                });

                                                            }
                                                        },
                                                    ]
                                                }
                                            },
                                            {
                                                text: i18n.getKey('pcResourceLibrary'),
                                                handler: function () {
                                                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
                                                    builderConfigTab.addNewTab({
                                                        id: 'MVTPCResourceLibrary',
                                                        url: path + 'partials/product/productconfig/productdesignconfig/productmaterialviewtype/pcresource/main.html' +
                                                            '?MVTId=' + record.getId() +
                                                            '&clazz=com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType',
                                                        title: i18n.getKey('pcResourceLibrary'),
                                                        refresh: true
                                                    });
                                                }
                                            },
                                        ]
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id'),
                    itemId: '_id',
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                }, {
                    dataIndex: 'name',
                    text: i18n.getKey('name'),
                    itemId: 'name',
                    tdCls: 'vertical-middle',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    dataIndex: 'materialPath',
                    text: i18n.getKey('materialPath'),
                    width: 200,
                    tdCls: 'vertical-middle',
                    itemId: 'materialPath',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    dataIndex: 'materialViewType',
                    text: i18n.getKey('materialViewType'),
                    width: 180,
                    tdCls: 'vertical-middle',
                    xtype: 'componentcolumn',
                    itemId: 'materialViewType',
                    renderer: function (value, metadata) {
                        var name = '';
                        if (!Ext.isEmpty(value['name'])) {
                            name = value['name'];
                        }
                        var description = '';
                        if (!Ext.isEmpty(value['description'])) {
                            description = value['description'];
                        }
                        var result = i18n.getKey('id') + '：' + '(' + value['_id'] + ')' + '<br>' + i18n.getKey('name') + '：' + name + '<br>'
                            + i18n.getKey('description') + '：' + description;
                        metadata.tdAttr = 'data-qtip="' + result + '"';
                        return {
                            xtype: 'displayfield',
                            value: i18n.getKey('id') + '：' + '<a href="#" id="click-materialViewType">' + '(' + value['_id'] + ')' + '</a>' + '<br>' + i18n.getKey('name') + '：' + name + '<br>'
                                + i18n.getKey('description') + '：' + description,
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-materialViewType');
                                    clickElement.addEventListener('click', function () {
                                        JSOpen({
                                            id: 'materialviewtypepage',
                                            url: path + 'partials/materialviewtype/main.html?materialViewTypeId=' + value['_id'],
                                            title: i18n.getKey('materialViewType'),
                                            refresh: true
                                        })
                                    }, false);

                                }
                            }
                        }
                    }
                },
                {
                    dataIndex: 'pageContentQty',
                    text: i18n.getKey('pageContentQty'),
                    flex: 1,
                    minWidth: 200,
                    tdCls: 'vertical-middle',
                    xtype: 'componentcolumn',
                    itemId: 'pageContentQty',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value)) {
                            return;
                        }
                        var valueString = JSON.stringify(value, null, "\t");
                        return new Ext.button.Button({
                            text: '<div>' + i18n.getKey('check') + '</div>',
                            frame: false,
                            width: 100,
                            tooltip: i18n.getKey('check') + i18n.getKey('pageContentQty'),
                            baseCls: 'uxGridBtn',
                            style: {
                                background: '#F5F5F5'
                            },
                            handler: function (comp) {
                                var win = Ext.create("Ext.window.Window", {
                                    modal: true,
                                    layout: 'fit',
                                    title: i18n.getKey('pageContentQty'),
                                    items: [
                                        {
                                            xtype: 'textarea',
                                            fieldLabel: false,
                                            width: 600,
                                            height: 400,
                                            value: valueString
                                        }
                                    ]
                                });
                                win.show();
                            }

                        });
                    }
                }
            ]
        };
        me.filterCfg = {
            height: 120,
            defaults: {
                width: 280
            },
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id',
                    isLike: false
                }, {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                }, {
                    name: 'materialPath',
                    xtype: 'textfield',
                    hidden: true,
                    isLike: false,
                    itemId: 'materialPath'
                },
                {
                    name: 'productConfigDesignId',
                    xtype: 'numberfield',
                    hidden: true,
                    value: me.productConfigDesignId,
                    fieldLabel: i18n.getKey('productConfigDesignId'),
                    itemId: 'productConfigDesignId'
                }
            ]
        };
        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            page.productId = productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    },
    refreshData: function (data) {
        var me = this;
        var store = me.down('grid').getStore();
        me.sbomNode = data;
        me.data = data;
        me.materialPath = data.get('materialPath');
        me.filter.getComponent('materialPath').setValue(data.get('materialPath'));
        store.loadPage(1);

    }
});