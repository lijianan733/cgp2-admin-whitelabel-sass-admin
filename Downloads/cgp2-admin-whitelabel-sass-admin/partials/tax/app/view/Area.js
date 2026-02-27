/**
 * TaxRule
 * @Author: miao
 * @Date: 2021/11/3
 */
Ext.define("CGP.tax.view.Area", {
    extend: "Ext.form.Panel",
    alias: 'widget.area',
    requires: [],
    autoScroll: true,
    scroll: 'vertical',
    border: 0,
    fieldDefaults: {
        labelAlign: 'right',
        width: 330,
        labelWidth: 90,
        msgTarget: 'side'
    },

    readOnly: false,
    country:null,
    initComponent: function () {
        var me = this;

        me.items = [
            {
                name: 'country',
                xtype: 'countrycombo',
                itemId: 'country',
                fieldLabel: i18n.getKey('country'),
                displayField: 'name',
                valueField: 'id',
                allowBlank: false,
                readOnly: me.areaView,
                fieldStyle: me.areaView ? 'background-color:silver' : undefined,
                value:me.country,
                store: Ext.create('CGP.country.store.CountryStore'),
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        if (newValue) {
                            var stateComp = comp.ownerCt.getComponent('state');
                            stateComp.reset();
                            stateComp.contryId=Ext.Object.getKeys(newValue)[0];
                            if(stateComp.filter){
                                stateComp.filter.getComponent("countryId").setValue(Ext.Object.getKeys(newValue)[0]);
                            }
                            stateComp.store.proxy.extraParams = {
                                filter: Ext.JSON.encode([{name: 'country.id',
                                    type: 'number',
                                    value: Ext.Object.getValues(newValue)[0].id}])
                            };
                            stateComp.store.load();
                            var areaTaxAdd=Ext.getCmp('areaTaxAdd');
                            if(areaTaxAdd){
                                var targetCountry=areaTaxAdd.ownerCt.ownerCt.getComponent('country').getArrayValue();
                                if(!Ext.isEmpty(targetCountry)){
                                    areaTaxAdd.enable();
                                }
                            }
                        }
                    },
                    afterrender:function (comp){
                        if (!me.isCountryTax) {
                            // comp.setInitialValue([me.country.id]);
                            comp.setReadOnly(true);
                            comp.setFieldStyle('background-color:silver');
                        }
                    }
                }
            },
            {
                name: 'state',
                xtype: 'statecombo',
                itemId: 'state',
                fieldLabel: i18n.getKey('area'),
                displayField: 'name',
                valueField: 'id',
                // allowBlank: false,
                readOnly: me.areaView,
                fieldStyle: me.areaView ? 'background-color:silver' : undefined,
                store: Ext.create('CGP.zone.store.Zone')
            },
            {
                xtype: 'textfield',
                itemId: 'city',
                name: 'city',
                fieldLabel: i18n.getKey('city'),
                readOnly: me.areaView,
                fieldStyle: me.areaView ? 'background-color:silver' : undefined,
            }

        ];
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this, data = {};
        var items = me.items.items;
        for (var item of items) {
            if (item.diyGetValue) {
                data[item.name] = item.diyGetValue();
            } else {
                data[item.name] = item.getValue();
            }
        }
        return data;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        me.data = data;
        for (var item of items) {
            if (item.diySetValue) {
                item.diySetValue(data[item.name]);
            } else {
                item.setValue(data[item.name]);
            }
        }
    },

});