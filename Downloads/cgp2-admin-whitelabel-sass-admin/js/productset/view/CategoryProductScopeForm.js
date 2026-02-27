/**
 * Created by nan on 2021/4/8
 */
Ext.define("CGP.productset.view.CategoryProductScopeForm", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.staticproductscopeform',
    isValidForItems: true,
    border: false,
    autoScroll: true,
    defaults: {
        width: 450,
        allowBlank: false,
        margin: 10,
    },
    clazz: null,
    productSet: null,//关联的套件数据
    title: i18n.getKey('可选产品范围配置'),
    initComponent: function () {
        var me = this;
        var productStore = Ext.create('CGP.product.store.ProductStoreV2', {
            autoLoad: false,
        });
        me.items = [
            {
                xtype: 'textfield',
                name: 'clazz',
                itemId: 'clazz',
                hidden: true,
                value: me.clazz
            },
            {
                xtype: 'textfield',
                name: '_id',
                itemId: '_id',
                hidden: true,
                allowBlank: true,
                fieldLabel: i18n.getKey('_id'),
            },
            {
                xtype: 'textfield',
                name: 'name',
                itemId: 'name',
                fieldLabel: i18n.getKey('name'),
            },
            {
                xtype: 'textfield',
                name: 'description',
                itemId: 'description',
                fieldLabel: i18n.getKey('description'),
            },
            {
                //productSet
                xtype: 'uxfieldcontainer',
                name: 'setItem',
                hidden: true,
                allowBlank: false,
                itemId: 'setItem',
                items: [
                    {
                        name: '_id',
                        itemId: '_id',
                        xtype: 'textfield',
                    },
                    {
                        name: 'clazz',
                        itemId: 'clazz',
                        xtype: 'textfield',
                    }
                ]
            },
            {
                name: (me.clazz == 'com.qpp.cgp.domain.productssuit.MainCategoryProductScope') ? 'mainCategory' : 'subCategory',
                xtype: 'productcategorycombo',
                fieldLabel: (me.clazz == 'com.qpp.cgp.domain.productssuit.MainCategoryProductScope') ? i18n.getKey('maincategory') : i18n.getKey('subcategory'),
                itemId: 'mainCategory',
                displayField: 'name',
                valueField: 'id',
                websiteSelectorEditable: true,
                defaultWebsite: 38,
                selectChildren: false,
                isMain: (me.clazz == 'com.qpp.cgp.domain.productssuit.MainCategoryProductScope'),//是否是主类目
                canSelectFolders: true,
                multiselect: false,//默认不是多选
                simpleSelect: true,
                listeners: {
                    change: function (gridCombo, newValue, oldValue) {
                        console.log(newValue);
                        var result = gridCombo.ownerCt.getComponent('result');
                        var grid = result.items.items[0];
                        if (newValue) {
                            grid.store.proxy.extraParams = {
                                filter: Ext.JSON.encode([{
                                    name: (me.clazz == 'com.qpp.cgp.domain.productssuit.MainCategoryProductScope') ? 'mainCategory' : 'subCategories',
                                    type: 'string',
                                    value: newValue
                                }]),
                                page: 1//过滤出来的第一页，如果不是第一页，数据没法返回
                            };
                            grid.store.load()
                        } else {

                        }
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    return {
                        id: me.getValue(),
                        clazz: me.isMain ? 'com.qpp.cgp.domain.product.category.MainProductCategory' : 'com.qpp.cgp.domain.product.category.SubProductCategory'
                    }
                },
                diySetValue: function (data) {
                    var me = this;

                    if (data) {
                        me.setInitialValue([data.id]);
                    }
                }
            },
            {
                xtype: 'fieldset',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('可选产品') + '</font>',
                collapsible: true,
                width: '100%',
                border: '1 0 0 0 ',
                layout: 'fit',
                itemId: 'result',
                name: 'result',
                collapsed: false,
                items: [
                    Ext.create('Ext.grid.Panel', {
                        showValue: true,//默认只显示key
                        canAddNode: false,
                        editable: false,
                        store: productStore,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 120,
                                dataIndex: 'id',
                                itemId: 'id',
                            },
                            {
                                text: i18n.getKey('type'),
                                dataIndex: 'type',
                                itemId: 'type',
                                sortable: false
                            },
                            {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                width: 250,
                                itemId: 'name'
                            },
                            {
                                text: i18n.getKey('model'),
                                dataIndex: 'model',
                                xtype: 'gridcolumn',
                                width: 200,
                                itemId: 'model'
                            },
                            {
                                text: i18n.getKey('sku'),
                                dataIndex: 'sku',
                                autoSizeColumn: false,
                                xtype: 'gridcolumn',
                                flex: 1,
                                itemId: 'sku',
                                sortable: false,
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: productStore,
                            displayInfo: true,
                            width: 275,
                        })
                        ,
                    })
                ],
                isValid: function () {
                    return true;
                },
                getName: function () {
                    return this.name;
                },
                diySetValue: function (data) {
                    var me = this;
                },
                diyGetValue: function () {

                },
            },
        ];
        me.callParent(arguments);
    }
})