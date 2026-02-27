Ext.define('CGP.ordersign.view.orderInfo.ReceiverInfo', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.receiver_info',
    padding: '5 5 10 5',
    initComponent: function () {
        var me = this;
        var countryStore = Ext.create('CGP.country.store.CountryStore');
        var zonesStore = Ext.create('CGP.shippingquotationtemplatemanage.store.ZonesStore');
        me.layout = 'vbox';
        me.items = [
            {
                xtype: 'uxfieldset',
                title: i18n.getKey('userInfo'),
                defaults: {
                    xtype: 'textfield',
                    margin: '5 40 5 15',
                    labelWidth: 70,
                    width: 225
                },
                diyGetValue: function () {
                    var result = {},
                        me = this,
                        items = me.items.items;

                    items.forEach(item => {
                        var name = item.getName(),
                            value = item.diyGetValue ? item.diyGetValue() : item.getValue();
                        result[name] = value;
                    })
                    return result;
                },
                diySetValue: function (value) {
                    var me = this,
                        items = me.items.items;

                    items.forEach(item => item.setValue(value[item.getName()]));
                },
                items: [
                    {
                        fieldLabel: i18n.getKey('userName'), //用户名🐕
                        name: 'userName'
                    },
                    {
                        fieldLabel: i18n.getKey('userMail'), //用户邮箱🐕
                        name: 'userMail'
                    },
                    {
                        xtype: 'combobox',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: [
                                {
                                    name: 'Standard',
                                    value: 'Standard'
                                },
                                {
                                    name: 'Express',
                                    value: 'Express'
                                },
                                {
                                    name: '中通',
                                    value: '中通'
                                },
                            ]
                        }),
                        displayField: 'name',
                        valueField: 'value',
                        fieldLabel: i18n.getKey('deliveryCode'), //出货方式🐕
                        name: 'deliveryCode'
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('billAddress'), //账单地址🐕
                        name: 'billAddress',
                        labelWidth: 70,
                        width: 500,
                        height: 50
                    },
                ]
            },
            {
                xtype: 'uxfieldset',
                title: i18n.getKey('deliveryInformation'),
                diyGetValue: function () {
                    var result = {},
                        me = this,
                        items = me.items.items;

                    items.forEach(item => {
                        var value = item.diyGetValue ? item.diyGetValue() : item.getValue();
                        result = Ext.Object.merge(result, value);
                    })
                    return result;
                },
                diySetValue: function (value) {
                    var me = this,
                        items = me.items.items;

                    items.forEach(item => item.diySetValue(value));
                },
                items: [
                    {
                        xtype: 'uxfieldcontainer',
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaults: {
                            xtype: 'textfield',
                            margin: '5 40 5 15',
                            labelWidth: 70,
                            width: 225
                        },
                        diyGetValue: function () {
                            var result = {},
                                me = this,
                                items = me.items.items;

                            items.forEach(item => {
                                var name = item.getName(),
                                    value = item.diyGetValue ? item.diyGetValue() : item.getValue();
                                result[name] = value;
                            })
                            return result;
                        },
                        diySetValue: function (value) {
                            var me = this,
                                items = me.items.items;

                            items.forEach(item => item.setValue(value[item.getName()]));
                        },
                        items: [
                            {
                                fieldLabel: i18n.getKey('receiverName'), //收货人🐕
                                name: 'receiverName'
                            },
                            {
                                fieldLabel: i18n.getKey('receiverPhone'), //收货人电话🐕
                                name: 'receiverPhone'
                            },
                            {
                                fieldLabel: i18n.getKey('shippingPostCode'), //收货邮编🐕
                                name: 'shippingPostCode'
                            },
                            {
                                xtype: 'combobox',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['name', 'value'],
                                    data: [
                                        {
                                            name: 'House or Residence',
                                            value: 'House or Residence'
                                        },
                                        {
                                            name: 'POBOX',
                                            value: 'POBOX'
                                        },
                                        {
                                            name: 'business',
                                            value: 'business'
                                        },
                                        {
                                            name: 'Others',
                                            value: 'Others'
                                        },
                                    ]
                                }),
                                displayField: 'name',
                                valueField: 'value',
                                fieldLabel: i18n.getKey('locationType'), //地址类型🐕
                                name: 'locationType'
                            },
                        ]
                    },
                    {
                        xtype: 'uxfieldcontainer',
                        fieldLabel: i18n.getKey('receiverAddress'), //收货地址🐕
                        name: 'receiverAddress',
                        labelWidth: 110,
                        width: 700,
                        labelAlign: 'left',
                        margin: '5 40 5 15',
                        allowBlank: true,
                        layout: {
                            type: 'table',
                            columns: 4
                        },
                        defaults: {
                            xtype: 'combobox',
                            width: 120
                        },
                        diyGetValue: function () {
                            var result = {},
                                me = this,
                                items = me.items.items;

                            items.forEach(item => {
                                var name = item.getName(),
                                    value = item.diyGetValue ? item.diyGetValue() : item.getValue();

                                result[name] = value;
                            })
                            return result;
                        },
                        diySetValue: function (value) {
                            var me = this,
                                items = me.items.items;

                            items.forEach(item => item.setValue(value[item.getName()]));
                        },
                        items: [
                            {
                                name: 'shippingCountry',  //收货人所在国家🐕
                                store: countryStore,
                                emptyText: '国家',
                                displayField: 'name',
                                valueField: 'name',
                                // editable: false,
                            },
                            {
                                name: 'shippingState',    //收货人所在州🐕
                                store: zonesStore,
                                emptyText: '州',
                                displayField: 'name',
                                valueField: 'name',
                                // editable: false,
                            },
                            {
                                xtype: 'textfield',
                                name: 'shippingCity',      //收货人所在城市🐕
                                emptyText: '城市',
                            },
                            {
                                xtype: 'textfield',
                                name: 'shippingAddress',   //收货人所在具体地址🐕
                                emptyText: '请输入具体地址',
                                width: 250
                            }
                        ]
                    },
                ]
            },
        ]
        me.callParent();
    },
    diyGetValue: function () {
        var result = {},
            me = this,
            items = me.items.items;

        items.forEach(item => {
            var value = item.diyGetValue ? item.diyGetValue() : item.getValue();
            result = Ext.Object.merge(result, value);
        })
        return result;
    },
    diySetValue: function (value) {
        var me = this,
            items = me.items.items;

        items.forEach(item => item.diySetValue(value));
    }
})