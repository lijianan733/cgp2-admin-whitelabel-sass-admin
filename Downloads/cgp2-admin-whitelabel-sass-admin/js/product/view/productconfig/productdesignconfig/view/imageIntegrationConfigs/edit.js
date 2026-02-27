/**
 * Created by nan on 2017/12/12.
 */
Ext.Loader.syncRequire(['CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.view.DefinitionTextSet', 'CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.model.ImageIntegrationConfigsModel', 'CGP.attribute.store.LocalAttributeOption']);
Ext.onReady(function () {
    var recordId = JSGetQueryString('recordId');
    var editOrNew = JSGetQueryString('editOrNew');
    var productConfigDesignId = parseInt(JSGetQueryString('productConfigDesignId'));
    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
    var productMaterialViewTypeStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.store.MaterialViewType', {
        params: {
            filter: '[{"name":"productConfigDesignId","value":' + productConfigDesignId + ',"type":"number"}]'
        }
    });
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var store = '';
    var form = Ext.create('Ext.ux.form.ErrorStrickForm', {
        isValidForItems: true,
        layout: {
            type: 'table',
            columns: 2
        },
        defaults: {
            margin: 5,
            width: 375,
            allowBlank: false,
            labelAlign: 'right',
        },
        tbar: [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function () {
                    if (form.isValid()) {
                        controller.saveImageIntegrationConfigs(form, recordId);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('return'),
                iconCls: 'icon_grid',
                handler: function () {
                    var tabpanel = window.parent.Ext.getCmp('builderConfigTab');
                    var manageImageIntegrationConfigsPage = tabpanel.getComponent('manageImageIntegrationConfigs');
                    tabpanel.setActiveTab(manageImageIntegrationConfigsPage);
                }
            }
        ],
        items: [
            {
                xtype: 'numberfield',
                fieldLabel: 'id',
                editable: false,
                hidden: true,
                fieldStyle: 'background-color: silver',
                disabled: (editOrNew == 'modify' ? false : true),
                hideTrigger: true,
                name: '_id',
                itemId: '_id'
            },
            {
                xtype: 'numberfield',
                hideTrigger: true,
                editable: false,
                fieldStyle: 'background-color: silver',
                fieldLabel: i18n.getKey('productConfigDesignId'),
                name: 'productConfigDesignId',
                itemId: 'productConfigDesignId',
                value: productConfigDesignId

            },
            /*{
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('minWidth'),
                minValue: 1,
                name: 'minWidth',
                itemId: 'minWidth'

            },
            {
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('minHeight'),
                minValue: 1,
                name: 'minHeight',
                itemId: 'minHeight'

            },*/
            {
                xtype: 'gridcombo',
                editable: false,
                fieldLabel: i18n.getKey('productMaterialViewTypeId'),
                name: 'productMaterialViewTypeId',
                itemId: 'productMaterialViewTypeId',
                haveReset: true,
                displayField: 'displayName',
                valueField: 'productMaterialViewTypeId',//'productMaterialViewTypeId',
                matchFieldWidth: false,
                store: productMaterialViewTypeStore,
                infoUrl: adminPath + 'api/productMaterialViewTypes?page=1&limit=25&filter=' + Ext.JSON.encode(
                    [
                        {
                            name: "productMaterialViewTypeId",
                            type: "string",
                            value: '%{productMaterialViewTypeId}%'
                        },
                        {
                            name: "productConfigDesignId",
                            type: "number",
                            value: productConfigDesignId
                        }
                    ]
                ),
                gridCfg: {
                    store: productMaterialViewTypeStore,
                    width: 450,
                    maxHeight: 280,
                    columns: [
                        {
                            dataIndex: '_id',
                            text: i18n.getKey('id')
                        }, {
                            dataIndex: 'name',
                            flex: 1,
                            text: i18n.getKey('name')
                        }, {
                            dataIndex: 'productMaterialViewTypeId',
                            flex: 1,
                            text: i18n.getKey('productMaterialViewTypeId')
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: productMaterialViewTypeStore,
                        emptyMsg: i18n.getKey('noData')
                    }),
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setInitialValue([data]);
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    return me.getSubmitValue()[0];

                },
            },
            {
                xtype: 'definitiontextset',
                name: 'definition',
                rowspan: 2,
                title: i18n.getKey('definition') + i18n.getKey('config')
            },
            {
                xtype: 'numberfield',
                minValue: 0,
                step: 0.01,
                fieldLabel: i18n.getKey('ratioOffset'),
                name: 'ratioOffset',
                itemId: 'ratioOffset'
            },
            {
                xtype: 'textfield',
                colspan: 2,
                fieldLabel: i18n.getKey('side'),
                name: 'side',
                itemId: 'side',
                tipInfo: JSTransformHtml('一个标识,用于选定PC和获取到下单数据中同名的图片数据,如：<br>      ' +
                    '<pre> 下单数据= [\n        {\n            "qty": 10,\n          ' +
                    '  "imageProject": {\n                "productId": "sku产品Id",\n         ' +
                    '       "comparisonThumbnail": "图片URL",\n  ' +
                    '              "content": [\n                    {\n                        "side": "定制面位置",\n      ' +
                    '                  "image": "图片URL"\n        ' +
                    '            }\n                ]\n            },\n            "comment": "test",\n      ' +
                    '      "customsUnitPrice": 33.3\n        }\n    ]' +
                    '</pre>')
            }
        ],
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
    var createImageGrid = function (imageData) {
        if (Ext.isEmpty(imageData)) {
            imageData = [];
        }
        var optionGrid = {
            selModel: new Ext.selection.RowModel({
                mode: 'MULTI'
            }),

            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'imageUrl', type: 'string'},
                    {name: 'value', type: 'string'}
                ],
                autoSync: true,
                data: imageData
            }),
            height: 200,
            width: 655,
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    width: 50,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                controller.openEditImageUrlWindow(page, record, store);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                store.remove(record);
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('value'),
                    flex: 1,
                    sortable: false,
                    dataIndex: 'value'

                }
            ],
            tbar: [
                {
                    text: i18n.getKey('addOption'),
                    iconCls: 'icon_create',
                    handler: function () {
                        var store = optionGrid.store;
                        controller.openEditImageUrlWindow(page, null, store);
                    }
                }
            ]

        };
        return Ext.create("Ext.ux.form.GridField", {
            name: 'imagePageContentPaths',
            fieldLabel: i18n.getKey('imagePageContentPaths'),
            itemId: 'imagePageContentPaths',
            id: 'imagePageContentPaths',
            xtype: 'gridfield',
            //labelAlign: 'top',
            gridConfig: optionGrid,
            msgTarget: 'under',
            allowBlank: false
        });
    };
    if (editOrNew == 'new') {
        form.add(createImageGrid([]));
    }
    if (editOrNew == 'modify') {
        store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.store.ImageIntegrationConfigsStore', {
            params: {
                filter: Ext.JSON.encode(
                    [
                        {"name": "_id", "value": recordId, "type": "string"}
                    ]
                )
            }
        });
        store.on('load', function () {
            for (var i = 0; i < form.items.items.length; i++) {
                var name = form.items.items[i].getName();
                var value = store.getAt(0).get(name + '');
                var item = form.items.items[i];
                if (item.diySetValue) {
                    item.diySetValue(value);
                }/*else if(item.name = 'definition'){
                    item.setValue({
                        dpi: store.getAt(0).get('dpi'),
                        minWidth: store.getAt(0).get('minWidth'),
                        maxHeight: store.getAt(0).get('height')
                    })
                }*/ else if (item.setValue) {
                    if (item.name == 'definition') {
                        item.setValue({
                            dpi: store.getAt(0).get('dpi'),
                            minWidth: store.getAt(0).get('minWidth'),
                            minHeight: store.getAt(0).get('minHeight')
                        })
                    } else {
                        item.setValue(value);
                    }

                }
            }
            var imagePageContentPaths = store.getAt(0).get('imagePageContentPaths');
            var imageData = [];
            for (var i = 0; i < imagePageContentPaths.length; i++) {
                var imageDataItem = {imageUrl: '', value: ''};
                imageDataItem.imageUrl = "imageurl" + i;
                imageDataItem.value = imagePageContentPaths[i];
                imageData.push(imageDataItem);
            }

            form.add(createImageGrid(imageData));
        })
    }
    page.add(form);

});
