/**
 * @author xiu
 * @date 2023/8/22
 */
//账单地址信息
Ext.define('CGP.orderitemsmultipleaddress.view.singleAddress.addressInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.addressInfo',
    bodyStyle: 'border-top:0;border-color:white;',
    defaults: {
        labelAlign: 'left',
    },
    margin: '5 0 25 0',
    layout: 'hbox',
    diySetValue: function (data) {
        const me = this,
            items = me.items.items
        items.forEach(item => {
            item.diySetValue(data || '');
        })
    },
    initComponent: function () {
        const me = this;

        function deliveryAddress(data) {
            const {
                    deliveryCountry,
                    deliveryState,
                    deliveryCity,
                    deliverySuburb,
                    deliveryStreetAddress1,
                    deliveryStreetAddress2,
                    deliveryMobile,
                    deliveryName
                } = data,
                arrayGather = [
                    deliveryCountry,
                    deliveryState,
                    deliveryCity,
                    deliverySuburb,
                    deliveryStreetAddress1,
                    deliveryStreetAddress2,
                    deliveryMobile,
                    deliveryName
                ],
                result = arrayGather.reduce((m, key) => {
                    if (m || key){
                        return key ?  m + ' ' + key : m;
                    }
                }, '')
            return result || '';
        }

        function billingAddress(data) {
            const {
                    billingCountry,
                    billingState,
                    billingCity,
                    billingSuburb,
                    billingStreetAddress1,
                    billingStreetAddress2,
                    billingMobile,
                    billingName
                } = data,
                arrayGather = [
                    billingCountry,
                    billingState,
                    billingCity,
                    billingSuburb,
                    billingStreetAddress1,
                    billingStreetAddress2,
                    billingMobile,
                    billingName
                ],
                result = arrayGather.reduce((m, key) => {
                    if (m || key){
                        return key ?  m + ' ' + key : m;
                    }
                }, '')
            return result || '';
        }

        me.items = [
            //收件人地址信息
            {
                xtype: 'container',
                layout: 'vbox',
                width: '50%',
                itemId: 'addressBook',
                name: 'addressBook',
                defaultType: 'displayfield',
                defaults: {
                    margin: '5 0 5 20',
                },
                diySetValue: function (data) {
                    const me = this,
                        container = me.getComponent('container');
                    container.diySetValue(data)
                },
                items: [
                    {
                        xtype: 'splitBarTitle',
                        margin: '0 0 3 6',
                        title: '收件人地址信息'
                    },
                    {
                        xtype: 'container',
                        width: '100%',
                        itemId: 'container',
                        layout: 'vbox',
                        defaultType: 'displayfield',
                        defaults: {
                            margin: '5 0 5 20',
                            width: '90%',
                        },
                        diySetValue: function (data) {
                            if (data) {
                                const me = this,
                                    items = me.items.items
                                items.forEach(item => {
                                    if (item.name) {
                                        var newData = (item.name === 'deliveryStreetAddress1') ? (data) : (data[item.name] || '');
                                        item.diySetValue ? (item.diySetValue(newData)) : (item.setValue(newData));
                                    }
                                })
                            }
                        },
                        items: [
                            {
                                fieldLabel: i18n.getKey('收件人'),
                                name: 'deliveryName',
                                itemId: 'deliveryName',
                            },
                            {
                                fieldLabel: i18n.getKey('收件人地址'),
                                name: 'deliveryStreetAddress1',
                                itemId: 'deliveryStreetAddress1',
                                diySetValue: function (data) {
                                    const me = this;
                                    me.setValue(deliveryAddress(data));
                                }
                            },
                            {
                                fieldLabel: i18n.getKey('邮政编码'),
                                name: 'deliveryPostcode',
                                itemId: 'deliveryPostcode',
                            },
                            {
                                fieldLabel: i18n.getKey('电话'),
                                name: 'deliveryTelephone',
                                itemId: 'deliveryTelephone',
                            },
                            {
                                fieldLabel: i18n.getKey('手机'),
                                name: 'deliveryMobile',
                                itemId: 'deliveryMobile',
                            },
                            {
                                fieldLabel: i18n.getKey('邮箱地址'),
                                name: 'deliveryEmail',
                                itemId: 'deliveryEmail',
                            },
                        ]
                    },
                ]
            },
            // 账单地址信息
            {
                xtype: 'container',
                itemId: 'billBook',
                name: 'billBook',
                layout: 'vbox',
                width: '50%',
                defaultType: 'displayfield',
                defaults: {
                    margin: '5 0 5 20',
                },
                diySetValue: function (data) {
                    const me = this,
                        container = me.getComponent('container');
                    container.diySetValue(data)
                },
                items: [
                    {
                        xtype: 'splitBarTitle',
                        margin: '0 0 3 6',
                        title: '账单地址信息'
                    },
                    {
                        xtype: 'container',
                        width: '100%',
                        itemId: 'container',
                        layout: 'vbox',
                        defaultType: 'displayfield',
                        defaults: {
                            margin: '5 0 5 20',
                            width: '90%',
                        },
                        diySetValue: function (data) {
                            if (data) {
                                const me = this,
                                    items = me.items.items
                                items.forEach(item => {
                                    if (item.name) {
                                        var newData = (item.name === 'billingStreetAddress1') ? (data) : (data[item.name] || '');
                                        item.diySetValue ? (item.diySetValue(newData)) : (item.setValue(newData));
                                    }
                                })
                            }
                        },
                        items: [
                            {
                                fieldLabel: i18n.getKey('收件人'),
                                name: 'billingName',
                                itemId: 'billingName',
                            },
                            {
                                fieldLabel: i18n.getKey('收件人地址'),
                                name: 'billingStreetAddress1',
                                itemId: 'billingStreetAddress1',
                                diySetValue: function (data) {
                                    const me = this;
                                    me.setValue(billingAddress(data));
                                }
                            },
                            {
                                fieldLabel: i18n.getKey('邮政编码'),
                                name: 'billingPostcode',
                                itemId: 'billingPostcode',
                            },
                            {
                                fieldLabel: i18n.getKey('电话'),
                                name: 'billingTelephone',
                                itemId: 'billingTelephone',
                            },
                            {
                                fieldLabel: i18n.getKey('手机'),
                                name: 'billingMobile',
                                itemId: 'billingMobile',
                            },
                            {
                                fieldLabel: i18n.getKey('邮箱地址'),
                                name: 'billingEmail',
                                itemId: 'billingEmail',
                            },
                        ]
                    },
                ]
            },
        ];
        me.callParent();

    },
})