Ext.onReady(function () {
    var productId = parseInt(JSGetQueryString('id'));
    var store = Ext.create('CGP.product.view.productattributeconstraint.store.MultiDiscreteValueConstraint', {
        productId: productId
    });


    var mainController = Ext.create('CGP.product.view.productattributeconstraint.controller.Controller');
    var skuAttributeStore = Ext.create('CGP.product.view.productattributeconstraint.store.SkuAttribute', {
        configurableId: productId
    });

    skuAttributeStore.load(function () {
        skuAttributeStore.filter(
            {
                filterFn: function (item) {
                    return !Ext.isEmpty(item.get('options'))
                }
            }
        );
    });


    window.skuAttributeStore = skuAttributeStore;
    var form = Ext.create('CGP.product.view.productattributeconstraint.view.FormToGrid', {
        productId: productId,
        itemsID: 'editForm',
        configurableId: productId,
        itemId: 'formWithPanel',
        saveDisabled: true,
        region: 'center',
        skuAttributeStore: skuAttributeStore,
        editOrNew: 'edit',
        store: store
    });
    var page = Ext.create('Ext.container.Viewport', {
        defaults: {
            split: true,
            hideCollapseTool: true
        },
        bodyPadding: 5,
        layout: 'border',
        items: [
            {
                width: 450,
                region: 'west',
                xtype: 'gridpanel',
                autoScroll: true,
                viewConfig: {
                    enableTextSelection: true,
                },
                itemId: 'constraintGrid',
                id: 'constraintGrid',
                store: store,
                //height: 400,
                columns: [{
                    xtype: 'actioncolumn',
                    tdCls: 'vertical-middle',
                    itemId: 'actioncolumn',
                    width: 60,
                    sortable: false,
                    //resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            width: 30,
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                /*store.removeAt(rowIndex);*/
                                var recordId = store.getAt(rowIndex).getId();
                                var formToGrid = page.getComponent('formWithPanel');
                                Ext.Msg.confirm('提示', '确认删除？', callback);

                                function callback(id) {
                                    if (id == 'yes') {
                                        mainController.deleteProductAttributeConstraint(recordId, store, formToGrid)
                                    }
                                }
                            }
                        }

                    ]
                }, {
                    text: i18n.getKey('id'),
                    width: 80,
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    resizable: false,
                    tdCls: 'vertical-middle',
                    //sortable: true,
                    menuDisabled: true,
                    dataIndex: '_id'
                }, {
                    xtype: 'componentcolumn',
                    itemId: "isActive",
                    width: 100,
                    tdCls: 'vertical-middle',
                    sortable: false,
                    renderer: function (value, metaData, record, rowIndex) {
                        var receiver = record.get('receiver');
                        var id = record.get('id');
                        var enable = record.get('isEnable');
                        var btnName;
                        var isActive;
                        if (enable == true) {
                            return new Ext.toolbar.Toolbar({
                                xtype: 'toolbar',
                                layout: 'column',
                                border: false,
                                style: 'padding:0',
                                items: [{
                                    text: i18n.getKey('enabled'),
                                    width: '100%',
                                    flex: 1,
                                    disabled: true,
                                    handler: function () {

                                    }
                                }]

                            });
                        } else {
                            btnName = i18n.getKey('enable');
                            isActive = true;
                            return new Ext.toolbar.Toolbar({
                                xtype: 'toolbar',
                                layout: 'column',
                                border: false,
                                style: 'padding:0',
                                items: [{
                                    text: btnName,
                                    width: '100%',
                                    flex: 1,
                                    itemId: 'isActive',
                                    handler: function () {
                                        Ext.Msg.confirm('提示', '是否' + btnName + '该约束为启用约束？', callback);

                                        function callback(id) {
                                            if (id === 'yes') {
                                                var disEnableRecord = store.findRecord('isEnable', true);
                                                var formToGrid = page.getComponent('formWithPanel');
                                                mainController.enableProductAttributeConstraint(store, record, disEnableRecord, formToGrid)
                                            }
                                        }
                                    }
                                }]

                            });
                        }
                    }
                }, {
                    text: i18n.getKey('description'),
                    width: 230,
                    tdCls: 'vertical-middle',
                    xtype: 'gridcolumn',
                    itemId: 'description',
                    dataIndex: 'description'
                }],
                tbar: [{
                    xtype: 'button',
                    iconCls: 'icon_create',
                    text: i18n.getKey('create'),
                    handler: function () {
                        Ext.create('CGP.product.view.productattributeconstraint.view.customcomp.SelectRelatedAttributeWin', {
                            productId: productId,
                            itemsID: 'createForm',
                            skuAttributeStore: skuAttributeStore,
                            editOrNew: 'new',
                            store: store
                        }).show();
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon_refresh',
                    text: i18n.getKey('refresh'),
                    handler: function () {
                        store.load();
                    }
                }],
                listeners: {
                    selectionchange: onSelectionChange,

                }
            },
            form
        ],
        listeners: {
            afterrender: function (comp) {
                var constraintGrid = comp.getComponent('constraintGrid');
                constraintGrid.getStore().on({
                    load: {
                        fn: function (store, records, success, eOpts) {
                            if (!Ext.isEmpty(records)) {
                                constraintGrid.getSelectionModel().select(records[0])
                            }

                        }, single: true
                    }
                })
            }

        }
    });

    function onSelectionChange(model, records) {
        var rec = records[0];
        if (rec) {
            form.refreshData(rec.getData());
            form.down('toolbar').getComponent('saveButton').setDisabled(false);
            form.setDisabled(false);
            if (!Ext.Object.isEmpty(rec.getData())) {

                /*if(Ext.isEmpty(page.getComponent('panel').items.items)){
                    //page.getComponent('panel').add(form);
                    form.refreshData(rec.getData())
                }else{
                    form.refreshData(rec.getData())
                }*/
            }

        }
    }
});
