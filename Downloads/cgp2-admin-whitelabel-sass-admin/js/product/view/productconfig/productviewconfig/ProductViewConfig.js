Ext.onReady(function () {


    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var store = Ext.create('CGP.product.view.productconfig.productviewconfig.store.ProductViewCfgStore', {
        /*params: {
         filter : '[{"name":"builderConfig.id","value":'+builderConfigTab.builderConfigId+',"type":"number"}]'
         }*/
    });
    var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};
    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
    var localController = Ext.create('CGP.product.view.productconfig.productviewconfig.controller.Controller');
    var isLock = builderConfigTab.isLock;
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('builderViewConfig'),
        block: 'product',
        // 编辑页面
        editPage: 'builderimpositioncfgedit.html',
        height: '100%',
        tbarCfg: {
            disabledButtons: ['delete'],
            btnCreate: {
                handler: function () {
                    builderConfigTab.addBuilderViewCfgEditTab(null, i18n.getKey('productViewCfg'));
                }
            },
        },
        listeners: {
            afterload: function (p) {
                var url = 'api/productConfigViews/';
                controller.addSingleProductCopyButton(p, builderConfigTab.productConfigId, url);
            },
            afterrender: function () {
                var page = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
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
                hideHeaders: true
            }),
            columnDefaults: {
                tdCls: 'vertical-middle'
            },
            editActionHandler: showTabEdit,
            bodyStyle: 'overflow-x:hidden;',
            deleteAction: false,
            columnWidth: 150,
            columns: [
                /*        {
                 text: i18n.getKey('operator'),
                 width : 120,
                 xtype : "componentcolumn",
                 renderer: function (value, metadata, record) {
                 return {
                 xtype : 'displayfield',
                 value : '<a href="#")>'+i18n.getKey('manager')+i18n.getKey('builderConfig')+'</a>',
                 listeners : {
                 render : function(display){
                 display.getEl().on("click",function(){
                 var productViewConfig = record.getId();
                 var builderConfigId = record.get('builderConfig')._id;
                 builderConfigTab.managerBuilderConfig(builderConfigId,productViewConfig);
                 });
                 }
                 }
                 };
                 }
                 },*/
                {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 120,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var productViewConfig = record.getId();
                        var builderConfigId = '';
                        var builderLocations = [];
                        var builderViewVersion = record.get('builderViewVersion');
                        if (!Ext.isEmpty(record.get('builderConfig'))) {
                            var builderConfig = record.get('builderConfig');
                            builderConfigId = builderConfig._id;
                            builderLocations = builderConfig.builderLocations;
                        }
                        return {
                            xtype: 'button',
                            ui: 'default-toolbar-small',
                            height: 26,
                            text: i18n.getKey('options'),
                            width: '100%',
                            flex: 1,
                            menu: [
                                {
                                    text: i18n.getKey('manager') + i18n.getKey('viewConfig'),
                                    disabledCls: 'menu-item-display-none',
                                    hidden: builderViewVersion == 'V3',
                                    handler: function () {
                                        localController.managerViewConfig(builderConfigId, productViewConfig, builderConfigTab);
                                    }
                                },

                                {
                                    text: i18n.getKey('manager') + i18n.getKey('wizardConfig'),
                                    disabledCls: 'menu-item-display-none',
                                    hidden: builderViewVersion == 'V3',
                                    handler: function () {
                                        localController.editWizardConfigWindow(builderConfigId, productViewConfig, builderConfigTab);
                                    }
                                },
                                {
                                    text: i18n.getKey('manager') + i18n.getKey('builderConfig'),
                                    disabledCls: 'menu-item-display-none',
                                    menu: [
                                        {
                                            text: i18n.getKey('builderConfig') + '(弃用)',
                                            hidden: Ext.isEmpty(builderConfigId),//以前有配置改项，现在就还可以配置，但是以前没有配置，现在就不允许配置了
                                            handler: function () {
                                                builderConfigTab.managerBuilderConfig(builderConfigId, productViewConfig);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('builderConfig') + i18n.getKey('V2'),
                                            handler: function () {
                                                var builderViewVersion = record.get('builderViewVersion');
                                                builderConfigTab.beforeManagerBuilderConfigV2(builderConfigId, productViewConfig, builderViewVersion);
                                            }
                                        }
                                    ]
                                },

                                {
                                    text: i18n.getKey('manager') + i18n.getKey('builderViewConfig'),
                                    menu: [
                                        {
                                            text: i18n.getKey('JSON数据配置V2'),
                                            hidden: builderViewVersion == 'V3',
                                            handler: function (btn) {
                                                var viewConfigController = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.controller.Controller');
                                                viewConfigController.editViewConfigByJSON(productViewConfig, isLock);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('视图界面配置V2'),
                                            hidden: builderViewVersion == 'V3',
                                            handler: function (btn) {
                                                var navigationV2Controller = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV2.controller.Controller');
                                                var navigationDTOConfig = navigationV2Controller.getNavigationDTOConfig(productViewConfig, false);
                                                if (navigationDTOConfig) {
                                                    builderConfigTab.managerBuilderViewConfig(navigationDTOConfig._id, productViewConfig);
                                                } else {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('需先配置导航配置数据'));
                                                }
                                            }
                                        },
                                        {
                                            text: i18n.getKey('JSON数据配置V3'),
                                            hidden: !(builderViewVersion == 'V3'),
                                            handler: function (btn) {
                                                var viewConfigController = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.controller.Controller');
                                                viewConfigController.editViewConfigByJSON(productViewConfig, isLock);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('视图界面配置V3'),
                                            hidden: !(builderViewVersion == 'V3'),
                                            handler: function (btn) {
                                                var navigationV3Controller = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV3.controller.Controller');
                                                var navigationDTOConfig = navigationV3Controller.getNavigationDTOConfig(productViewConfig, false);
                                                if (navigationDTOConfig) {
                                                    builderConfigTab.managerBuilderViewV3Config(navigationDTOConfig._id, productViewConfig);
                                                } else {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('需先配置导航配置数据'));
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    text: i18n.getKey('manager') + i18n.getKey('navigation') + i18n.getKey('config'),
                                    disabledCls: 'menu-item-display-none',
                                    menu: [
                                        {
                                            text: i18n.getKey('JSON数据配置V2'),
                                            hidden: builderViewVersion == 'V3',
                                            handler: function (btn) {
                                                var navigationV2Controller = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV2.controller.Controller');
                                                navigationV2Controller.editNavigationConfigByJSON(productViewConfig, isLock);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('视图界面配置V2'),
                                            hidden: builderViewVersion == 'V3',
                                            handler: function (btn) {
                                                var navigationV2Controller = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV2.controller.Controller');
                                                navigationV2Controller.checkHaveNavigation(productViewConfig, builderConfigTab)
                                            }
                                        },
                                        {
                                            text: i18n.getKey('JSON数据配置V3'),
                                            hidden: !(builderViewVersion == 'V3'),
                                            handler: function (btn) {
                                                var navigationV2ControllerV3 = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV3.controller.Controller');
                                                navigationV2ControllerV3.editNavigationConfigByJSON(productViewConfig, isLock);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('视图界面配置V3'),
                                            hidden: !(builderViewVersion == 'V3'),
                                            handler: function (btn) {
                                                var navigationV3Controller = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV3.controller.Controller');
                                                navigationV3Controller.checkHaveNavigationV3(productViewConfig, builderConfigTab)
                                            }
                                        }
                                    ]
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
                    text: i18n.getKey('bomType'),
                    dataIndex: 'bomType',
                    itemId: 'bomType'
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    itemId: 'type'
                },
                {
                    text: i18n.getKey('builderView Version'),
                    dataIndex: 'builderViewVersion',
                    itemId: 'builderViewVersion',
                    width: 150
                },
                {
                    text: i18n.getKey('configVersion'),
                    dataIndex: 'configVersion',
                    itemId: 'configVersion',
                },
                {
                    text: i18n.getKey('builderContext'),
                    dataIndex: 'context',
                    width: 120,
                    itemId: 'context'
                },
                {
                    text: i18n.getKey('configValue'),
                    dataIndex: 'configValue',
                    itemId: 'configValue',
                    xtype: 'atagcolumn',
                    getDisplayName: function () {
                        return '<a href="#">' + i18n.getKey('check') + '</a>'
                    },
                    clickHandler: function (value, metadata, record) {
                        Ext.Msg.show({
                            title: i18n.getKey('configValue'),
                            msg: value
                        });
                    }
                },
                {
                    text: i18n.getKey('bomVersions'),
                    dataIndex: 'bomCompatibilities',
                    xtype: 'arraycolumn',
                    width: 120,
                    sortable: false,
                    lineNumber: 5,
                    itemId: 'bomVersions'
                },
                {
                    text: i18n.getKey('viewCompatibilities'),
                    dataIndex: 'viewCompatibilities',
                    xtype: 'arraycolumn',
                    width: 300,
                    sortable: false,
                    lineNumber: 5,
                    itemId: 'viewCompatibilities'
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
                    fieldLabel: i18n.getKey('configVersion'),
                    itemId: 'configVersion'
                },
                {
                    name: 'builderViewVersion',
                    xtype: 'combo',
                    editable: false,
                    fieldLabel: i18n.getKey('builderView Version'),
                    itemId: 'builderViewVersion',
                    store: {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: 'V2', value: 'V2'
                            },
                            {
                                type: 'V3', value: 'V3'
                            }
                        ]
                    },
                    displayField: 'type',
                    valueField: 'value',
                },
                {
                    name: "status",
                    xtype: "combo",
                    editable: false,
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
                },
                {
                    name: "bomType",
                    xtype: "combo",
                    fieldLabel: i18n.getKey('bomType'),
                    editable: false,
                    itemId: 'bomType',
                    store: Ext.create('CGP.product.view.productconfig.productbomconfig.store.BomTypeStore'),
                    displayField: 'code',
                    valueField: 'code'
                },
                {
                    name: "type",
                    xtype: "combo",
                    editable: false,
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    store: Ext.create('CGP.product.view.productconfig.productviewconfig.store.ViewTypeStore'),
                    displayField: 'code',
                    valueField: 'code'
                },
                {
                    name: "context",
                    xtype: "combo",
                    fieldLabel: i18n.getKey('builderContext'),
                    itemId: 'context',
                    editable: false,
                    store: Ext.create('CGP.product.view.productconfig.store.ProductContexts'),
                    displayField: 'code',
                    valueField: 'code'
                }
            ]
        }
    });


    function showTabEdit(gridview, recordIndex, cellIndex, fun, button, record) {
        var id = record.getId();
        builderConfigTab.addBuilderViewCfgEditTab(id, i18n.getKey('productViewCfg'));
    }


});
