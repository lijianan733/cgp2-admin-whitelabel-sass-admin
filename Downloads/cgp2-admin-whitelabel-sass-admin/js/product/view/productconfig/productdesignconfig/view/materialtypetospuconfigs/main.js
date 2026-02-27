Ext.Loader.syncRequire(['CGP.product.view.productconfig.productdesignconfig.store.MTViewTypeObj','CGP.product.view.productconfig.productdesignconfig.model.MaterialViewType']);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.materialtypetospuconfigs.main', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    modal: true,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('productMaterialViewType');
        me.productConfigDesignId = parseInt(me.getQueryString('productConfigDesignId'));
        me.productBomConfigId = parseInt(me.getQueryString('productBomConfigId'));
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.materialtypetospuconfigs.store.Store',{
            productConfigDesignId: me.productConfigDesignId
        });
        var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
        var grid = Ext.create('CGP.common.commoncomp.QueryGrid', {
            header: false,
            region: 'center',
            gridCfg: {
                editAction: false,
                deleteAction: false,
                selType: 'rowmodel',
                store: store,
                tbar: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_create',
                        handler: function () {
                            controller.editMaterialTypeToSpuConfig(null,store,'new',me.productConfigDesignId,me.productBomConfigId);
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
                        menuDisabled: true,
                        items: [
                            {
                                iconCls: 'icon_edit icon_margin',
                                itemId: 'actionedit',
                                tooltip: i18n.getKey('edit') + i18n.getKey('productMaterialViewType'),
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    controller.editMaterialTypeToSpuConfig(record.data,store,'modify',me.productConfigDesignId,me.productBomConfigId);
                                }
                            },
                            {
                                iconCls: 'icon_remove icon_margin',
                                itemId: 'actionedit',
                                tooltip: i18n.getKey('delete') + i18n.getKey('productMaterialViewType'),
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    controller.deleteMaterialTypeToSpuConfig(record.getId(), store);
                                }
                            }
                        ]},
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
                        dataIndex: 'materialPath',
                        text: i18n.getKey('materialPath'),
                        width: 200,
                        itemId: 'materialPath',
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'spuRtObjectFillConfigs',
                        text: i18n.getKey('spuRtObjectFillConfigs'),
                        width: 180,
                        xtype: 'arraycolumn',
                        itemId: 'spuRtObjectFillConfigs',
                        renderer: function (value, metadata) {
                            return value.path;
                        }
                    },{
                        dataIndex: 'bomItemToFixedConfigs',
                        text: i18n.getKey('bomItemToFixedConfigs'),
                        width: 180,
                        xtype: 'componentcolumn',
                        itemId: 'bomItemToFixedConfigs',
                        renderer: function (value, metadata) {
                            if(Ext.isEmpty(value)){
                                return;
                            }
                            var valueString = JSON.stringify(value,null,"\t");
                            return new Ext.button.Button({
                                text: '<div>' + i18n.getKey('check') + '</div>',
                                frame: false,
                                width: 100,
                                tooltip: i18n.getKey('check') + i18n.getKey('bomItemToFixedConfigs'),
                                baseCls: 'uxGridBtn',
                                style: {
                                    background: '#F5F5F5'
                                },
                                handler: function (comp) {
                                    var win = Ext.create("Ext.window.Window", {
                                        id: "bomItemToFixedConfigs",
                                        modal: true,
                                        layout: 'fit',
                                        title: i18n.getKey('bomItemToFixedConfigs'),
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
            },
            filterCfg: {
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
                    },
                    {
                        name: 'materialPath',
                        xtype: 'textfield',
                        isLike: false,
                        fieldLabel: i18n.getKey('materialPath'),
                        itemId: 'materialPath'
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