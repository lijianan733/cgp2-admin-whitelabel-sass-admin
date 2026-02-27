/**
 * Edit
 * @Author: miao
 * @Date: 2021/11/3
 */
Ext.define("CGP.tax.view.Edit", {
    extend: "Ext.ux.form.ErrorStrickForm",
    alias: 'widget.taxedit',
    border: 0,
    padding: '10',
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 120,
        msgTarget: 'side'
    },
    isValidForItems: true,
    initComponent: function () {
        var me = this;
        var taxId = JSGetQueryString('id');
        var controller = Ext.create('CGP.tax.controller.Tax');
        me.createOrEdit = 'create';
        if (Ext.isEmpty(taxId)) {
            taxId = JSGetCommonKey();
        } else {
            me.createOrEdit = 'edit';
        }
        me.tbar = [
            {
                itemId: 'taxSave',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
            },
        ]
        me.items = [
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: '0 0 10 0',
                width: '100%',
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
                items: [
                    {
                        xtype: 'displayfield',
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('base') + i18n.getKey('info') + '</font>',
                    }
                ],
                isValid: function () {
                    return true;
                }
            },
            {
                xtype: 'numberfield',
                itemId: 'taxId',
                name: '_id',
                fieldLabel: i18n.getKey('id'),
                hidden: true,
                value: taxId
            },
            {
                xtype: 'textfield',
                itemId: 'name',
                name: 'name',
                fieldLabel: i18n.getKey('name'),
                allowBlank: false,
            },
            {
                xtype: 'textfield',
                itemId: 'clazz',
                name: 'clazz',
                fieldLabel: i18n.getKey('clazz'),
                hidden: true,
                value: 'com.qpp.cgp.domain.tax.Tax'
            },
            {
                xtype: 'checkbox',
                fieldLabel: i18n.getKey('isAddToProductPrice'),
                name: 'addToProductPrice',
                itemId: 'addToProductPrice'
            },
            {
                xtype: 'combo',
                itemId: 'base',
                name: 'base',
                fieldLabel: i18n.getKey('taxbase'),
                displayField: 'displayName',
                valueField: 'value',
                value: '',
                editable: false,
                allowBlank: false,
                //haveReset: true,
                queryMode: 'local',
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'displayName'],
                    data: [
                        {
                            value: 'SELL_PRICE',
                            displayName: i18n.getKey('sellPrice')
                        },
                        {
                            value: 'RESALE_PRICE',
                            displayName: i18n.getKey('resalePrice')
                        }
                    ]
                })
            },
            {
                name: 'area',
                xtype: 'countrycombo',
                itemId: 'country',
                fieldLabel: i18n.getKey('country'),
                displayField: 'name',
                valueField: 'id',
                valueType: 'idReference',
                allowBlank: false,
                store: Ext.create('CGP.country.store.CountryStore'),
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        var resourceCountry = comp.ownerCt.down('uxfieldset [itemId="sourceForm"] [itemId="country"]').getArrayValue();
                        if (!Ext.isEmpty(newValue) && !Ext.Object.isEmpty(newValue) && !Ext.isEmpty(resourceCountry)) {
                            comp.ownerCt.down('toolbar [itemId="areaTaxAdd"]').enable();
                        } else {
                            comp.ownerCt.down('toolbar [itemId="areaTaxAdd"]').disable();
                        }
                    }
                },
                diySetValue: function (data) {
                    var comp = this;
                    if (data?.country?.id) {
                        comp.setInitialValue([data?.country?.id]);
                    }
                },
                diyGetValue: function () {
                    var comp = this, data = {};
                    data['country'] = comp.getArrayValue();
                    return data;
                }
            },
            {
                xtype: 'uxfieldset',
                name: 'rootAreaTax',
                title: i18n.getKey('taxRule'),
                width: 400,
                style: {
                    padding: '5',
                    borderRadius: '4px'
                },
                items: [
                    {
                        xtype: 'areatax',
                        name: 'rootAreaTax',
                        border: 0,
                        width: "100%",
                        isCountryTax: true,
                        data: {
                            sourceArea: {"country":{
                                clazz: "com.qpp.cgp.domain.common.Country",
                                id: 25,
                                name: "China"
                            }}
                        }
                    }
                ],

                diySetValue: function (data) {
                    var me = this;
                    me.items.items[0].setValue(data);
                },
                diyGetValue: function () {
                    var me = this;
                    return me.items.items[0].getValue();
                },
                isValid: function () {
                    var me = this;
                    me.Errors = {};
                    var valid = true;
                    if (me.hidden == true) {
                        return true;//隐藏时就不作处理
                    }
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (!item.disabled) {
                            if (!item.isValid()) {
                                valid = false;
                                // me.Errors[item.name] = item.getErrors();
                            }
                        }
                    }
                    return valid;
                },
            },
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: 0,
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
                isValid: function () {
                    return true;
                },
                items: [
                    {
                        xtype: 'displayfield',
                        width: 100,
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('areaTax') + '</font>',
                    },
                    {
                        id: 'areaTaxAdd',
                        itemId: 'areaTaxAdd',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        disabled: true,
                        handler: function (btn) {
                            var grid = btn.ownerCt.ownerCt.getComponent('areaTax');
                            var country =Ext.Object.getValues(btn.ownerCt.ownerCt.getComponent('country').getValue())[0];
                            var resourceCountry = Ext.Object.getValues(btn.ownerCt.ownerCt.down('uxfieldset [itemId="sourceForm"] [itemId="country"]').getValue())[0];
                            var resourceState = Ext.Object.getValues(btn.ownerCt.ownerCt.down('uxfieldset [itemId="sourceForm"] [itemId="state"]').getValue())[0];
                            var resourceCity = btn.ownerCt.ownerCt.down('uxfieldset [itemId="sourceForm"] [itemId="city"]').getValue();
                            var record = Ext.create('CGP.tax.model.AreaTax');
                            record.set('area', {country: country});
                            record.set('sourceArea', {country: resourceCountry,state:resourceState,city:resourceCity});
                            record.set('tax', {_id: taxId, clazz: 'com.qpp.cgp.domain.tax.Tax'});
                            controller.editAreaTax(grid, record);
                        }
                    },
                    {
                        itemId: 'areaTaxDelete',
                        text: i18n.getKey('delete'),
                        iconCls: 'icon_delete',
                        handler: function (btn) {
                            var grid = btn.ownerCt.ownerCt.getComponent('areaTax');
                            controller.deleteAreaTax(grid);
                        }
                    }
                ]
            },
            {
                xtype: 'areataxgrid',
                itemId: 'areaTax',
                name: 'areaTax',
                width: "100%",
                border: 0,
                taxId: taxId,
                maxHeight: 248,
                memoryData: Ext.isEmpty(JSGetQueryString('id'))
                // minHeight:260,
                // maxHeight:300
            }
        ];
        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (comp) {
            var taxId = JSGetQueryString('id');
            if (taxId) {
                var taxModel = Ext.ModelManager.getModel("CGP.tax.model.Tax");
                taxModel.load(parseInt(taxId), {
                    success: function (record, operation) {
                        comp.diySetValue(record.data);
                    }
                });
            }
        }
    },
    diyGetValue: function () {
        var me = this, data = {};
        var items = me.items.items;
        for (var item of items) {
            if (item.diyGetValue) {
                data[item.name] = item.diyGetValue();
            } else {
                if (item.itemId == 'areaTax') {//修改tax，不取areaTaxGrid的值
                    if (!Ext.isEmpty(JSGetQueryString('id'))) {
                        continue;
                    } else {
                        var areaTaxes = [];
                        item.store.each(function (rec) {
                            areaTaxes.push(rec.getData());
                        });
                        data[item.name] = areaTaxes;
                    }
                }
                if (Ext.isEmpty(item.getValue)) {
                    continue;
                }
                data[item.name] = item.getValue();
            }
        }
        data.rootAreaTax.area = data.area;
        return data;
    },
    diySetValue: function (data) {
        var me = this;
        var items = me.items.items;
        me.data = data;
        for (var item of items) {
            if (item.diySetValue) {
                item.diySetValue(data[item.name]);
            } else {
                if (item.setValue && item.itemId != 'areaTax') {
                    item.setValue(data[item.name]);
                }
            }
        }
        // me.getComponent('country').setReadOnly()
    }
});