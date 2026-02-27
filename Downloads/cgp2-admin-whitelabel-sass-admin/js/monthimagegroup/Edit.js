Ext.Loader.syncRequire([
    'CGP.monthimagegroup.model.MonthImageGroupModel',
    'CGP.monthimagegroup.view.ImageGroup',
    'CGP.monthimagegroup.view.ImageConditionPanel'
]);
Ext.onReady(function () {
    var controller = Ext.create("CGP.monthimagegroup.controller.Controller");
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'errorstrickform',
                layout: 'vbox',
                defaults: {
                    margin: '10 25 5 25'
                },
                tbar: [
                    {
                        xtype: 'button',
                        iconCls: 'icon_add',
                        text: i18n.getKey('save'),
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var data = form.getValue();
                            console.log(data)
                            controller.saveConfig(data, form);

                        }
                    }
                ],
                setValue: function (data) {
                    var me = this;
                    var id = me.getComponent('_id');
                    var description = me.getComponent('description');
                    var monthImageConditions = me.getComponent('monthImageConditions');
                    id.setValue(data._id);
                    description.setValue(data.description);
                    monthImageConditions.setValue(data.monthImageConditions);
                },
                getValue: function () {
                    var me = this;
                    var result = {};
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.diyGetValue) {
                            result[item.name] = item.diyGetValue();
                        } else if (item.getValue) {
                            result[item.name] = item.getValue();
                        }
                    }
                    return result;
                },
                items: [
                    {
                        name: '_id',
                        xtype: 'textfield',
                        hidden: true,
                        fieldLabel: i18n.getKey('_id'),
                        itemId: '_id'
                    },
                    {
                        name: 'clazz',
                        xtype: 'textfield',
                        hidden: true,
                        value: 'com.qpp.cgp.domain.preprocess.holiday.MonthImageGroup',
                        fieldLabel: i18n.getKey('clazz'),
                        itemId: 'clazz'
                    },
                    {
                        name: 'description',
                        xtype: 'textarea',
                        grow: true,
                        width: 450,
                        fieldLabel: i18n.getKey('description'),
                        itemId: 'description'
                    },
                    {
                        xtype: 'toolbar',
                        color: 'black',
                        width: '100%',
                        bodyStyle: 'border-color:white;',
                        border: '0 0 0 0',
                        margin: '10 25 0 25',
                        itemId: 'templateConfigToolBar',
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldLabel: false,
                                width: 120,
                                value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('各种语言的月份图') + '</font>'
                            },
                            {
                                xtype: 'button',
                                itemId: 'add',
                                text: i18n.getKey('add'),
                                iconCls: 'icon_add',
                                handler: function (btn) {
                                    var form = btn.ownerCt.ownerCt;
                                    var tab = form.getComponent('monthImageConditions');
                                    tab.show();
                                    var panel = tab.insert({
                                        xtype: 'imageconditionpanel',
                                        title: i18n.getKey('config_') + tab.items.items.length,
                                    });
                                    tab.setActiveTab(panel);
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'tabpanel',
                        header: false,
                        width: '100%',
                        margin: '0 25 5 25',
                        name: 'monthImageConditions',
                        itemId: 'monthImageConditions',
                        flex: 1,
                        bodyStyle: 'border-color:silver;',
                        items: [],
                        setValue: function (data) {
                            var tab = this;
                            tab.show();
                            if (data) {
                                for (var i = 0; i < data.length; i++) {
                                    tab.add({
                                        xtype: 'imageconditionpanel',
                                        rawData: data[i],
                                        title: i18n.getKey('config_') + tab.items.items.length,
                                    })
                                }
                            }
                        },
                        getName: function () {
                            var me = this;
                            return me.name;
                        },
                        getValue: function () {
                            var me = this;
                            var result = [];
                            for (var i = 0; i < me.items.items.length; i++) {
                                result.push(me.items.items[i].getValue());
                            }
                            return result;
                        }
                    }
                ],

                listeners: {
                    afterrender: function () {
                        var form = this;
                        var id = JSGetQueryString('id');
                        if (id) {
                            CGP.monthimagegroup.model.MonthImageGroupModel.load(id, {
                                scope: this,
                                failure: function (record, operation) {
                                },
                                success: function (record, operation) {
                                    form.setValue(record.raw);
                                },
                                callback: function (record, operation) {
                                }
                            })
                        }
                    }
                }
            }
        ]
    })
});
