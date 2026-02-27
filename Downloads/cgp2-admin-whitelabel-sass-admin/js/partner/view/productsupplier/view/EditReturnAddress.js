/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'CGP.country.store.CountryStore',
    'partner.productSupplier.controller.Controller'
])
Ext.define('partner.productSupplier.view.EditReturnAddress', {
    extend: 'Ext.window.Window',
    alias: 'widget.edit_return_address',
    width: 400,
    modal: true,
    layout: 'fit',
    parentComp: null,
    diySetValue: function (data) {
        var me = this;
        var items = me.items.items;
        items.forEach(item => item.diySetValue ? item.diySetValue(data) : item.setValue(data));
    },
    initComponent: function () {
        var me = this;
        var countryStore = Ext.create('CGP.country.store.CountryStore');
        var controller = Ext.create('partner.productSupplier.controller.Controller');
        // 邮箱地址约束
        Ext.apply(Ext.form.field.VTypes, {
            email: function (val, field) {
                var regex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                return regex.test(val);
            },
            emailText: '请输入正确的邮箱地址',
            emailMask: /[\S]/
        });
        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                layout: 'vbox',
                defaults: {
                    xtype: 'textfield',
                    margin: '10 0 0 10',
                    width: 350
                },
                diySetValue: function (data) {
                    var me = this;
                    var items = me.items.items;
                    items.forEach(item => {
                        var name = item.name;
                        item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                    })
                },
                items: [
                    {
                        fieldLabel: i18n.getKey('firstName'), //名
                        name: 'firstName',
                        allowBlank: false,
                    },
                    {
                        fieldLabel: i18n.getKey('lastName'), //姓
                        name: 'lastName',
                    },
                    {
                        xtype: 'combobox',
                        editable: false,
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
                        fieldLabel: i18n.getKey('locationType'), //地址类型
                        name: 'locationType'
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('countryName') + '/' + i18n.getKey('region'), //国家
                        name: 'countryName',
                        displayField: 'name',
                        valueField: 'name',
                        allowBlank: false,
                        store: countryStore,
                    },
                    {
                        fieldLabel: i18n.getKey('state'), //省份
                        name: 'state',
                        allowBlank: false,
                    },
                    {
                        fieldLabel: i18n.getKey('city'), //城市
                        name: 'city',
                        allowBlank: false,

                    },
                    {
                        fieldLabel: i18n.getKey('suburb'), //县/区 county
                        name: 'suburb',
                    },
                    {
                        fieldLabel: i18n.getKey('streetAddress1'), //街道地址2
                        name: 'streetAddress2',
                        width: 370,
                        tipInfo: i18n.getKey('街道名称、区名称等'),
                        allowBlank: false,
                    },
                    {
                        fieldLabel: i18n.getKey('streetAddress2'), //街道地址1
                        name: 'streetAddress1',
                        tipInfo: i18n.getKey('房间号、门牌号等'),
                        width: 370,
                    },
                    {
                        fieldLabel: i18n.getKey('company'), //公司
                        name: 'company',
                    },
                    {
                        fieldLabel: i18n.getKey('postcode'), //邮政编码
                        name: 'postcode',
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('emailAddress'), //邮箱地址
                        name: 'emailAddress',
                        vtype: 'email',
                        allowBlank: false,
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('telephone'), //电话
                        name: 'telephone',
                        hideTrigger: true,
                        allowBlank: false,
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('mobile'), //手机
                        name: 'mobile',
                        hideTrigger: true,
                        allowBlank: false,
                        margin: '10 0 10 10',
                    },
                ],
                bbar: ['->',
                    {
                        xtype: 'button',
                        iconCls: "icon_save",
                        text: i18n.getKey('confirm'),
                        handler: function (btn) {
                            controller.saveEditReturnAddress(btn);
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: "icon_cancel",
                        text: i18n.getKey('cancel'),
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt.ownerCt;
                            win.close();
                        }
                    },
                ]
            }
        ];
        me.callParent();
    }
})