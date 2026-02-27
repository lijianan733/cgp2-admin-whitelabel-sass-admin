Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
]);
Ext.define("CGP.common.productgrid.ProductGrid", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    /**
     * @cfg {Ext.util.MixedCollection} collection
     * 記錄所有選中的產品ID集合，實現在批量生成時記錄各產品頁面選擇產品狀態
     * 實現再次打開選擇產品頁面是恢復產品選中狀態
     */
    collection: new Ext.util.MixedCollection(),
    /**
     * @cfg {Ext.util.MixedCollection} selectProductList
     * 記錄所有選中的產品集合，實現翻页记录功能
     */
    selectProductList: new Ext.util.MixedCollection(),
    /**
     * @cfg {Number} websitrId
     * 只显示传入的websiteId的产品
     */
    websiteId: null,
    productStore: null,
    mainCategoryStore: null,
    subCategoryStore: null,
    /**
     * @cfg {Number} pageId
     * 根据pageId显示相应的产品信息
     */
    pageId: null,

    minWidth: 500,
    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

    },

    initComponent: function () {
        var me = this;
        var store = Ext.create("CGP.common.store.ProductStore");
        store.on('load', function (store, records, options) {

            var grid = me.grid;
            //遍历collection恢复翻页选中的产品
            Ext.Array.each(me.collection, function () {
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    if (me.collection.containsKey(record.get("id"))) {
                        grid.getSelectionModel().select(i, true, false);    //选中record，并且保持现有的选择，不触发选中事件
                    }
                }
            });
        });
        /*     if (Ext.isEmpty(me.websiteId)) {
                 me.mainCategoryStore = Ext.create("CGP.common.store.MainCategoryTree");
                 me.subCategoryStore = Ext.create("CGP.common.store.SubCategoryTree");
             } else {
                 me.mainCategoryStore = Ext.create("CGP.common.store.MainCategoryTree", {
                     root: {
                         id: -me.websiteId,
                         name: 'category'
                     }
                 });
                 me.subCategoryStore = Ext.create("CGP.common.store.SubCategoryTree", {
                     root: {
                         id: -me.websiteId,
                         name: 'category'
                     }
                 });
             }*/

        me.gridCfg = {
            editAction: false,
            deleteAction: false,
            store: store,
            selModel: {mode: 'SINGLE'},
            listeners: {
                //选中时加到collection集合中
                'select': function (checkModel, record) {
                    me.collection.add(record.get("id"), record.get('id'));
                    me.selectProductList.add(record.get("id"), record.data)
                },
                //取消选中时 从集合中去除
                'deselect': function (checkModel, record, index, eOpts) {
                    me.collection.remove(me.collection.get(record.get("id")));
                    me.selectProductList.remove(me.selectProductList.get(record.get("id")));
                }


            },

            columns: [{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                width: 60,
                itemId: 'id'
            }, {
                text: i18n.getKey('type'),
                dataIndex: 'type',
                xtype: 'gridcolumn',
                itemId: 'type'
            },
                {
                    text: i18n.getKey('sku'),
                    dataIndex: 'sku',
                    autoSizeColumn: false,
                    width: 120,
                    xtype: 'gridcolumn',
                    itemId: 'sku'
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name'
                },
                {
                    text: i18n.getKey('model'),
                    dataIndex: 'model',
                    xtype: 'gridcolumn',
                    itemId: 'model'
                },
                {
                    text: i18n.getKey('maincategory'),
                    dataIndex: 'mainCategory',
                    xtype: 'gridcolumn',
                    itemId: 'mainCategory',
                    renderer: function (mainCategory) {
                        return mainCategory.name;
                    }
                },
                {
                    text: i18n.getKey('subCategories'),
                    dataIndex: 'subCategories',
                    xtype: 'gridcolumn',
                    itemId: 'subCategories',
                    renderer: function (subCategories) {
                        var value = [];
                        Ext.Array.each(subCategories, function (subCategory) {
                            value.push(subCategory.name);
                        })
                        return value.join(",");
                    }
                }, , {
                    text: i18n.getKey('checkPriceRule'),
                    xtype: 'componentcolumn',
                    itemId: "reSend",
                    width: 100,
                    sortable: false,
                    renderer: function (value, metaData, record, rowIndex) {
                        var id = record.get('id');
                        if (Ext.isEmpty(record.get('priceRules'))) {
                            metaData.style = "color: red";
                            return '无';
                        } else {
                            return new Ext.button.Button({
                                text: i18n.getKey('checkPriceRule'),
                                itemId: 'checkPriceRule',
                                handler: function () {
                                    Ext.create('CGP.product.view.pricerule.ListWindow', {
                                        tbar: {hidden: true},
                                        store: Ext.create('CGP.product.store.PriceRule', {
                                            productId: id
                                        }),
                                        hiddenAction: me.hiddenAction,
                                        hiddenCreateBtn: me.hiddenCreateBtn
                                    }).show();
                                }

                            });
                        }
                    }
                }]

        };
        me.filterCfg = {
            height: 90,
            header: false,
            defaults: {
                width: 280
            },
            items: [{
                name: 'id',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('id'),
                itemId: 'id',
                minValue: 1,
                allowDecimals: false,
                allowExponential: false,
                hideTrigger: true
            }, {
                name: 'type',
                xtype: 'combo',
                fieldLabel: i18n.getKey('type'),
                itemId: 'type',
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['type', "value"],
                    data: [
                        {
                            type: 'Sku', value: 'SKU'
                        },
                        {
                            type: 'Configurable', value: 'Configurable'
                        }
                    ]
                }),
                displayField: 'type',
                valueField: 'value',
                hidden: true,
                value: 'SKU',
                queryMode: 'local'
            }, {
                name: 'mainCategory.website.id',
                xtype: 'websitecombo',
                itemId: 'website',
                hidden: true,
                value: me.websiteId || 11,
            }, {
                name: 'mainCategory',
                xtype: 'productcategorycombo',
                fieldLabel: i18n.getKey('maincategory'),
                itemId: 'mainCategory',
                isMain: true,
                defaultWebsite: me.websiteId || 11,
                websiteSelectorEditable: me.websiteId ? false : true,
                //store: me.mainCategoryStore,
                displayField: 'name',
                valueField: 'id',
                isLike:false,
                selectChildren: false,
                canSelectFolders: true,
                multiselect: true
            }, {
                name: 'subCategories',
                xtype: 'productcategorycombo',
                fieldLabel: i18n.getKey('subCategories'),
                itemId: 'subCategories',
                isMain: false,
                isLike:false,
                defaultWebsite: me.websiteId || 11,
                websiteSelectorEditable: me.websiteId ? false : true,
                //store: me.subCategoryStore,
                displayField: 'name',
                valueField: 'id',
                selectChildren: false,
                canSelectFolders: true,
                multiselect: true
            }/*,{
                name: 'isSupportedCMS',
                xtype: 'textfield',
                itemId: 'isSupportedCMS',
                value: 'true',
                isLike: false,
                hidden: true
            },{
                name: 'invisible',
                xtype: 'textfield',
                itemId: 'invisible',
                value: false,
                hidden: true
            }*/]
        };
        me.callParent(arguments);
        me.grid = me.down('grid');
    },

    getValue: function () {
        var me = this;
        var pageList = [];
        var productId;
        for (var i = 0; i < me.collection.length; i++) {
            productId = me.collection.keys[i];
            pageList.push({'pageId': me.pageId, 'productId': productId})
        }
        eval('var list = {' + me.pageId + ':pageList}');
        return list;
    },
    getlist: function () {
        var me = this;
        return me.selectProductList;
    }

});
