Ext.application({
    requires: 'Ext.container.Viewport',
    name: 'CGP.resource',
    appFolder: '../../../app',
    controllers: [
        'Color'
    ],
    launch: function () {
        Ext.widget({
            block: 'resource/app/view/color',
            xtype: 'uxeditpage',
            accessControl: true,
            gridPage: 'main.html',
            isValidForItems: true,
            formCfg: {
                model: 'CGP.resource.model.Color',
                remoteCfg: false,
                layout: {
                    layout: 'table',
                    columns: 1,
                    tdAttrs: {
                        style: {
                            'padding-right': '120px'
                        }
                    }
                },
                items: [
                    {
                        name: '_id',
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('id'),
                        itemId: '_id',
                        hidden: true
                    },

                    {
                        name: 'name',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name',
                        allowBlank: false
                    },
                    // Ext.create('Ext.picker.Color', {
                    //     value: '993300',  // initial selected color
                    //     renderTo: Ext.getBody(),
                    //     listeners: {
                    //         select: function(picker, selColor) {
                    //             alert(selColor);
                    //         }
                    //     }
                    // }),
                    {
                        name: 'clazz',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('clazz'),
                        itemId: 'clazz',
                        displayField: 'typeName',
                        valueField: 'value',
                        editable: false,
                        allowBlank: false,
                        haveReset: true,
                        readOnly: true,
                        queryMode: 'local',
                        value: 'com.qpp.cgp.domain.pcresource.color.' + JSGetQueryString('colorType'),
                        store: new Ext.data.Store({
                            fields: ['value', 'typeName'],
                            data: [
                                {
                                    typeName: 'RGB',
                                    value: 'com.qpp.cgp.domain.pcresource.color.RGBColor'
                                },
                                {
                                    typeName: 'CMYK',
                                    value: 'com.qpp.cgp.domain.pcresource.color.CMYKColor'
                                },
                                {
                                    typeName: i18n.getKey('Spot'),
                                    value: 'com.qpp.cgp.domain.pcresource.color.SpotColor'
                                }
                            ]
                        })
                    },
                    {
                        xtype: 'uxfieldset',
                        itemId: 'rgbFieldSet',
                        // colspan: 2,
                        title: i18n.getKey('RGB'),
                        hidden: JSGetQueryString('colorType') != 'RGBColor',
                        defaults: {
                            margin: '5 0',
                            allowBlank: JSGetQueryString('colorType') != 'RGBColor',
                            minValue: 0,
                            maxValue: 255,
                            maxLength: 3,
                            enforceMaxLength: true,
                            allowDecimals: false,
                            labelWidth: 90,
                            width: '100%'
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'CGP.resource.model.Color.r',
                                itemId: 'r',
                                fieldLabel: i18n.getKey('R')
                            },
                            {
                                xtype: 'numberfield',
                                name: 'CGP.resource.model.Color.g',
                                itemId: 'g',
                                fieldLabel: i18n.getKey('G')
                            },
                            {
                                xtype: 'numberfield',
                                name: 'CGP.resource.model.Color.b',
                                itemId: 'b',
                                fieldLabel: i18n.getKey('B')
                            },
                            {
                                xtype: 'uxcolorfield',
                                name: 'uxcolorfield',
                                itemId: 'uxcolorfield',
                                maxLength: 7,
                                fieldLabel: i18n.getKey('颜色')
                            }
                        ],
                        listeners: {
                            afterrender: function () {
                                var me = this;
                                var colorDisplay = me.getComponent('uxcolorfield');
                                var form = me;
                                colorDisplay.on('change', function (field, newValue, oldValue) {
                                        console.log(newValue);
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
                                );
                                me.items.items.map(function (item) {
                                    if (item.itemId != 'uxcolorfield') {
                                        item.on('change', function (field, newValue, oldValue) {
                                            var form = field.ownerCt;
                                            var r = form.getComponent('r');
                                            var g = form.getComponent('g');
                                            var b = form.getComponent('b');
                                            var color = '#' + JSGetHEx(r.getValue()) + JSGetHEx(g.getValue()) + JSGetHEx(b.getValue()) + '';
                                            color = color.toLocaleUpperCase();
                                            colorDisplay.setValue(color);
                                        });
                                    }
                                });
                               
                            }
                        }
                    },
                    {
                        xtype: 'uxfieldset',
                        itemId: 'cmykFieldSet',
                        // colspan: 2,
                        title: i18n.getKey('CMYK'),
                        hidden: JSGetQueryString('colorType') != 'CMYKColor',
                        defaults: {
                            margin: '5 0',
                            allowBlank: JSGetQueryString('colorType') != 'CMYKColor',
                            minValue: 0,
                            maxValue: 255,
                            allowDecimals: false,
                            labelWidth: 90,
                            width: '100%'
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'CGP.resource.model.Color.c',
                                itemId: 'c',
                                fieldLabel: i18n.getKey('C')
                            },
                            {
                                xtype: 'numberfield',
                                name: 'CGP.resource.model.Color.m',
                                itemId: 'm',
                                fieldLabel: i18n.getKey('M')
                            },
                            {
                                xtype: 'numberfield',
                                name: 'CGP.resource.model.Color.y',
                                itemId: 'y',
                                fieldLabel: i18n.getKey('Y')
                            },
                            {
                                xtype: 'numberfield',
                                name: 'CGP.resource.model.Color.k',
                                itemId: 'k',
                                fieldLabel: i18n.getKey('K')
                            }
                        ]
                    },
                    {
                        name: 'gray',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('gray'),
                        itemId: 'gray',
                        allowBlank: JSGetQueryString('colorType') != 'SpotColor',
                        hidden: JSGetQueryString('colorType') != 'SpotColor',
                    },


                ]
            },
            listeners: {
                afterload: function (page) {

                }
            }
        });
    }
});