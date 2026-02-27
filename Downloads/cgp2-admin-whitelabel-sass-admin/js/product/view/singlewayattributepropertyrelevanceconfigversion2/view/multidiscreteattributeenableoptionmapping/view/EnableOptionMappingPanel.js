/**
 * Created by nan on 2020/2/12.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.EnableOptionMappingPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.enableoptionmappingpanel',
    defaults: {
        split: true,
        hideCollapseTool: true
    },
    layout: 'border',
    productId: null,
    title: i18n.getKey('可用属性选项值映射'),
    initComponent: function () {
        var me = this;
        var productId = me.productId;
        var store = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.store.MultiDiscreteValueConstraint', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productId',
                    type: 'number',
                    value: productId
                }])
            }
        });
        var mainController = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.controller.Controller');
        var OptionSkuAttributeStore = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.store.SkuAttribute', {
            configurableId: productId
        });
        var skuAttributeStore = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.store.SkuAttribute', {
            configurableId: productId
        });
        var onSelectionChange = function (model, records) {
            var rec = records[0];
            if (rec) {
                form.refreshData(rec.getData(), rec);

                if (!Ext.Object.isEmpty(rec.getData())) {
                }
            }
        };
        var form = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.CenterPanel', {
            productId: productId,
            itemsID: 'editForm',
            configurableId: productId,
            itemId: 'centerPanel',
            saveDisabled: true,
            region: 'center',
            skuAttributeStore: skuAttributeStore,
            OptionSkuAttributeStore: OptionSkuAttributeStore,
            editOrNew: 'edit',
            store: store
        });
        OptionSkuAttributeStore.load(function () {
            OptionSkuAttributeStore.filter(
                {
                    filterFn: function (item) {
                        return !Ext.isEmpty(item.get('options'))
                    }
                }
            )
        });
        var grid = Ext.widget('gridpanel', {
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
            columns: [
                {
                    xtype: 'rownumberer',
                    tdCls: 'vertical-middle'
                },
                {
                    xtype: 'actioncolumn',
                    tdCls: 'vertical-middle',
                    itemId: 'actioncolumn',
                    width: 35,
                    sortable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            width: 30,
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var grid = view.ownerCt;
                                var enableOptionMappingPanel = grid.ownerCt;
                                /*store.removeAt(rowIndex);*/
                                var recordId = store.getAt(rowIndex).getId();
                                var centerPanel = enableOptionMappingPanel.getComponent('centerPanel');
                                Ext.Msg.confirm('提示', '确认删除？', callback);

                                function callback(id) {
                                    if (id == 'yes') {
                                        mainController.deleteProductAttributeConstraint(recordId, store, centerPanel, grid)
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    width: 120,
                    itemId: 'id',
                    resizable: false,
                    tdCls: 'vertical-middle',
                    //sortable: true,
                    menuDisabled: true,
                    dataIndex: '_id'
                },
                {
                    text: i18n.getKey('domain') + i18n.getKey('id'),
                    width: 120,
                    itemId: 'domainId',
                    resizable: false,
                    tdCls: 'vertical-middle',
                    //sortable: true,
                    menuDisabled: true,
                    dataIndex: 'attributeMappingDomain',
                    renderer: function (value) {
                        return value._id;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    tdCls: 'vertical-middle',
                    flex: 1,
                    itemId: 'description',
                    dataIndex: 'description',
                    renderer: function (value, metaData, record, rowIndex) {
                        console.log(value);
                        metaData.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                        return value;
                    }
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {//底端的分页栏
                store: store,
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                emptyMsg: i18n.getKey('noData')
            }),
            tbar: [{
                xtype: 'button',
                iconCls: 'icon_create',
                text: i18n.getKey('create'),
                handler: function (btn) {
                    var leftPanel = btn.ownerCt.ownerCt;
                    var centerPanel = leftPanel.ownerCt.getComponent('centerPanel');
                    leftPanel.getSelectionModel().deselectAll();
                    form.setDisabled(false);
                    form.setTitle('新建多属性约束');
                    centerPanel.refreshData();
                    form.down('toolbar').getComponent('saveButton').setDisabled(false);
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
                afterrender: function () {
                    var page = this;
                    var productId = me.productId;
                    var isLock = JSCheckProductIsLock(productId);
                    if (isLock) {
                        JSLockConfig(page);
                    }
                }
            }
        });
        me.items = [
            grid,
            form
        ]
        me.callParent();
    },
    listeners: {
        /* afterrender: function (comp) {
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
         }*/
    }
})
