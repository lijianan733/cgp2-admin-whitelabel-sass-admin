Ext.onReady(function () {


    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var store = Ext.create('CGP.product.view.productconfig.productbomconfig.store.ProductBomConfigStore', {
        /*params: {
         filter : '[{"name":"builderConfig.id","value":'+builderConfigTab.builderConfigId+',"type":"number"}]'
         }*/
    });
    /*store.filter([
     {filterFn: function(item) { return item.get("status") != 0; }}
     ]);*/
    var productId = builderConfigTab.productId;
    var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};
    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('builderBomConfig'),
        block: 'product',
        // 编辑页面
        editPage: 'builderbomconfigedit.html',
        height: '100%',
        listeners: {
            afterload: function (p) {
                var url = 'api/productConfigBoms/';
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
        tbarCfg: {
            disabledButtons: ['delete'],
            btnCreate: {
                handler: function () {
                    builderConfigTab.addBuilderBomConfigEditTab(null, i18n.getKey('productBomConfig'));
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
            bodyStyle: 'overflow-x:hidden;',
            deleteAction: false,
            columnWidth: 150,
            columnDefaults: {
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    itemId: 'id',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('operation'),
                    dataIndex: 'productMaterialId',
                    width: 180,
                    xtype: 'componentcolumn',
                    itemId: 'productBomPrintConfig',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('productComponentConfig');
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="color: blue" )>' + i18n.getKey('check') + i18n.getKey('productComponentConfig') + ' </a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        builderConfigTab.productBomPrintConfig(productId, record.getId(), value);
                                    });
                                }
                            }
                        };
                    }
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
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    itemId: 'type'
                },
                {
                    text: i18n.getKey('configVersion'),
                    dataIndex: 'configVersion',
                    itemId: 'configVersion'
                },
                {
                    text: i18n.getKey('configValue'),
                    dataIndex: 'configValue',
                    itemId: 'configValue'
                },
                {
                    text: i18n.getKey('builderContext'),
                    dataIndex: 'context',
                    width: 110,
                    itemId: 'context'
                },
                {
                    text: i18n.getKey('schemaVersion'),
                    dataIndex: 'schemaVersion',
                    width: 110,
                    itemId: 'schemaVersion'
                },
                {
                    text: i18n.getKey('productMaterialId'),
                    dataIndex: 'productMaterialId',
                    minWidth: 110,
                    flex: 1,
                    xtype: 'componentcolumn',
                    itemId: 'productMaterialId',
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('materialInfo');
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="color: blue" )>' + value + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        controller.checkMaterial(value);
                                    });
                                }
                            }
                        }
                    }
                }
            ],
            listeners: {
                viewready: function (view) {//当表格视图可用时触发(使用此事件来选择默认的行)。

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
                    name: "type",
                    xtype: "combo",
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    editable: false,
                    store: Ext.create('CGP.product.view.productconfig.productbomconfig.store.BomTypeStore'),
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
        builderConfigTab.addBuilderBomConfigEditTab(id, i18n.getKey('productBomConfig'));
    }


});