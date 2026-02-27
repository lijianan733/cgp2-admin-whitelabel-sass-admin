Ext.onReady(function () {


    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var store = Ext.create('CGP.product.view.productconfig.productimpositionconfig.store.ProductImpositionCfgStore', {
        /*params: {
            filter : '[{"name":"builderConfig.id","value":'+builderConfigTab.builderConfigId+',"type":"number"}]'
        }*/
    });
    var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};

    var page = Ext.create('Ext.ux.ui.GridPage', {
            i18nblock: i18n.getKey('builderImpositionConfig'),
            block: 'product',
            // 编辑页面
            editPage: 'builderimpositioncfgedit.html',
            height: '100%',
            tbarCfg: {
                disabledButtons: ['delete'],
                btnCreate: {
                    handler: function () {
                        builderConfigTab.addBuilderImpositionCfgEditTab(null, i18n.getKey('productImpositionCfg'));
                    }
                },
            },
            listeners: {
                afterload: function (p) {
                    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
                    var url = 'api/productConfigImpositions/';
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
                editActionHandler: showTabEdit,
                deleteAction: false,
                bodyStyle: 'overflow-x:hidden;',
                columnWidth: 150,
                columns: [
                    {
                        sortable: false,
                        text: i18n.getKey('operation'),
                        width: 120,
                        xtype: 'componentcolumn',
                        renderer: function (value, metadata, record) {
                            return {
                                xtype: 'button',
                                ui: 'default-toolbar-small',
                                height: 26,
                                text: i18n.getKey('options'),
                                width: '100%',
                                flex: 1,
                                menu: [
                                    {
                                        text: i18n.getKey('排版配置'),
                                        disabledCls: 'menu-item-display-none',
                                        handler: function () {
                                            var productBomConfigIdDatas = record.get('bomCompatibilities');
                                            var productBomConfigId = null;
                                            //如果imposition配置是正式，则找最新的正式
                                            //如果imposition是测试，则找最新的非草稿的那条
                                            /* for (var i = 0; i < productBomConfigIdDatas.length; i++) {
                                                 var item = productBomConfigIdDatas[i];

                                             }*/
                                            productBomConfigId = productBomConfigIdDatas[productBomConfigIdDatas.length - 1].id;
                                            builderConfigTab.compositionConfig(record.getId(), productBomConfigId, builderConfigTab.productId, false, record.get('userParams')?._id ?? 0);
                                        }
                                    },
                                    {
                                        text: i18n.getKey('缩略图配置'),
                                        disabledCls: 'menu-item-display-none',
                                        handler: function () {
                                            var productBomConfigIdDatas = record.get('bomCompatibilities');
                                            var productBomConfigId = null;
                                            productBomConfigId = productBomConfigIdDatas[productBomConfigIdDatas.length - 1].id;
                                            builderConfigTab.compositionConfig(record.getId(), productBomConfigId, builderConfigTab.productId, true);
                                        }
                                    },
                                    {
                                        text: i18n.getKey('base') + i18n.getKey('config'),
                                        disabledCls: 'menu-item-display-none',
                                        handler: function (btn) {
                                            builderConfigTab.setBaseConifg(record.getId());
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
                    }
                    ,
                    {
                        text: i18n.getKey('status'),
                        dataIndex: 'status',
                        renderer: function (value, metaData, record) {
                            return status[value];
                        }
                    }
                    ,
                    {
                        text: i18n.getKey('bomType'),
                        dataIndex: 'bomType',
                        itemId: 'bomType'
                    }
                    ,
                    {
                        text: i18n.getKey('configVersion'),
                        dataIndex: 'configVersion',
                        itemId: 'configVersion'
                    }
                    ,
                    {
                        text: i18n.getKey('configValue'),
                        dataIndex: 'configValue',
                        itemId: 'configValue'
                    }
                    ,
                    {
                        text: i18n.getKey('bomVersions'),
                        dataIndex: 'bomCompatibilities',
                        xtype: 'arraycolumn',
                        sortable: false,
                        lineNumber: 5,
                        flex: 1,
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
                items:
                    [{
                        name: 'id',
                        xtype: 'numberfield',
                        hideTrigger: true,
                        fieldLabel: i18n.getKey('id'),
                        itemId: 'id'
                    }, {
                        name: "configVersion",
                        xtype: "numberfield",
                        fieldLabel: i18n.getKey('configVersion'),
                        itemId: 'configVersion'
                    }, {
                        name: "status",
                        xtype: "combo",
                        store: Ext.create('Ext.data.Store', {
                            fields: [{name: 'name', type: 'string'}, {name: 'value', type: 'int'}],
                            data: [{name: '草稿', value: 1}, {name: '测试', value: 2}, {name: '上线', value: 3}]
                        }),
                        fieldLabel: i18n.getKey('status'),
                        displayField: 'name',
                        valueField: 'value',
                        queryMode: 'local',
                        itemId: 'status'
                    }, {
                        name: "productConfigId",
                        xtype: "numberfield",
                        hidden: true,
                        fieldLabel: i18n.getKey('productConfigId'),
                        value: builderConfigTab.productConfigId,
                        itemId: 'builderConfigId'
                    }, {
                        name: "bomType",
                        xtype: "combo",
                        fieldLabel: i18n.getKey('bomType'),
                        itemId: 'bomType',
                        editable: false,
                        store: Ext.create('CGP.product.view.productconfig.productbomconfig.store.BomTypeStore'),
                        displayField: 'code',
                        valueField: 'code'
                    }]
            }
        })
    ;


    function showTabEdit(gridview, recordIndex, cellIndex, fun, button, record) {
        var id = record.getId();
        builderConfigTab.addBuilderImpositionCfgEditTab(id, i18n.getKey('productImpositionCfg'));
    }


});
