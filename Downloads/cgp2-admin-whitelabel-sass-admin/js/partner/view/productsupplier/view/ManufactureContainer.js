/**
 * @author xiu
 * @date 2023/2/20
 */
Ext.Loader.syncRequire([
    'partner.productSupplier.view.EditReturnAddress'
])
Ext.define('partner.productSupplier.view.ManufactureContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.manufacture_container',
    partnerId: null,
    diyGetValue: function () {
        var result = {};
        var me = this;
        var items = me.items.items;
        items.forEach(item => {
            var name = item.name;
            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
        })
        return result;
    },
    diySetValue: function (data) {
        var me = this;
        var items = me.items.items;
        items.forEach(item => {
            var name = item.name;
            var itemData = data[name] || '';
            item.diySetValue ? item.diySetValue(itemData) : item.setValue(itemData)
        })
    },
    initComponent: function () {
        var me = this;
        var code = JSGetQueryString('code');
        var controller = Ext.create('partner.productSupplier.controller.Controller');
        me.items = [
            {
                xtype: 'textfield',
                name: 'id',
                hidden: true,
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                hidden: true,
                value: 'com.qpp.cgp.domain.partner.cooperation.manufacture.Manufacture',
            },
            {
                xtype: 'textfield',
                name: 'name',
                hidden: true,
            },
            {
                xtype: 'textfield',
                name: 'partner',
                hidden: true,
                partnerId: me.partnerId,
                clazz: 'com.qpp.cgp.domain.partner.Partner',
                diyGetValue: function () {
                    var me = this;
                    return {
                        id: +me.partnerId,
                        clazz: 'com.qpp.cgp.domain.partner.Partner'
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.partnerId = data['id'];
                    me.clazz = data['clazz'];
                }
            },
            {
                xtype: 'textfield',
                name: 'code',
                itemId: 'code',
                width: 350,
                allowBlank: false,
                value: code,
                fieldLabel: i18n.getKey('供应商代码'),
            },
            {
                xtype: 'textfield',
                name: 'description',
                itemId: 'description',
                width: 350,
                fieldLabel: i18n.getKey('描述'),
            },
            {
                xtype: 'uxtextarea',
                name: 'returnAddress',
                itemId: 'returnAddress',
                height: 150,
                width: 400,
                readOnly: true,
                diyGetValue: function () {
                    var me = this;
                    return me.formValue;
                },
                diySetValue: function (data) {
                    var me = this;
                    me.formValue = data;
                    me.setValue(controller.getGroupString(data));
                },
                formValue: {},
                fieldLabel: i18n.getKey('退货地址'),
                textareaConfig: {
                    listeners: {
                        change: function (comp, newValue, oldValue) {
                            if (newValue) {
                                var toolbar = comp.ownerCt.getComponent('toolbar');
                                var edit = toolbar.getComponent('edit');
                                edit.setText('修改地址');
                                edit.isEdit = true;
                            }
                        }
                    },
                },
                toolbarConfig: {
                    itemId: 'toolbar',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'icon_edit',
                            itemId: 'edit',
                            isEdit: false,
                            text: i18n.getKey('添加地址'),
                            handler: function (btn) {
                                var returnAddress = btn.ownerCt.ownerCt;
                                var win = Ext.create('partner.productSupplier.view.EditReturnAddress', {
                                    parentComp: returnAddress,
                                    title: i18n.getKey(btn.isEdit ? 'edit' : 'add') + '_' + i18n.getKey('退货地址'),
                                }).show();

                                win.diySetValue(returnAddress.formValue);
                            }
                        }
                    ]
                },
            },
        ];
        me.callParent();
    }
})