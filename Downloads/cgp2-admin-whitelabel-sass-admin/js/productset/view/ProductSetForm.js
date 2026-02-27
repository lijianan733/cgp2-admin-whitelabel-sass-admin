/**
 * Created by nan on 2021/4/8
 */
Ext.define("CGP.productset.view.ProductSetForm", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.productsetform',
    isValidForItems: true,
    border: false,
    autoScroll: true,
    defaults: {
        width: 450,
        margin: 10,
    },
    productSet: null,//关联的套件数据
    title: i18n.getKey('baseInfo'),
    createOrEdit: 'edit',
    initComponent: function () {
        var me = this;
        var productSetStore = Ext.create('CGP.productset.store.ProductSetStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'clazz',
                    type: 'string',
                    value: 'com.qpp.cgp.domain.productssuit.ConfigurableProductSet'
                }])
            }
        });
        me.items = [

            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('type'),
                name: 'clazz',
                itemId: 'clazz',
                margin: '0 10 10 10',
                editable: false,
                valueField: 'value',
                isLike: false,
                readOnly: me.createOrEdit == 'edit',
                fieldStyle: me.createOrEdit == 'edit' ? 'background-color:silver' : null,
                displayField: 'display',
                value: 'com.qpp.cgp.domain.productssuit.ConfigurableProductSet',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.productssuit.ConfigurableProductSet',
                            display: 'ConfigurableProductSet'
                        },
                        {
                            value: 'com.qpp.cgp.domain.productssuit.SkuProductSet',
                            display: 'SkuProductSet'
                        }
                    ]
                }),
                mapping: {
                    'com.qpp.cgp.domain.productssuit.SkuProductSet': [/*'sku'*/],
                    'com.qpp.cgp.domain.productssuit.ConfigurableProductSet': []
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var form = combo.ownerCt;
                        var skuCmps = combo.mapping['com.qpp.cgp.domain.productssuit.SkuProductSet'];
                        var configurableCmps = combo.mapping['com.qpp.cgp.domain.productssuit.ConfigurableProductSet'];
                        var state = (newValue == 'com.qpp.cgp.domain.productssuit.ConfigurableProductSet');
                        for (var i = 0; i < configurableCmps.length; i++) {
                            var field = form.getComponent(configurableCmps[i]);
                            if (field) {
                                field.setVisible(state);
                                field.setDisabled(!state);
                            }
                        }
                        for (var i = 0; i < skuCmps.length; i++) {
                            var field = form.getComponent(skuCmps[i]);
                            if (field) {
                                field.setVisible(!state);
                                field.setDisabled(state);
                            }
                        }
                    }
                }
            },
            /*     {
                     xtype: 'textfield',
                     name: 'sku',
                     itemId: 'sku',
                     allowBlank: false,
                     hidden: true,
                     disabled: true,
                     fieldLabel: i18n.getKey('sku'),
                 },*/
            {
                xtype: 'textfield',
                name: 'name',
                itemId: 'name',
                allowBlank: false,
                fieldLabel: i18n.getKey('name'),
            },
            {
                xtype: 'gridcombo',
                name: 'configurableProductSet',
                valueType: 'idReference',
                allowBlank: true,
                haveReset: true,
                fieldLabel: i18n.getKey('configurable') + i18n.getKey('productSet'),
                itemId: 'configurableProductSet',
                displayField: 'name',
                valueField: 'id',
                msgTarget: 'side',
                hidden: true,
                disabled: true,
                store: productSetStore,
                matchFieldWidth: false,
                editable: false,
                multiSelect: false,
                infoUlr: adminPath + 'api/productsets',
                gridCfg: {
                    store: productSetStore,
                    height: 300,
                    width: 600,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 120,
                            dataIndex: 'id',
                            itemId: 'id',
                        },

                        {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            width: 250,
                            itemId: 'name'
                        },
                        {
                            text: i18n.getKey('description'),
                            dataIndex: 'description',
                            itemId: 'description',
                            flex: 1
                        },
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: productSetStore,
                        displayInfo: true,
                    })
                },
                filterCfg: {
                    layout: {
                        type: 'column',
                        columns: 3
                    },
                    defaults: {
                        margin: 5
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            fieldLabel: i18n.getKey('id'),
                            name: 'id',
                            isLike: false,
                            itemId: '_id'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            name: 'name',
                            itemId: 'name'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('description'),
                            name: 'description',
                            itemId: 'description'
                        }
                    ]
                },
                diyGetValue: function () {
                    var me = this;
                   ;
                    var data = me.getArrayValue();
                    if (data) {
                        var result = {
                            id: data._id,
                            type: (data.clazz == 'com.qpp.cgp.domain.product.ConfigurableProduct' ? 'configurable' : 'sku'),
                            clazz: data.clazz
                        }
                        return result;
                    } else {
                        return null;
                    }

                },
                diySetValue: function (value) {
                    var me = this;
                    if (value) {
                        me.setDisabled(false);
                        me.setInitialValue([value.id])
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'id',
                itemId: 'id',
                hidden: true,
                allowBlank: true,
                fieldLabel: i18n.getKey('id'),
            },
            {
                name: 'mode',
                xtype: 'combo',
                editable: false,
                allowBlank: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [{name: '正式', value: 'RELEASE'}, {name: '测试', value: 'TEST'}]
                }),
                displayField: 'name',
                value: 'TEST',
                valueField: 'value',
                queryMode: 'local',
                fieldLabel: i18n.getKey('productMode'),
                itemId: 'mode'
            },
            {
                name: 'model',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('model'),
                itemId: 'model',
                allowBlank: false
            },
            {
                name: 'dateAvailable',
                xtype: 'datefield',
                editable: false,
                fieldLabel: i18n.getKey('enabledDate'),
                itemId: 'dateAvailable',
                format: 'Y-m-d',
                allowBlank: false,
                value: new Date(),
                diySetValue: function (data) {
                    var me = this;
                    me.setValue(new Date(data));
                }
            },
            {
                name: 'salePrice',
                fieldLabel: i18n.getKey('salePrice'),
                xtype: 'textfield',
                allowDecimals: true,
                maskRe: /[\d,\.]/,//只能输入数值
                decimalAutoType: true,//不自动缩减0
                decimalPrecision: 2,//这里设置保留2为小数
                hideTrigger: true,
                itemId: 'salePrice',
                allowBlank: false
            },
            {
                name: 'mustOrderQuantity',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('minBuyQuantity'),
                hideTrigger: true,
                itemId: 'mustOrderQuantity',
                allowBlank: false
            },
            {
                name: 'weight',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('weight'),
                hideTrigger: true,
                itemId: 'weight',
                allowBlank: false
            },
            {
                name: 'status',
                xtype: 'combo',
                editable: false,
                allowBlank: false,
                /*
                                hidden: true,
                */
                value: 1,
                hidden: true,
                fieldLabel: i18n.getKey('status'),
                itemId: 'status',
                store: new Ext.data.Store({
                    fields: ['name', {
                        name: 'id',
                        type: 'int'
                    }],
                    data: [
                        {
                            name: 'active',
                            id: 1
                        },
                        {
                            name: 'inactive',
                            id: 2
                        }
                    ]

                }),
                displayField: 'name',
                valueField: 'id'
            },
            {
                name: 'invisible',
                value: 'false',
                xtype: 'combo',
                hidden: true,
                editable: false,
                required: true,
                fieldLabel: i18n.getKey('invisible'),
                itemId: 'invisible',
                /*
                                hidden: true,
                */
                store: new Ext.data.ArrayStore({
                    fields: ['name'],
                    data: [
                        [true],
                        [false]
                    ]

                }),
                displayField: 'name',
                valueField: 'name',
                allowBlank: false
            },
            {
                name: 'subCategories', //Mark,TreeCombo
                xtype: 'productcategorycombo',
                displayField: 'name',
                valueField: 'id',
                isMain: false,
                store: Ext.data.StoreManager.lookup('subProductCategoryStore'),
                selectChildren: false,
                canSelectFolders: false,
                websiteSelectorEditable: false,
                defaultWebsite: 11,
                multiselect: true,
                hidden: true,
                allowBlank: true,
                fieldLabel: i18n.getKey('subcategory'),
                blackText: '不能为空',
                itemId: 'subCategories',
                editable: false,
                diyGetValue: function () {
                    var me = this;
                    var ids = me.getSubmitValue();
                    var result = [];
                    Ext.Array.each(ids, function (id) {
                        result.push({
                            id: Ext.Number.from(id),
                            clazz: 'com.qpp.cgp.domain.product.category.SubProductCategory'
                        })
                    })
                    return result;
                },
                diySetValue: function (data) {
                    var me = this;
                    if (Ext.isArray(data)) {
                        var ids = [];
                        Ext.Array.each(data, function (subCategory) {
                            ids.push(subCategory.id);
                        })
                        me.setInitialValue(ids);
                    }
                }
            },
            {
                name: 'shortDescription',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('shortDescription'),
                itemId: 'shortDescription',
                style: 'margin:20px'
            },
            {
                name: 'description1',
                width: 900,
                xtype: 'htmleditor',
                fieldLabel: i18n.getKey('description1'),
                itemId: 'description1',
                style: 'margin:20px',
                plugins: [Ext.create('Ext.ux.form.HtmlEditor.Table'),
                    Ext.create('Ext.ux.form.HtmlEditor.Image'), Ext.create('Ext.ux.form.HtmlEditor.RemoveFormat'), Ext.create('Ext.ux.form.HtmlEditor.Maximize', {
                        htmleditor: this,
                        editorItemId: 'description1'
                    })]
            },
            {
                name: 'description2',
                width: 900,
                xtype: 'htmleditor',
                fieldLabel: i18n.getKey('description2'),
                itemId: 'description2',
                style: 'margin:20px',
                plugins: [Ext.create('Ext.ux.form.HtmlEditor.Maximize', {
                    htmleditor: this,
                    editorItemId: 'description2'
                })]
            },
            {
                name: 'description3',
                width: 900,
                xtype: 'htmleditor',
                fieldLabel: i18n.getKey('description3'),
                itemId: 'description3',
                style: 'margin:20px',
                plugins: [Ext.create('Ext.ux.form.HtmlEditor.Maximize', {
                    htmleditor: this,
                    editorItemId: 'description3'
                })]
            }

        ];
        me.callParent(arguments);
    }
})
