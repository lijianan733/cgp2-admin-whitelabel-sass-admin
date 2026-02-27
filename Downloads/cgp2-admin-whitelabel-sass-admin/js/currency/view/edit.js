Ext.Loader.setConfig({
    disableCaching: false
});
Ext.Loader.setPath({
    enabled: true,
    "CGP.currency": path + 'js/currency'
});
Ext.Loader.require([
    "CGP.currency.model.Currency",
    'CGP.common.field.WebsiteCombo'
]);
Ext.onReady(function () {
    var websiteStore = Ext.create("CGP.currency.store.WebsiteAll"),
        id = JSGetQueryString('id'),
        isEdit = !!id,
        page = Ext.widget({
            block: 'currency',
            xtype: 'uxeditpage',
            gridPage: 'currency.html',
            tbarCfg: {
                hiddenButtons: ['config', 'help', 'create', 'copy', 'reset'],
            },
            formCfg: {
                model: 'CGP.currency.model.Currency',
                remoteCfg: false,
                layout: 'vbox',
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'id',
                        itemId: 'id',
                        fieldLabel: i18n.getKey('编号'),
                        allowBlank: true,
                        hideTrigger: true,
                        hidden: !isEdit,
                        fieldStyle: 'background-color: silver',
                    },
                    {
                        name: 'title',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('货币名称'),
                        itemId: 'title',
                        allowBlank: false
                    },
                    {
                        name: 'code',
                        xtype: 'textfield',
                        maxLength: 3,
                        enforceMaxLength: true,
                        fieldLabel: i18n.getKey('货币代号'),
                        allowBlank: false,
                        itemId: 'code'
                    },
                    {
                        name: 'symbolLeft',
                        xtype: 'textfield',
                        regexText: 'symbolLeft error',
                        fieldLabel: i18n.getKey('货币符号'),
                        itemId: 'symbolLeft',
                        listeners: {
                            change: function (field) {
                                setExample(field.ownerCt);
                                var otherField = field.ownerCt.getComponent("symbolRight");
                                if (otherField){
                                    if (Ext.isEmpty(field.getValue())) {
                                        otherField.setDisabled(false);
                                    } else {
                                        otherField.setDisabled(true);
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: 'websitecombo',
                        name: 'website',
                        itemId: 'websiteCombo',
                        allowBlank: false,
                        hidden: true,
                        diyGetValue: function () {
                            var me = this;
                            return {
                                id: me.getValue(),
                                clazz: 'com.qpp.cgp.domain.common.Website'
                            }
                        },
                        diySetValue: function (data) {
                            var me = this;
                            me.setValue(data.id);
                        }
                    },
                    {
                        name: 'decimalPoint',
                        xtype: 'textfield',
                        maxLength: 1,
                        enforceMaxLength: true,
                        fieldLabel: i18n.getKey('decimalPoint'),
                        itemId: 'decimalPoint',
                        enableKeyEvents: true,
                        value: '.',
                        listeners: {
                            change: function (field) {
                                setExample(field.ownerCt);
                            },
                            keydown: function (c, e) {
                                if (e.keyCode == 32) {
                                    c.blur();
                                    c.reset();
                                    c.focus();
                                }
                            }
                        }
                    }, 
                    {
                        name: 'thousandsPoint',
                        xtype: 'textfield',
                        maxLength: 1,
                        enforceMaxLength: true,
                        fieldLabel: i18n.getKey('thousandsPoint'),
                        itemId: 'thousandsPoint',
                        value: ',',
                        listeners: {
                            change: function (field) {
                                setExample(field.ownerCt);
                            },
                            keydown: function (c, e) {
                                if (e.keyCode == 32) {
                                    c.blur();
                                    c.reset();
                                    c.focus();
                                }
                            }
                        }
                    }, 
                    {
                        name: 'decimalPlaces',
                        xtype: 'numberfield',
                        minValue: 0,
                        maxValue: 5,
                        //值在请求时需要转成字符串
                        valIsString: true,
                        allowDecimals: false,
                        autoStripChars: true,
                        allowExponential: false,
                        fieldLabel: i18n.getKey('accuracy'),
                        itemId: 'decimalPlaces',
                        value: 2,
                        listeners: {
                            change: function (field) {
                                setExample(field.ownerCt);
                            }
                        }
                    },
                ],
                listeners: {
                    editing: function () {
                        if (page != null) {
                            if (page.form.getCurrentMode() == 'editing') {
                                page.form.getComponent('websiteCombo').setEditable(false);
                                page.form.getComponent('websiteCombo').readOnly = true;
                            } else if (page.form.getCurrentMode() == 'creating') {
                                page.form.getComponent('websiteCombo').setEditable(true);
                                page.form.getComponent('websiteCombo').readOnly = false;
                            }
                        }
                    }
                }
            },
            listeners: {
                afterload: function (p) {
                    if (p.form.getCurrentMode() == 'editing') {
                        p.form.getComponent('websiteCombo').setEditable(false);
                        p.form.getComponent('websiteCombo').readOnly = true;
                    }
                }
            }
        });

    function setExample(form) {
        var example = "100000000", str;
        var decimal = form.getComponent("decimalPoint")?.getValue(),
            thousandPoint = form.getComponent("thousandsPoint")?.getValue(),
            decimanlPlaces = form.getComponent("decimalPlaces")?.getValue();
        var start = example.length;
        if (decimanlPlaces == null) {
            decimanlPlaces = 0
        }
        if (thousandPoint == null) {
            thousandPoint = ""
        }
        if (decimal != null && decimal != "" && decimanlPlaces != 0) {
            start = example.length - decimanlPlaces;
            var pre = example.slice(0, start);
            var after = example.slice(start);
            str = pre + decimal + after;
        } else {
            str = example;
        }
        for (; start > 3;) {
            var pre = str.slice(0, start - 3);
            var after = str.slice(start - 3);
            str = pre + thousandPoint + after;
            start = start - 3;
        }
        str = form.getComponent("symbolLeft")?.getValue() + str + form.getComponent("symbolRight")?.getValue();
        form.getComponent("example")?.setValue("<b>" + str + "</b>");
    }
});
