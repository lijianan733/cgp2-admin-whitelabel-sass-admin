/**
 * Create by shirley on 2021/9/3
 * 国家--地区选择组件
 * */
Ext.define('CGP.shippingquotationtemplatemanage.view.CountryZoneSelectComponent', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.countryzoneselectcomponent',
    layout: 'fit',
    collapsed: true,
    collapsible: true,
    legendItemConfig: {
        deleteBtn: {
            hidden: false,
            disabled: false
        }
    },
    listeners: {
        afterrender: function (win) {
            var me = this;
            if (me.value) {
                me.diySetValue(me.value);
            }
        }
    },
    diySetValue: function (data) {
        var me = this;
        var component = me.items.items[0];
        component.setSubmitValue(data);
    },
    diyGetValue: function () {
        var me = this;
        var component = me.items.items[0];
        return component.getValue();
    },
    initComponent: function () {
        var me = this;
        var countryCode = me.title;
        // TODO 已存在地区进行过滤，接口待完善，暂不支持该功能
        var excludeCodes = '';
        if (me.value) {
            var arr = me.value.split(',');
            arr = arr.map(function (item) {
                return "'" + item + "'";
            });
            excludeCodes = arr.toString();
        }
        var zonesData = Ext.create('CGP.shippingquotationtemplatemanage.store.ZonesStore', {
            params: {
                filter: Ext.JSON.encode([
                    {
                        "name": "country.isoCode2",
                        "value": countryCode,
                        "type": "string"
                    },
                    {
                        "name": "excludeCodes",
                        "value": "[" + excludeCodes + "]",
                        "type": "string"
                    }
                ]),
                limit: 1000
            }
        });
        me.items = [{
            xtype: 'arraydatafield',
            margin: '0 0 10 0',
            allowBlank: true,
            resultType: 'Array',//该组件获取结果和设置值的数据类型
            diyInputComponent: {
                xtype: 'multicombobox',
                itemId: 'newItem',
                name: 'newItem',
                width: '100%',
                margin: '0 25 0 25',
                displayField: 'codeName',
                valueField: 'code',
                multiSelect: true,
                store: zonesData,
                editable: false,
            }
        }];
        me.callParent(arguments);
    }

})