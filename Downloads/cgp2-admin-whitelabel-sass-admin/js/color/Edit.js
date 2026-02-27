/**
 * Created by nan on 2020/10/29
 */
Ext.Loader.syncRequire([
    'CGP.color.model.ColorModel',
    'CGP.color.view.ColorGridCombo'
])
Ext.onReady(function () {
    var colorStore = Ext.create('CGP.color.store.ColorStore', {
        params: {
            filter: Ext.JSON.encode([{
                name: 'clazz',
                type: 'string',
                value: 'com.qpp.cgp.domain.common.color.RgbColor'
            }])
        }
    });
    var controller = Ext.create('CGP.color.controller.Controller')
    var page = Ext.widget({
        block: 'color',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.color.model.ColorModel',
            remoteCfg: false,
            items: [
                {
                    name: 'clazz',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'clazz',
                    editable: false,
                    valueField: 'value',
                    displayField: 'display',
                    mapping: {
                        common: ['clazz', 'colorName', 'description'],
                        'com.qpp.cgp.domain.common.color.RgbColor': ['r', 'g', 'b', 'displayCode'],
                        'com.qpp.cgp.domain.common.color.CmykColor': ['c', 'm', 'y', 'k', 'displayColor'],
                        'com.qpp.cgp.domain.common.color.SpotColor': ['displayColor']
                    },
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            var form = combo.ownerCt;
                            if (newValue) {
                                //控制那些显示
                                for (var i = 0; i < form.items.items.length; i++) {
                                    var item = form.items.items[i];
                                    var name = item.getName().split('.').pop();
                                    if (Ext.Array.contains(combo.mapping['common'], name)) {

                                    } else {
                                        if (Ext.Array.contains(combo.mapping[newValue], name)) {
                                            item.show();
                                            item.setDisabled(false);
                                        } else {
                                            item.hide();
                                            item.setDisabled(true);
                                        }
                                    }
                                }
                                var displayColor = form.getComponent('displayColor');
                                if (newValue == 'com.qpp.cgp.domain.common.color.CmykColor') {
                                    displayColor.store.proxy.extraParams = {
                                        filter: '[{"name":"clazz","value":"com.qpp.cgp.domain.common.color.RgbColor","type":"string"}]'
                                    };
                                    displayColor.store.load();
                                } else if (newValue == 'com.qpp.cgp.domain.common.color.SpotColor') {
                                    displayColor.store.proxy.extraParams = {
                                        filter: '[{"name":"clazz","value":["com.qpp.cgp.domain.common.color.CmykColor","com.qpp.cgp.domain.common.color.RgbColor"],"type":"array"}]'
                                    };
                                    displayColor.store.load();
                                }
                            }
                        },
                        afterrender: function (field) {
                            var id = JSGetQueryString('id');
                            if (id) {

                            } else {
                                field.setValue('com.qpp.cgp.domain.common.color.RgbColor')
                            }
                        }
                    },
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'com.qpp.cgp.domain.common.color.CmykColor',
                                display: 'CMYK颜色'
                            },
                            {
                                value: 'com.qpp.cgp.domain.common.color.RgbColor',
                                display: 'RGB颜色'
                            },
                            {
                                value: 'com.qpp.cgp.domain.common.color.SpotColor',
                                display: 'SPOT颜色'
                            }
                        ]
                    })
                },
                {
                    name: 'colorName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('color') + i18n.getKey('name'),
                    allowBlank: false,
                    itemId: 'colorName'
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    allowBlank: false,
                    itemId: 'description'
                },
                {
                    name: 'c',
                    xtype: 'numberfield',
                    maxValue: 255,
                    allowDecimals: false,
                    minValue: 0,
                    enforceMaxLength: true,
                    maxLength: 3,
                    fieldLabel: i18n.getKey('C'),
                    allowBlank: false,
                    itemId: 'c'
                }, {
                    name: 'm',
                    maxValue: 255,
                    allowDecimals: false,
                    minValue: 0,
                    enforceMaxLength: true,
                    maxLength: 3,
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('M'),
                    allowBlank: false,
                    itemId: 'm'
                }, {
                    name: 'y',
                    maxValue: 255,
                    allowDecimals: false,
                    minValue: 0,
                    enforceMaxLength: true,
                    maxLength: 3,
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('Y'),
                    allowBlank: false,
                    itemId: 'y'
                }, {
                    name: 'k',
                    maxValue: 255,
                    allowDecimals: false,
                    minValue: 0,
                    enforceMaxLength: true,
                    maxLength: 3,
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('K'),
                    allowBlank: false,
                    itemId: 'k'
                }, {
                    name: 'r',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('R'),
                    allowBlank: false,
                    hidden: true,
                    disabled: true,
                    maxValue: 255,
                    minValue: 0,
                    enforceMaxLength: true,
                    maxLength: 3,
                    allowDecimals: false,
                    itemId: 'r',
                    listeners: {
                        change: function (numberField, newValue, oldValue) {
                            var form = numberField.ownerCt;
                            var r = form.getComponent('r');
                            var g = form.getComponent('g');
                            var b = form.getComponent('b');
                            var displayCode = form.getComponent('displayCode');
                            var color = '#' + JSGetHEx(r.getValue()) + JSGetHEx(g.getValue()) + JSGetHEx(b.getValue()) + '';
                            color = color.toLocaleUpperCase();
                            displayCode.diySetValue(color);
                        }
                    }
                }, {
                    name: 'g',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('G'),
                    allowBlank: false,
                    maxValue: 255,
                    hidden: true,
                    disabled: true,
                    allowDecimals: false,
                    minValue: 0,
                    enforceMaxLength: true,
                    maxLength: 3,
                    itemId: 'g',
                    listeners: {
                        change: function (numberField, newValue, oldValue) {
                            var form = numberField.ownerCt;
                            var r = form.getComponent('r');
                            var g = form.getComponent('g');
                            var b = form.getComponent('b');
                            var displayCode = form.getComponent('displayCode');
                            var color = '#' + JSGetHEx(r.getValue()) + JSGetHEx(g.getValue()) + JSGetHEx(b.getValue()) + '';
                            color = color.toLocaleUpperCase();
                            displayCode.diySetValue(color);
                        }
                    }

                }, {
                    name: 'b',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('B'),
                    allowBlank: false,
                    maxValue: 255,
                    hidden: true,
                    disabled: true,
                    allowDecimals: false,
                    minValue: 0,
                    maxLength: 3,
                    enforceMaxLength: true,
                    itemId: 'b',
                    listeners: {
                        change: function (numberField, newValue, oldValue) {
                            var form = numberField.ownerCt;
                            var r = form.getComponent('r');
                            var g = form.getComponent('g');
                            var b = form.getComponent('b');
                            var displayCode = form.getComponent('displayCode');
                            var color = '#' + JSGetHEx(r.getValue()) + JSGetHEx(g.getValue()) + JSGetHEx(b.getValue()) + '';
                            color = color.toLocaleUpperCase();
                            displayCode.diySetValue(color);
                        }
                    }
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'displayCode',
                    fieldLabel: i18n.getKey('RGB颜色值'),
                    allowBlank: false,
                    editable: false,
                    hidden: true,
                    disabled: true,
                    layout: 'hbox',
                    defaults: {},
                    itemId: 'displayCode',
                    diySetValue: function (data) {
                        var me = this;
                        var displayCode = me.getComponent('displayCode');
                        displayCode.setValue(data);
                        var color = me.getComponent('color');
                        color.setValue('<a class=colorpick style="background-color:' + data + '"></a>')
                    },
                    getValue: function () {
                        var me = this;
                        var displayCode = me.getComponent('displayCode');
                        return displayCode.getValue();
                    },
                    items: [
                        {
                            name: 'CGP.color.model.ColorModel.displayCode',
                            xtype: 'textfield',
                            value: '#000000',
                            maxLength: 7,
                            minLength: 7,
                            enforceMaxLength: true,
                            flex: 1,
                            /*    readOnly: true,
                                editable: false,
                                fieldStyle: 'background-color:silver',*/
                            itemId: 'displayCode',
                            regex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    console.log(newValue);
                                    var form = field.ownerCt.ownerCt;
                                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
                                        var color = Ext.ux.util.colorRgb(newValue);
                                        console.log(color);
                                        var r = form.getComponent('r');
                                        var g = form.getComponent('g');
                                        var b = form.getComponent('b');
                                        color = color.replace(')', '');
                                        color = color.replace('RGB(', '');
                                        var colors = color.split(',')
                                        r.setValue(colors[0]);
                                        g.setValue(colors[1]);
                                        b.setValue(colors[2]);
                                    }
                                }
                            }
                        },
                        {
                            name: 'color',
                            xtype: 'displayfield',
                            itemId: 'color',
                            width: 30,
                            fieldStyle: {
                                margin: 0
                            },
                            value: '<a class=colorpick style="background-color:#ffffff"></a>'
                        }
                    ]
                },
                /*{
                    name: 'displayCode',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('displayCode'),
                    allowBlank: false,
                    editable: false,
                    hidden: true,
                    disabled: true,
                    value: '#000000',
                    fieldStyle: 'background-color:silver',
                    itemId: 'displayCode'
                },*/
                {
                    xtype: 'colorgridcombo',
                    fieldLabel: i18n.getKey('显示颜色'),
                    allowBlank: false,
                    valueField: '_id',
                    displayField: 'colorName',
                    store: Ext.create('CGP.color.store.ColorStore', {
                        params: {
                            filter: Ext.JSON.encode([{
                                name: 'clazz',
                                type: 'string',
                                value: 'com.qpp.cgp.domain.common.color.RgbColor'
                            }])
                        }
                    }),
                    editable: false,
                    itemId: 'displayColor',
                    name: 'displayColor',
                    matchFieldWidth: false,
                }
            ]
        }
    });
});
