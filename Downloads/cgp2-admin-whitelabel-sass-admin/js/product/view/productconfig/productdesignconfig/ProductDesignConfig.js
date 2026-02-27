Ext.onReady(function () {


    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
    var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.store.ProductDesignCfgStore', {
        /*params: {
         filter : '[{"name":"builderConfig.id","value":'+builderConfigTab.builderConfigId+',"type":"number"}]'
         }*/
    });
    var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};
    var productId = JSGetQueryString('productId');
    var updateDesignConfig = function (data, callback, mappingVersion, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/productConfigDesigns/' + data.id,
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (responseMessage.success) {
                    callback(mappingVersion);
                    win.close();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    };
    var configurableProductId = builderConfigTab.configurableProductId;
    var productType = builderConfigTab.productType;
    var isSpecialSku = (productType == 'SKU' && Ext.isEmpty(configurableProductId));//是sku且没有父可配置产品
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('productDesignConfig'),
        block: 'product',
        // 编辑页面
        editPage: 'productdesignconfigedit.html',
        height: '100%',
        tbarCfg: {
            disabledButtons: ['delete'],
            btnCreate: {
                handler: function () {
                    builderConfigTab.addProductDesignCfgEditTab(null, i18n.getKey('productDesignConfig'));
                }
            },
        },
        listeners: {
            afterload: function (p) {
                var url = 'api/productConfigDesigns/';
                controller.addSingleProductCopyButton(p, builderConfigTab.productConfigId, url, builderConfigTab.isLock);
            },
            afterrender: function () {
                var page = this;
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        },
        gridCfg: {
            // store是指store.js
            store: store,
            frame: false,
            multiSelect: false,
            selType: 'checkboxmodel',
            selModel: Ext.create("Ext.selection.CheckboxModel", {
                injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                mode: "single",//multi,simple,single；默认为多选multi
                checkOnly: false,//如果值为true，则只用点击checkbox列才能选中此条记录
                allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                enableKeyNav: true,//开启/关闭在网格内的键盘导航。
                showHeaderCheckbox: false,//如果此项为false在复选框列头将不显示.,
                hideHeaders: true,
                headers: ''
            }),
            editActionHandler: showTabEdit,
            deleteAction: false,
            bodyStyle: 'overflow-x:hidden;',
            columnWidth: 250,
            columns: [
                {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {

                        try {
                            var productConfigDesignId = record.get('id');
                            var productBomConfig = record.get('bomCompatibilities');
                            var bomLength = productBomConfig.length;
                            var bomSchemaVersion = parseInt(productBomConfig[bomLength - 1].schemaVersion);
                            var productBomConfigId = productBomConfig[bomLength - 1].id;
                            var mappingVersion = record.get('mappingVersion');
                        } catch (e) {
                            //随便写的数据
                            bomSchemaVersion = 4;
                            productBomConfigId = 0;
                        }
                        return {
                            text: i18n.getKey('options'),
                            width: 100,
                            height: 26,
                            xtype: 'button',
                            ui: 'default-toolbar-small',
                            menu: [
                                // {
                                //     text: i18n.getKey('manageImageIntegrationConfigs'),
                                //     disabledCls: 'menu-item-display-none',
                                //     handler: function () {
                                //         builderConfigTab.managerImageImageIntegrationConfigs(productConfigDesignId, productBomConfigId);
                                //     }
                                // },
                                {
                                    text: i18n.getKey('manageImageIntegrationConfigs'),
                                    disabledCls: 'menu-item-display-none',
                                    menu: [
                                        {
                                            text: i18n.getKey('effectPC'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                var url = path + "partials/product/productconfig/manageImageIntegrationConfigsV2.html?productConfigDesignId=" + productConfigDesignId + '&productBomConfigId=' + productBomConfigId;
                                                builderConfigTab.managerImageImageIntegrationConfigs(productConfigDesignId, productBomConfigId, url, 'effectPC');
                                            }
                                        },
                                        {
                                            text: i18n.getKey('basePC'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                var url = path + "partials/product/productconfig/manageImageIntegrationConfigs.html?productConfigDesignId=" + productConfigDesignId + '&productBomConfigId=' + productBomConfigId;
                                                builderConfigTab.managerImageImageIntegrationConfigs(productConfigDesignId, productBomConfigId, url, 'basePC');
                                            }
                                        },
                                        {
                                            text: i18n.getKey('jsoncustomizeconfig'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                var url = path + "partials/product/productconfig/productdesignconfig/jsoncustomizeconfig/main.html?productConfigDesignId=" + productConfigDesignId + '&productBomConfigId=' + productBomConfigId;
                                                builderConfigTab.managerImageImageIntegrationConfigs(productConfigDesignId, productBomConfigId, url, 'jsonCustomizeConfig');
                                            }
                                        },
                                    ]
                                },

                                {
                                    text: i18n.getKey('pcResourceLibrary'),
                                    handler: function () {
                                        builderConfigTab.manageDesignPCResourceLibrary(productConfigDesignId);
                                    }
                                },
                                {
                                    text: i18n.getKey('materialTypeToSpuConfigs'),
                                    disabledCls: 'menu-item-display-none',
                                    hidden: bomSchemaVersion > 4,
                                    handler: function () {
                                        builderConfigTab.managerMaterialTypeToSpuConfigs(productConfigDesignId, productBomConfigId);
                                    }
                                },
                                {
                                    text: i18n.getKey('manager') + i18n.getKey('materialMappings'),
                                    disabled: isSpecialSku,
                                    menu: [
                                        {
                                            text: i18n.getKey('组件化配置materialMapping'),
                                            hidden: bomSchemaVersion < 5 || mappingVersion == 1,//版本才有这个配置
                                            handler: function () {
                                                var mappingVersion = record.get('mappingVersion');
                                                if (Ext.isEmpty(mappingVersion)) {
                                                    Ext.Msg.confirm(i18n.getKey('prompt'), '是否选定mappingVersion为：2,以便组件化创建materialMapping?', function (selector) {
                                                        if (selector == 'yes') {
                                                            var recordData = record.data;
                                                            recordData.mappingVersion = '2';
                                                            Ext.Ajax.request({
                                                                url: adminPath + 'api/productConfigDesigns/' + recordData.id,
                                                                method: 'PUT',
                                                                async: false,
                                                                jsonData: recordData,
                                                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                                                success: function (res) {
                                                                    var responseMessage = Ext.JSON.decode(res.responseText);
                                                                    if (responseMessage.success) {
                                                                    } else {
                                                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                                    }
                                                                },
                                                                failure: function (resp) {
                                                                    var response = Ext.JSON.decode(resp.responseText);
                                                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                                                }
                                                            });
                                                            record.store.load({
                                                                callback: function () {
                                                                    builderConfigTab.managerMaterialMappingConfigV3(productConfigDesignId, productBomConfigId, productId, productBomConfig);
                                                                }
                                                            });
                                                        }
                                                    })
                                                } else {
                                                    builderConfigTab.managerMaterialMappingConfigV3(productConfigDesignId, productBomConfigId, productId, productBomConfig);
                                                }
                                            }
                                        },
                                        {
                                            text: i18n.getKey('materialMapping'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                var mappingVersion = record.get('mappingVersion');
                                                var dealDiffVersionMpping = function (version) {
                                                    if (version == 1) {
                                                        builderConfigTab.managerMaterialMappings(productConfigDesignId, productBomConfigId);
                                                    } else {
                                                        builderConfigTab.managerMaterialMappingConfigsV2(productConfigDesignId, productBomConfigId);
                                                    }
                                                };
                                                if (Ext.isEmpty(mappingVersion)) {
                                                    Ext.create('Ext.window.Window', {
                                                        id: "mappingVersion",
                                                        modal: true,
                                                        defaultType: 'radio', // each item will be a radio button
                                                        width: 450,
                                                        height: 150,
                                                        title: i18n.getKey('check') + i18n.getKey('mappingVersion'),
                                                        items: [
                                                            {
                                                                xtype: 'radiogroup',
                                                                fieldLabel: 'mappingVersion',
                                                                padding: 15,
                                                                // Arrange radio buttons into two columns, distributed vertically
                                                                columns: 2,
                                                                columnWidth: 80,
                                                                itemId: 'mappingVersion',
                                                                vertical: true,
                                                                items: [
                                                                    {
                                                                        width: 80,
                                                                        boxLabel: '版本一',
                                                                        name: 'mappingVersion',
                                                                        inputValue: '1',
                                                                        checked: true
                                                                    },
                                                                    {
                                                                        width: 80,
                                                                        boxLabel: '版本二',
                                                                        name: 'mappingVersion',
                                                                        inputValue: '2'
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        bbar: ['->', {
                                                            text: i18n.getKey('confirm'),
                                                            iconCls: 'icon_agree',
                                                            handler: function () {
                                                                var win = this.ownerCt.ownerCt;
                                                                var resultMappingVersion = win.getComponent('mappingVersion').getValue().mappingVersion;
                                                                var recordData = record.data;
                                                                recordData.mappingVersion = resultMappingVersion;
                                                                updateDesignConfig(recordData, dealDiffVersionMpping, resultMappingVersion, win);
                                                            }
                                                        }, {
                                                            text: i18n.getKey('cancel'),
                                                            iconCls: 'icon_cancel',
                                                            handler: function () {
                                                                var win = this.ownerCt.ownerCt;
                                                                win.close();
                                                            }
                                                        }]
                                                    }).show();
                                                } else {
                                                    dealDiffVersionMpping(mappingVersion);
                                                }
                                            },
                                        },
                                    ]
                                },
                                {
                                    text: i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type') + i18n.getKey('manager'),
                                    menu: [
                                        {
                                            text: i18n.getKey('simplifyBom') + i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type') + '(' + i18n.getKey('bom') + ')',
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                builderConfigTab.manageSimplifyBomNode(productConfigDesignId, productBomConfigId);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('simplifyBom') + i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type') + '(' + i18n.getKey('grid') + ')',
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                builderConfigTab.managerSimplifyBomConfig(productConfigDesignId, productBomConfigId);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('product') + i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type') + '(' + i18n.getKey('bom') + ')',
                                            disabledCls: 'menu-item-display-none',
                                            handler: function (btn) {
                                                builderConfigTab.managerSbomProductMaterialViewType(productConfigDesignId, productBomConfigId, null, null, btn.text);
                                            }
                                        }, {
                                            text: i18n.getKey('product') + i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type') + '(' + i18n.getKey('grid') + ')',
                                            disabledCls: 'menu-item-display-none',
                                            handler: function (btn) {
                                                builderConfigTab.managerProductMaterialViewType(productConfigDesignId, productBomConfigId, productId, null, btn.text);
                                            }
                                        }
                                    ]
                                },
                                {
                                    text: 'pc' + i18n.getKey('preprocess'),
                                    menu: [
                                        {
                                            text: i18n.getKey('sourceConfig'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                builderConfigTab.manageSourceConfig(productConfigDesignId, productBomConfigId, productId);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('preProcessConfig'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                builderConfigTab.manageMaterialViewTypePreProcessConfig(productConfigDesignId, productId, productBomConfigId);
                                            }
                                        }
                                    ]
                                },
                                {
                                    text: '非SKU属性值映射',
                                    handler: function () {
                                        builderConfigTab.addNewTab({
                                            id: 'propertySimplifyConfig',
                                            url: path + 'partials/product/productconfig/productdesignconfig/propertysimplifyconfig/main.html' +
                                                '?productConfigDesignId=' + record.getId(),
                                            title: i18n.getKey('非SKU属性值映射'),
                                            refresh: true
                                        })
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    itemId: 'id',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('status'),
                    dataIndex: 'status',
                    itemId: 'status',
                    renderer: function (value, metaData, record) {
                        return status[value];
                    }
                },
                {
                    text: i18n.getKey('configVersion'),
                    dataIndex: 'configVersion',
                    itemId: 'configVersion'
                },
                {
                    text: i18n.getKey('material') + i18n.getKey('mappingVersion'),
                    dataIndex: 'mappingVersion',
                    width: 200,
                    itemId: 'mappingVersion'
                },
                {
                    text: i18n.getKey('configValue'),
                    dataIndex: 'configValue',
                    width: 200,
                    itemId: 'configValue'
                },
                {
                    text: i18n.getKey('bomVersions'),
                    dataIndex: 'bomCompatibilities',
                    xtype: 'arraycolumn',
                    minWidth: 200,
                    flex: 1,
                    sortable: false,
                    lineNumber: 5,
                    itemId: 'bomVersions'
                }
            ],
            listeners: {
                viewready: function (view) {
                    document.querySelectorAll(".x-column-header-inner")[0].parentNode.removeChild(document.querySelectorAll(".x-column-header-inner")[0])
                }
            }
        },
        filterCfg: {
            header: false,
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: "configVersion",
                    xtype: "numberfield",
                    isLike: false,
                    fieldLabel: i18n.getKey('configVersion'),
                    itemId: 'configVersion'
                },
                {
                    name: "status",
                    xtype: "combo",
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'value', type: 'int'}
                        ],
                        data: [
                            {name: '草稿', value: 1},
                            {name: '测试', value: 2},
                            {name: '上线', value: 3}
                        ]
                    }),
                    fieldLabel: i18n.getKey('status'),
                    displayField: 'name',
                    valueField: 'value',
                    queryMode: 'local',
                    itemId: 'status'
                },
                {
                    name: "productConfigId",
                    xtype: "numberfield",
                    hidden: true,
                    fieldLabel: i18n.getKey('productConfigId'),
                    value: builderConfigTab.productConfigId,
                    itemId: 'builderConfigId'
                }
            ]
        }
    });


    function showTabEdit(gridview, recordIndex, cellIndex, fun, button, record) {
        var id = record.getId();
        builderConfigTab.addProductDesignCfgEditTab(id, i18n.getKey('productDesignConfig'));
    }


});
