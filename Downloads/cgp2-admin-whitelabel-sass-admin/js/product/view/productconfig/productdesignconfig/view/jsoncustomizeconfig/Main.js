/**
 * Created by nan on 2017/12/12.
 */
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'border'
    })
    var productConfigDesignId = parseInt(JSGetQueryString('productConfigDesignId'));
    var productBomConfigId = parseInt(JSGetQueryString('productBomConfigId'));
    var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.jsoncustomizeconfig.store.JsonCustomize', {
        params: {
            filter: '[{"name":"productConfigDesignId","value":' + productConfigDesignId + ',"type":"number"}]'
        }
    });
    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.controller.Controller');
    var JsoncustomizeController = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.jsoncustomizeconfig.controller.Jsoncustomizeconfig');
    var grid = Ext.create('CGP.common.commoncomp.QueryGrid', {
        header: false,
        region: 'center',
        itemId: 'jsonCustomizeConfigGrid',
        gridCfg: {
            editAction: false,
            deleteAction: false,
            selType: 'checkboxmodel',
            store: store,
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_create',
                    handler: function () {
                        controller.editJsonCustomize(null, store, 'new', productConfigDesignId, productBomConfigId);
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('copy'),
                    iconCls: 'icon_copy',
                    handler: function (btn) {
                        JsoncustomizeController.copyHandler(grid.grid);
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
                                controller.editJsonCustomize(record.data, store, 'modify', productConfigDesignId, productBomConfigId);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionedit',
                            tooltip: i18n.getKey('delete') + i18n.getKey('imageIntegrationConfig'),
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                controller.deleteJsonCustomize(record.getId(), store);
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
                    dataIndex: 'productConfigDesignId',
                    text: i18n.getKey('productConfigDesignId'),
                    itemId: 'productConfigDesignId',
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
                        var displayValue = Ext.String.format('{0}({1})', value.name, value._id)
                        metadata.tdAttr = 'data-qtip="' + displayValue + '"';
                        return displayValue;
                    }
                },
                {
                    xtype: 'componentcolumn',
                    dataIndex: 'operatorConfigId',
                    text: i18n.getKey('operatorConfigId'),
                    itemId: 'operatorConfigId',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-taxRule" style="color: blue">' + value + '</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = display.getEl().down('a');
                                    clickElement.addListener('click', function () {
                                        JSOpen({
                                            id: 'operator' + '_edit',
                                            url: path + "partials/pcoperatormanage/bpmn.html?clazzId=" + value + '&createOrEdit=edit',
                                            title: i18n.getKey('operatorConfig') + i18n.getKey('edit') + '(' + value + ')',
                                            refresh: true
                                        });
                                    }, false);

                                }
                            }
                        }
                    }
                },
                {
                    dataIndex: 'designDataTypeSchema',
                    text: i18n.getKey('designDataTypeSchema'),
                    itemId: 'designDataTypeSchema',
                    flex: 1,
                    renderer: function (value, metadata) {
                        if (value?._id) {
                            var strValue = value?.name ?? '' + '<' + value?._id + '>';
                            metadata.tdAttr = 'data-qtip="' + strValue + '"';
                            return strValue;
                        } else {
                            return '';
                        }
                    }
                },
                {
                    dataIndex: 'designDataJsonSchema',
                    text: i18n.getKey('designDataJsonSchema'),
                    itemId: 'designDataJsonSchema',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value ?? '';
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
                    value: productConfigDesignId,
                    fieldLabel: i18n.getKey('productConfigDesignId'),
                    itemId: 'productConfigDesignId'
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
    page.add(grid);

});