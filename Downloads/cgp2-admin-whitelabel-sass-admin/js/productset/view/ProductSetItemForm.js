/**
 * Created by nan on 2021/4/8
 */
Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.define("CGP.productset.view.ProductSetItemForm", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.productsetitemform',
    isValidForItems: true,
    border: false,
    autoScroll: true,
    defaults: {
        width: 450,
        allowBlank: false,
        margin: 10,
    },
    productSet: null,//关联的套件数据,
    title: i18n.getKey('productSetItem'),
    diySetValue: function (data) {
        var me = this;
        var clazz = me.getComponent('clazz');
        clazz.hide();
        if (!Ext.isEmpty(data.qty)) {
            if (data.clazz == 'com.qpp.cgp.domain.productssuit.CompleteSetItem') {

            } else {
                data.qty = {
                    type: 'fix',
                    fixValue: data.qty
                }
            }
        }
        if (!Ext.isEmpty(data.qtyRange)) {
            data.qty = {
                type: 'range',
                rangeValue: data.qtyRange
            }
        }
        me.setValue(data);
        console.log(data);
    },
    diyGetValue: function () {
        var me = this;
        var data = me.getValue();
        if (!Ext.isEmpty(data.qty)) {
            if (data.qty.type == 'range') {
                data.qtyRange = data.qty.rangeValue;
                data.qty = null;
            } else if (data.qty.type == 'fix') {
                data.qty = data.qty.fixValue;
                data.qtyRange = null;
            }
        }
        return data;
    },
    initComponent: function () {
        var me = this;
        var websiteStore = Ext.create("CGP.common.store.Website");
        var productStore = Ext.create('CGP.product.store.ProductStoreV2', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'type',
                    type: 'string',
                    value: '%Sku%'
                }])
            }
        });
        me.items = [
            {
                //skuProductSet中只能添加completeSetItem
                xtype: 'combo',
                name: 'clazz',
                itemId: 'clazz',
                value: 'com.qpp.cgp.domain.productssuit.CompleteSetItem',
                fieldLabel: i18n.getKey('type'),
                editable: false,
                valueField: 'value',
                readOnly: me.productSet.clazz == 'com.qpp.cgp.domain.productssuit.SkuProductSet',
                fieldStyle: me.productSet.clazz == 'com.qpp.cgp.domain.productssuit.SkuProductSet' ? 'background-color:silver' : null,
                displayField: 'display',
                mapping: {
                    'common': ['_id', 'name', 'description', 'clazz', 'productSet'],
                    'com.qpp.cgp.domain.productssuit.CompleteSetItem': ['fixQty', 'skuProduct'],
                    'com.qpp.cgp.domain.productssuit.SingleSetItem': ['qty'],
                    'com.qpp.cgp.domain.productssuit.MultiSetItem': ['qty', 'itemRange'],
                },
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.productssuit.CompleteSetItem',
                            display: i18n.getKey('completeSetItem')
                        }, {
                            value: 'com.qpp.cgp.domain.productssuit.SingleSetItem',
                            display: i18n.getKey('singleSetItem')
                        }, {
                            value: 'com.qpp.cgp.domain.productssuit.MultiSetItem',
                            display: i18n.getKey('multiSetItem')
                        }
                    ]
                }),
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var form = combo.ownerCt;
                        for (var i = 0; i < form.items.items.length; i++) {
                            var item = form.items.items[i];
                            if (Ext.Array.contains(combo.mapping['common'], item.itemId)) {
                            } else if (Ext.Array.contains(combo.mapping[newValue], item.itemId)) {
                                item.show();
                                item.setDisabled(false);
                            } else {
                                item.hide();
                                item.setDisabled(true);
                            }
                        }
                    }
                }
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
                name: 'productSet',
                hidden: true,
                allowBlank: false,
                itemId: 'productSet',
                items: [
                    {
                        name: 'id',
                        itemId: 'id',
                        xtype: 'textfield',
                        value: me.productSet ? me.productSet.id : null,
                    },
                    {
                        name: 'clazz',
                        itemId: 'clazz',
                        xtype: 'textfield',
                        value: me.productSet ? me.productSet.clazz : null,
                    }
                ]
            },
            {
                xtype: 'rangevaluefieldv2',
                name: 'itemRange',
                itemId: 'itemRange',
                labelAlign: 'left',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('分裂数量范围'),
            },
            {
                xtype: 'numberfield',
                name: 'qty',
                itemId: 'fixQty',
                allowDecimals: false,
                value: 1,
                fieldLabel: i18n.getKey('product') + i18n.getKey('qty'),
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'qty',
                itemId: 'qty',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('product') + i18n.getKey('qty'),
                defaults: {
                    margin: '10 0 5 50',
                    allowBlank: false,
                    width: 400,
                    labelWidth: 50,
                },
                items: [
                    {
                        xtype: 'combo',
                        name: 'type',
                        itemId: 'type',
                        value: 'fix',
                        fieldLabel: i18n.getKey('type'),
                        editable: false,
                        valueField: 'value',
                        displayField: 'display',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 'fix',
                                    display: i18n.getKey('固定值')
                                }, {
                                    value: 'range',
                                    display: i18n.getKey('范围值')
                                }
                            ]
                        }),
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var form = combo.ownerCt;
                                var fixValue = form.getComponent('fixValue');
                                var rangeValue = form.getComponent('rangeValue');
                                if (newValue == 'fix') {
                                    fixValue.show();
                                    fixValue.setDisabled(false);
                                    rangeValue.hide();
                                    rangeValue.setDisabled(true);
                                } else {
                                    rangeValue.show();
                                    rangeValue.setDisabled(false);
                                    fixValue.hide();
                                    fixValue.setDisabled(true);
                                    /*
                                                                        form.setWidth(650);
                                    */
                                }
                            }
                        }
                    },
                    {
                        xtype: 'numberfield',
                        name: 'fixValue',
                        minValue: 0,
                        allowDecimals: false,
                        itemId: 'fixValue',
                        value: 1,
                        fieldLabel: i18n.getKey('值')
                    },
                    {
                        xtype: 'rangevaluefieldv2',
                        name: 'rangeValue',
                        itemId: 'rangeValue',
                        hidden: true,
                        disabled: true,
                        labelAlign: 'left',
                        fieldLabel: i18n.getKey('范围'),
                    }
                ]
            },
            {
                name: 'skuProduct',
                xtype: 'gridcombo',
                valueType: 'idReference',
                fieldLabel: i18n.getKey('skuProduct'),
                allowBlank: false,
                itemId: 'skuProduct',
                displayField: 'name',
                valueField: 'id',
                msgTarget: 'side',
                store: productStore,
                matchFieldWidth: false,
                editable: false,
                multiSelect: false,
                infoUlr: adminPath + 'api/product/{id}',
                gridCfg: {
                    store: productStore,
                    height: 400,
                    width: 1000,
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
                            text: i18n.getKey('sku'),
                            dataIndex: 'sku',
                            autoSizeColumn: false,
                            xtype: 'gridcolumn',
                            itemId: 'sku',
                            flex: 1,
                            sortable: false,
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('model'),
                            dataIndex: 'model',
                            xtype: 'gridcolumn',
                            width: 200,
                            itemId: 'model'
                        },
                        {
                            text: i18n.getKey('maincategory'),
                            dataIndex: 'mainCategory',
                            xtype: 'gridcolumn',
                            itemId: 'mainCategory',
                            width: 200,
                            renderer: function (mainCategory) {
                                return mainCategory.name + '(' + mainCategory.id + ')';
                            }
                        },
                        {
                            text: i18n.getKey('subCategories'),
                            dataIndex: 'subCategories',
                            xtype: 'gridcolumn',
                            itemId: 'subCategories',
                            flex: 1,
                            minWidth: 200,
                            renderer: function (subCategories) {
                                var value = [];
                                Ext.Array.each(subCategories, function (subCategory) {
                                    value.push(subCategory.name);
                                })
                                return value.join(",");
                            }
                        },
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: productStore,
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
                            name: 'id',
                            xtype: 'numberfield',
                            hideTrigger: true,
                            fieldLabel: i18n.getKey('id'),
                            itemId: 'id'
                        },
                        {
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
                        },
                        {
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            itemId: 'name'
                        },
                        {
                            name: 'model',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('model'),
                            itemId: 'model'
                        },
                        {
                            name: 'mainCategory.website.id',
                            xtype: 'websitecombo',
                            itemId: 'website',
                            hidden: true,
                        },
                        {
                            name: 'mode',
                            xtype: 'combo',
                            isLike: false,
                            editable: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value'],
                                data: [
                                    {name: '正式', value: 'RELEASE'},
                                    {name: '测试', value: 'TEST'}
                                ]
                            }),
                            displayField: 'name',
                            valueField: 'value',
                            queryMode: 'local',
                            fieldLabel: i18n.getKey('productMode'),
                            itemId: 'mode'
                        },
                        {
                            name: 'mainCategory',
                            xtype: 'productcategorycombo',
                            fieldLabel: i18n.getKey('maincategory'),
                            itemId: 'mainCategory',
                            isLike: false,
                            multiselect: true,
                            isMain: true
                        },
                        {
                            name: 'subCategories',
                            xtype: 'productcategorycombo',
                            fieldLabel: i18n.getKey('subCategories'),
                            isLike: false,
                            itemId: 'subCategories',
                            multiselect: true,
                            isMain: false
                        }
                    ]
                },
                diyGetValue: function () {
                    var me = this;
                   ;
                    var data = me.getArrayValue();
                    var result = {
                        id: data.id,
                        type: (data.clazz == 'com.qpp.cgp.domain.product.ConfigurableProduct' ? 'configurable' : 'sku'),
                        clazz: data.clazz
                    }
                    return result;
                },
                diySetValue: function (value) {
                    var me = this;
                    if (value) {
                        me.setInitialValue([value.id])
                    }
                },
                getDisplayValue: function () {
                    var me = this,
                        dv = [];
                    Ext.Object.each(me.value, function (k, v) {
                        var displayField = v[me.displayField];
                        var id = v['id'];
                        if (!Ext.isEmpty(displayField)) {
                            var str = displayField + '(' + id + ')';
                            dv.push(str);
                        }
                    });
                    return dv.join(',');
                },
            }
        ];
        me.callParent(arguments);
    }
})
