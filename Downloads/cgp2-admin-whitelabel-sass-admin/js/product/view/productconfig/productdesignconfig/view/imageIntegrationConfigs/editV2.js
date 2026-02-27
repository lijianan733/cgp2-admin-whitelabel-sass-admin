/**
 * Created by nan on 2017/12/12.
 */
Ext.Loader.syncRequire(['CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.view.DefinitionTextSet','CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.model.ImageIntegrationConfigsModel', 'CGP.attribute.store.LocalAttributeOption']);
Ext.onReady(function () {
    var recordId = JSGetQueryString('recordId');
    var editOrNew = JSGetQueryString('editOrNew');
    var productBomConfigId=JSGetQueryString('productBomConfigId');
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
    var form = Ext.create('Ext.form.Panel', {
        layout: {
            type: 'table',
            columns: 2
        },
        defaults: {
            margin: 5,
            width: 375,
            labelWidth:100,
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
                listeners:{
                    change:function (comp,newValue,oldValue){
                        var materialPath=newValue[Object.keys(newValue)[0]].materialPath;
                        if(materialPath){
                            var materialPathComp=comp.ownerCt.getComponent('IdPathSelector');
                            materialPathComp.setValue(materialPath);
                        }
                        comp.ownerCt.pmvtId = newValue[Object.keys(newValue)[0]]?._id ?? 0;
                    }
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
            Ext.create('CGP.product.view.productconfig.productdesignconfig.view.imageIntegrationConfigs.view.MaterialPath',{
                itemId: 'IdPathSelector',
                fieldLabel: i18n.getKey('materialPath'),
                labelAlign: 'right',
                name:'materialPath',
                layout: 'hbox',
                hidden: true,
                productBomConfigId:productBomConfigId
            }),
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
                itemId: 'side'
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

    var createImageGrid=function (imageData){
        if(Ext.isEmpty(imageData)){
            imageData = [];
        }
        var optionGrid = {
            selModel: new Ext.selection.RowModel({
                mode: 'MULTI'
            }),

            store: Ext.create('Ext.data.Store', {
                fields: [
                    {name:'clazz',type:'string',defaultValue:'com.qpp.cgp.domain.product.config.ImageIntegrationEffectConfig'},
                    {name: 'imagePageContentPaths', type: 'array'},
                    {name: 'effect', type: 'string'}
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
                                controller.editImageUrl(form.pmvtId, record, store);
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
                    text: i18n.getKey('effect'),
                    width: 200,
                    sortable: false,
                    dataIndex: 'effect'
                },
                {
                    text: i18n.getKey('imagePageContentPaths'),
                    flex: 1,
                    sortable: false,
                    dataIndex: 'imagePageContentPaths',
                    renderer: function (value, metadata, record) {
                        var dispalyValue=value.join(' | ')
                        metadata.tdAttr = 'data-qtip="' + dispalyValue + '"';
                        return dispalyValue;
                    }
                }
            ],
            tbar: [
                {
                    text: i18n.getKey('addOption'),
                    iconCls: 'icon_create',
                    handler: function () {
                        var store = optionGrid.store;
                        controller.editImageUrl(form.pmvtId, null, store);
                    }
                }
            ]

        };
        return Ext.create("Ext.ux.form.GridField", {
            name: 'pageContentEffectConfigs',
            fieldLabel: i18n.getKey('image'),
            itemId: 'pageContentEffectConfigs',
            id: 'pageContentEffectConfigs',
            xtype: 'gridfield',
            gridConfig: optionGrid,
            msgTarget: 'under',
            allowBlank: false,
            colspan: 2
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
                } else if (item.setValue) {
                    if(item.name == 'definition'){
                        item.setValue({
                            dpi: store.getAt(0).get('dpi'),
                            minWidth: store.getAt(0).get('minWidth'),
                            minHeight: store.getAt(0).get('minHeight')
                        })
                    }else{
                        item.setValue(value);
                    }
                }
            }
            var imageData = store.getAt(0).get('pageContentEffectConfigs');
            form.add(createImageGrid(imageData));
        })
    }
    page.add(form);

});
