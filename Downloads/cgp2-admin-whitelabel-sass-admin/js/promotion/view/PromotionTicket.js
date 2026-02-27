/**
 * @Description:
 * @author nan
 * @date 2023/7/12
 */
Ext.define('CGP.promotion.view.PromotionTicket', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.promotion_ticket',
    minHeight: 80,
    title: JSCreateFont('', true, i18n.getKey('优惠码')) + JSCreateFont('red', true, ' * '),
    legendItemConfig: {},
    layout: 'column',
    allowBlank: false,
    maxHeight: 350,
    extraButtons: {
        addBtn: {
            xtype: 'button',
            iconCls: 'icon_add',
            margin: '0 5',
            ui: 'default-toolbar-small',
            text: i18n.getKey('add'),
            handler: function (btn) {
                var fieldset = btn.ownerCt.ownerCt;
                var win = Ext.create('Ext.window.Window', {
                    modal: true,
                    constrain: true,
                    title: '新建优惠码',
                    layout: 'fit',
                    width: 450,
                    items: [
                        {
                            xtype: 'errorstrickform',
                            itemId: 'form',
                            layout: {
                                type: 'vbox'
                            },
                            defaults: {
                                allowBlank: false,
                                margin: '5 25',

                            },
                            fieldDefaults: {},
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    itemId: 'model',
                                    name: 'model',
                                    fieldLabel: i18n.getKey('添加方式'),
                                    items: [
                                        {
                                            boxLabel: '人工单个添加',
                                            name: 'model',
                                            inputValue: 'man',
                                            checked: true
                                        },
                                        {
                                            boxLabel: '批量随机生成',
                                            name: 'model',
                                            inputValue: 'auto',
                                        }
                                    ],
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var code = comp.ownerCt.getComponent('code');
                                            var codeLength = comp.ownerCt.getComponent('codeLength');
                                            var codeCount = comp.ownerCt.getComponent('codeCount');
                                            var prefix = comp.ownerCt.getComponent('prefix');

                                            code.setVisible(newValue.model == 'man');
                                            code.setDisabled(newValue.model != 'man');
                                            codeLength.setVisible(newValue.model != 'man');
                                            codeLength.setDisabled(newValue.model == 'man');
                                            prefix.setVisible(newValue.model != 'man');
                                            prefix.setDisabled(newValue.model == 'man');
                                            codeCount.setVisible(newValue.model != 'man');
                                            codeCount.setDisabled(newValue.model == 'man');

                                        }
                                    },
                                    flex: 1,
                                    width: '100%',
                                    diySetValue: function (data) {
                                        var me = this;
                                        me.setValue(data)
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('优惠码'),
                                    itemId: 'code',
                                    name: 'code',
                                    allowBlank: false,
                                    flex: 1,
                                    width: '100%'
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('优惠码的长度'),
                                    itemId: 'codeLength',
                                    name: 'codeLength',
                                    allowDecimals: false,
                                    value: 17,
                                    minValue: 17,
                                    flex: 1,
                                    hidden: true,
                                    disabled: true,
                                    width: '100%'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('优惠码前缀'),
                                    itemId: 'prefix',
                                    name: 'prefix',
                                    allowBlank: true,
                                    flex: 1,
                                    hidden: true,
                                    disabled: true,
                                    width: '100%'
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('生成的优惠码数量'),
                                    itemId: 'codeCount',
                                    name: 'codeCount',
                                    allowDecimals: false,
                                    minValue: 1,
                                    flex: 1,
                                    maxLength: 6,
                                    enforceMaxLength: true,
                                    maxValue: 100000,
                                    hidden: true,
                                    disabled: true,
                                    width: '100%'
                                }]
                        }
                    ],
                    bbar: {
                        xtype: 'bottomtoolbar',
                        saveBtnCfg: {
                            handler: function (btn) {
                                var form = btn.ownerCt.ownerCt.getComponent('form');
                                if (form.isValid()) {
                                    var data = form.getValue();
                                    if (data.model == 'auto') {//批量生成
                                        var url = adminPath + `api/promotion/generateUniqueCode?codeCount=${data.codeCount}&codeLength=${data.codeLength}&prefix=${data.prefix}`;
                                        JSAjaxRequest(url, 'GET', true, null, null, function (require, success, response) {
                                            if (success) {
                                                var responseText = Ext.JSON.decode(response.responseText);
                                                if (responseText.success) {
                                                    var arr = responseText.data;
                                                    fieldset.suspendLayouts();
                                                    arr.map(function (item) {
                                                        fieldset.addItem({
                                                            code: item,
                                                            _id: ''
                                                        });
                                                    });
                                                    fieldset.resumeLayouts();
                                                    fieldset.doLayout();
                                                    win.close();
                                                }
                                            }
                                        }, true);
                                    } else if (data.model == 'man') {//手动添加
                                        //校验是否重复
                                        var url = adminPath + `api/promotion/validateExist?codes=${data.code}`;
                                        JSAjaxRequest(url, 'GET', true, null, null, function (require, success, response) {
                                            if (success) {
                                                var responseText = Ext.JSON.decode(response.responseText);
                                                if (responseText.success) {
                                                    fieldset.suspendLayouts();
                                                    var responseData = responseText.data;
                                                    //数据库是否已经有了
                                                    var exists = responseData[0].exists;
                                                    var currentValue = fieldset.diyGetValue();
                                                    //本地数据是否已经有了
                                                    currentValue.map(function (item) {
                                                        if (item.code == data.code) {
                                                            exists = true;
                                                        }
                                                    });
                                                    if (exists == true) {
                                                        Ext.Msg.alert(i18n.getKey('prompt'), '已经存在相同的优惠码');
                                                    } else {
                                                        fieldset.addItem({
                                                            code: data.code,
                                                            _id: ''
                                                        });
                                                    }
                                                    fieldset.resumeLayouts();
                                                    fieldset.doLayout();
                                                    win.close();
                                                }
                                            }
                                        }, true);
                                    }
                                }
                            }
                        }
                    }
                });
                win.show();
            }
        }
    },
    defaults: {
        width: '',
        minWidth: 50,
        maxHeight: 350,
        margin: '0 5',
    },
    items: [],
    listeners: {
        add: function () {
            var me = this;
            me.isValid();
        },
        remove: function () {
            var me = this;
            me.isValid();
        }
    },
    isValid: function () {
        var me = this;
        var isValid = false;
        if (me.items.items.length > 0) {
            isValid = true;
        }
        me.setValidStyle(isValid);
        return isValid;
    },
    getErrors: function () {
        return '该输入项为必输项'
    },
    setValidStyle: function (isValid) {
        var me = this;
        if (!isValid) {
            me.el.dom.style.borderColor = '#cf4c35';
        } else {
            me.el.dom.style.borderColor = '#b5b8c8';
        }
    },
    diyGetValue: function () {
        var me = this;
        var arr = [];
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            var code = item.el.query('[itemId=code]')[0].innerText;
            var codeId = item.el.query('[itemId=code]')[0].getAttribute('codeId')
            arr.push({
                _id: codeId,
                code: code,
                clazz: 'com.qpp.cgp.domain.promotion.promotionTicket.CouponCode'
            });
        }
        return arr;
    },
    diySetValue: function (data) {
        var me = this;
        me.suspendLayouts();
        me.removeAll();
        if (data) {
            for (var i = 0; i < data.length; i++) {
                me.addItem(data[i]);
            }
        }
        me.resumeLayouts();
        me.doLayout();
    },
    addItem: function (data) {
        var me = this;
        me.add({
            xtype: 'displayfield',
            value: `<div codeId="${data._id}" itemId="code" style="display: flex">${data.code}<img title="删除"  style="cursor: pointer;" 
                                    src="${path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png'}" ></div>`,
            listeners: {
                afterrender: function (display) {
                    var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                    ela.on("click", function () {
                        me.remove(display);
                    });
                }
            }
        });
    },
})