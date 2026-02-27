/**
 * Created by nan on 2017/12/12.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.store.ImageIntegrationConfigsStore'
]);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.view.ManageImageIntegrationConfigsV2', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    initComponent: function () {
        var me = this;
        me.productConfigDesignId = parseInt(me.getQueryString('productConfigDesignId'));
        me.productBomConfigId = parseInt(me.getQueryString('productBomConfigId'));
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.store.ImageIntegrationConfigsStore', {
            params: {
                filter: '[{"name":"productConfigDesignId","value":' + me.productConfigDesignId + ',"type":"number"}]'
            },
            listeners:{
                load:function (store,records){
                    store.filterBy(function (record, id) {
                        var imags=record.get('pageContentEffectConfigs');
                        return imags&&imags.length>0;
                    })
                }
            }
        });
        var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
        var imageIntegrationController=Ext.create('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.controller.ImageIntegrationConfigs');
        var grid = Ext.create('CGP.common.commoncomp.QueryGrid', {
            header: false,
            region: 'center',
            itemId: 'mainGrid',
            gridCfg: {
                editAction: false,
                deleteAction: false,
                showRowNum: false,
                selType: 'checkboxmodel',
                store: store,
                tbar: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_create',
                        handler: function () {
                            controller.editImageIntegrationConfigs(null, store, 'new', me.productConfigDesignId, me.productBomConfigId, 'V2');
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'icon_create',
                        text: i18n.getKey('batch') + i18n.getKey('create'),
                        handler: function (btn) {
                            imageIntegrationController.batchAdd(store, me.productConfigDesignId, me.productBomConfigId,'effectPC');

                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('copy'),
                        iconCls: 'icon_copy',
                        handler: function (btn) {
                            imageIntegrationController.copyHandler(grid.grid);
                        }
                    }
                ],
                columnDefaults: {
                    tdCls: 'vertical-middle',
                    width: 150
                },
                multiSelect: true,

                columns: [
                    {
                        xtype: 'actioncolumn',
                        itemId: 'actioncolumn',
                        sortable: false,
                        resizable: false,
                        width: 70,
                        menuDisabled: true,
                        items: [
                            {
                                iconCls: 'icon_edit icon_margin',
                                itemId: 'actionedit',
                                tooltip: i18n.getKey('edit') + i18n.getKey('imageIntegrationConfig'),
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    controller.editImageIntegrationConfigs(record.data, store, 'modify', me.productConfigDesignId, me.productBomConfigId, 'V2');
                                }
                            },
                            {
                                iconCls: 'icon_remove icon_margin',
                                itemId: 'actionedit',
                                tooltip: i18n.getKey('delete') + i18n.getKey('imageIntegrationConfig'),
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    controller.deleteImageIntegrationConfigs(record.getId(), store);
                                }
                            }
                        ]
                    },

                    {
                        dataIndex: '_id',
                        text: i18n.getKey('id'),
                        itemId: '_id',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'productMaterialViewTypeId',
                        text: i18n.getKey('productMaterialViewTypeId'),
                        width: 200,
                        itemId: 'productMaterialViewTypeId',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'productMaterialViewType',
                        text: i18n.getKey('productMaterialViewType'),
                        width: 200,
                        itemId: 'productMaterialViewType',
                        renderer: function (value, metadata) {
                            var displayValue=Ext.String.format('{0}({1})', value.name,value._id)
                            metadata.tdAttr = 'data-qtip="' + displayValue + '"';
                            return displayValue;
                        }
                    },
                    {
                        dataIndex: 'productConfigDesignId',
                        text: i18n.getKey('productConfigDesignId'),
                        itemId: 'productConfigDesignId',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'pageContentEffectConfigs',
                        flex: 1,
                        text: i18n.getKey('image'),
                        itemId: 'pageContentEffectConfigs',
                        renderer: function (value, metadata) {
                            var str = '';
                            for (var i = 0; i < value.length; i++) {
                                str += value[i].effect + ':' + value[i]['imagePageContentPaths'].join(' | ') + '<br>'
                            }
                            metadata.tdAttr = 'data-qtip="' + str + '"';
                            return str;
                        }
                    },
                    {
                        dataIndex: 'side',
                        text: i18n.getKey('side'),
                        itemId: 'side',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'ratioOffset',
                        text: i18n.getKey('ratioOffset'),
                        itemId: 'ratioOffset',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'minHeight',
                        text: i18n.getKey('minHeight') + '(' + i18n.getKey('piexl') + ')',
                        itemId: 'minHeight',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'minWidth',
                        text: i18n.getKey('minWidth') + '(' + i18n.getKey('piexl') + ')',
                        itemId: 'minWidth',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    }
                ],
            },
            filterCfg: {
                header: false,
                defaults: {
                    width: 280
                },
                items: [
                    {
                        name: '_id',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('id'),
                        itemId: '_id',
                        isLike: false//设置是否可以模糊查找
                    },
                    {
                        name: 'productConfigDesignId',
                        xtype: 'numberfield',
                        hideTrigger: true,
                        hidden: true,
                        value: me.productConfigDesignId,
                        fieldLabel: i18n.getKey('productConfigDesignId'),
                        itemId: 'productConfigDesignId'
                    },
                    {
                        name: 'side',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('side'),
                        itemId: 'side',
                        isLike: false
                    },
                    {
                        name: 'productMaterialViewTypeId',
                        xtype: 'textfield',
                        hideTrigger: true,
                        fieldLabel: i18n.getKey('productMaterialViewTypeId'),
                        itemId: 'productMaterialViewTypeId'
                    }
                ]
            },
            listeners: {
                afterrender: function () {
                    var page = this;
                    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                    var productId = builderConfigTab.productId;
                    var isLock = JSCheckProductIsLock(productId);
                    if (isLock) {
                        JSLockConfig(page);
                    }
                }
            }
        });
        me.items = [grid];
        me.callParent(arguments);
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
});