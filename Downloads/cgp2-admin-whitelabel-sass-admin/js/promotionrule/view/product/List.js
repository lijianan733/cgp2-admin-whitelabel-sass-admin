Ext.Loader.syncRequire(
    ['CGP.common.field.WebsiteCombo']
)
Ext.define("CGP.promotionrule.view.product.List", {
    extend: 'CGP.common.commoncomp.QueryGrid',


    filterDate: null, //需要过滤吊的数据
    websiteId: null,

    productStore: null,
    mainCategoryStore: null,
    subCategoryStore: null,

    minWidth: 500,
    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
    },

    initComponent: function () {
        var me = this;
        /*   if (me.websiteId == null) {
               me.mainCategoryStore = Ext.create("CGP.promotionrule.store.MainCategoryTree");
               me.subCategoryStore = Ext.create("CGP.promotionrule.store.SubCategoryTree");
           } else {
               me.mainCategoryStore = Ext.create("CGP.promotionrule.store.MainCategoryTree", {
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
               });
           }*/

        me.gridCfg = {
            editAction: false,
            deleteAction: false,
            store: Ext.create("CGP.promotionrule.store.Product", {
//					filters :  [
//					    {filterFn: function(item){
//							var data = me.filterDate;
//							for(var i = 0;i < data.length;i++){
//								if(item.get("id") == data[i].get("id")) return false;
//							}
//							return true;
//						}}
//					]
            }),
            multiSelect: true,
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
                }]

        };
        var filterCfg = Ext.clone(me.filterCfg || {});
        me.filterCfg = {
            height: 140,
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
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'title'],
                    data: [{
                        value: 'Sku',
                        title: 'Sku'
                    }, {
                        value: 'Configurable',
                        title: 'Configurable'
                    }, {
                        value: '',
                        title: 'All'
                    }]
                }),
                valueField: 'value',
                displayField: 'title',
                value: (me.needTypeFilter ? '' : 'Sku'),
                fieldLabel: i18n.getKey('type'),
                itemId: 'type',
                editable: false,
                hidden: !me.needTypeFilter
            }, {
                name: 'sku',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('sku'),
                itemId: 'sku',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var type = field.ownerCt.getComponent('type');
                        //type == configurable   需要为空 不能输入值
                        if (type.getValue() == "Configurable") {
                            field.setValue('');
                            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('CPNCSKUA') + '!');
                        }
                    }
                }
            }, {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                name: 'mainCategory.website.id',
                xtype: 'websitecombo',
                itemId: 'website',
                hidden: true,
                value: me.websiteId || 11
            }, {
                name: 'mainCategory',
                xtype: 'productcategorycombo',
                fieldLabel: i18n.getKey('maincategory'),
                itemId: 'mainCategory',
                //store: me.mainCategoryStore,
                isMain: true,
                displayField: 'name',
                valueField: 'id',
                selectChildren: false,
                websiteSelectorEditable: me.websiteId ? false : true,
                defaultWebsite: me.websiteId || 38,
                canSelectFolders: true,
                multiselect: true
            }, {
                name: 'subCategories',
                xtype: 'productcategorycombo',
                fieldLabel: i18n.getKey('subCategories'),
                itemId: 'subCategories',
                //store: me.subCategoryStore,
                isMain: false,
                websiteSelectorEditable: me.websiteId ? false : true,
                defaultWebsite: me.websiteId || 38,
                displayField: 'name',
                valueField: 'id',
                selectChildren: false,
                canSelectFolders: true,
                multiselect: true
            }, {
                xtype: 'textfield',
                name: 'excludeIds',
                hidden: true,
                value: function () {
                    if (Ext.isEmpty(me.filterDate)) {
                        return;
                    } else if (Ext.isString(me.filterDate)) {
                        return me.filterDate;
                    } else {
                        var value = [];
                        for (var i = 0; i < me.filterDate.length; i++) {
                            value.push(me.filterDate[i].get("id"));
                        }
                        return value.join(",");
                    }
                }()
            }]
        };
        me.filterCfg = Ext.merge(me.filterCfg, filterCfg);
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this;
        return me.down("grid").getSelectionModel().getSelection();
    }

});
