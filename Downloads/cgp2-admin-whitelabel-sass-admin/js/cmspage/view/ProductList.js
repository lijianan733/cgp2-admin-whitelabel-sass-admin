/**
 * 產品列表
 * （1）：翻頁記錄已選擇產品
 *  (2) : 只顯示傳入網站ID的產品
 *  (3) : 只顯示SKU類型的產品
 */
Ext.define("CGP.cmspage.view.ProductList", {
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
    recordArr: new Ext.util.MixedCollection(),
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
        var store = Ext.create("CGP.cmspage.store.ProductStore");
        store.on('load', function (store, records, options) {

            var grid = Ext.getCmp('selectProduct');
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
    /*    me.mainCategoryStore = Ext.create("CGP.promotionrule.store.MainCategoryTree", {
            root: {
                id: -me.websiteId,
                name: 'category'
            }
        });
        me.subCategoryStore = Ext.create("CGP.promotionrule.store.SubCategoryTree", {
            root: {
                id: -me.websiteId,
                name: 'category'
            }
        });*/


        me.gridCfg = {
            editAction: false,
            deleteAction: false,
            id: 'selectProduct',
            store: store,
            multiSelect: true,
            listeners: {
                //选中时加到collection集合中
                'select': function (checkModel, record) {
                    me.collection.add(record.get("id"), record.get('id'));
                    me.selectProductList.add(record.get("id"), record.data);
                    me.recordArr.add(record.get("id"), record);
                },
                //取消选中时 从集合中去除
                'deselect': function (checkModel, record, index, eOpts) {
                    me.collection.remove(me.collection.get(record.get("id")));
                    me.selectProductList.remove(me.selectProductList.get(record.get("id")));
                    me.recordArr.remove(me.recordArr.get(record.get("id")));
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
                }
                , {
                    text: i18n.getKey('configurableProductId'),
                    dataIndex: 'configurableProductId',
                    width: 120,
                    xtype: 'gridcolumn',
                    itemId: 'configurableProductId'
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
                queryMode: 'local'
            }, {
                name: 'mainCategory.website.id',
                xtype: 'combobox',
                fieldLabel: i18n.getKey('website'),
                itemId: 'website',
                store: Ext.create("CGP.cmspage.store.Website"),
                displayField: 'name',
                valueField: 'id',
                editable: false,
                hidden: true,
                value: me.websiteId || 11
            }, {
                name: 'mainCategory',
                xtype: 'productcategorycombo',
                fieldLabel: i18n.getKey('maincategory'),
                itemId: 'mainCategory',
                //store: me.mainCategoryStore,
                displayField: 'name',
                valueField: 'id',
                websiteSelectorEditable: me.websiteId ? false : true,
                defaultWebsite: me.websiteId || 38,
                selectChildren: false,
                canSelectFolders: true,
                multiselect: true
            }, {
                name: 'subCategories',
                xtype: 'productcategorycombo',
                fieldLabel: i18n.getKey('subCategories'),
                itemId: 'subCategories',
                isMain: false,
                websiteSelectorEditable: me.websiteId ? false : true,
                defaultWebsite: me.websiteId || 38,
                //store: me.subCategoryStore,
                displayField: 'name',
                valueField: 'id',
                selectChildren: false,
                canSelectFolders: true,
                multiselect: true
            }, {
                name: 'invisible',
                xtype: 'textfield',
                itemId: 'invisible',
                value: false,
                isBoolean: true,
                hidden: true
            },
                {
                    id: 'skuConfigurableProductId',
                    name: 'configurableProduct.id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    itemId: 'configurableProductId',
                    fieldLabel: i18n.getKey('configurableProductId')
                }]
        };
        me.callParent(arguments);
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
    },
    getSelectArr: function () {
        var me = this;
        var selectArr = [];
        me.recordArr.each(function (item) {
            selectArr.push(item);
        });
        return selectArr;
    }

});
