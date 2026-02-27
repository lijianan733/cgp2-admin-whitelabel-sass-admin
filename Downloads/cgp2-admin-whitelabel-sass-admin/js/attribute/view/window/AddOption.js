Ext.define("CGP.attribute.view.window.AddOption", {
    extend: 'Ext.window.Window',
    mixins: ["Ext.ux.util.ResourceInit"],

    record: null,//一个option选项
    controller: null,//MainController
    btnFunction: Ext.emptyFn,//点击ok时触发的方法。


    modal: true,
    //closeAction: 'closeAction',
    resizable: false,
    buttonAlign: 'left',
    layout: 'fit',
    bodyStyle: {
        padding: '10px',
        paddingTop: '20px'
    },
    initComponent: function () {
        var me = this;
        if (me.record.get("id") != null && me.record.get("id") > 0) {
            me.title = i18n.getKey('edit');
        } else {
            me.title = i18n.getKey('create');
        }
        var form = {
            xtype: 'form',
            width: 500,
            height: 150,
            defaults: {
                width: 350,
                msgTarget: 'side'
            },
            border: false,
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    allowBlank: false,
                    regex: /^\S+.*\S+$/,
                    regexText: '值的首尾不能存在空格！',
                    itemId: 'name',
                    value: me.record.get("name")
                }, {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('displayValue'),
                    itemId: 'displayValue',
                    enforceMaxLength: true,
                    regex: me.valueType == 'Color' ? /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ : '',
                    regexText: '请输入十六进制颜色值！',
                    value: me.record.get("displayValue")
                }, {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('value'),
                    itemId: 'value',
                    allowBlank: false,
                    value: me.record.get("value")
                },
                {
                    xtype: 'numberfield',
                    readOnly: true,
                    hidden: true,
                    fieldStyle: 'background-color:silver',
                    fieldLabel: i18n.getKey('sortOrder'),
                    itemId: 'sortOrder',
                    value: me.record.get("sortOrder")
                },
                {
                    xtype: 'textfield',
                    /*hidden: true,*/
                    fieldLabel: i18n.getKey('imageUrl'),
                    itemId: 'imgUrl',
                    value: me.record.get("imageUrl")
                }
            ]
        }
        me.items = [form];
        me.listeners = {
            'close': function (){
                me.destroy();
            }
        };
        me.bbar = [
            {
                xtype: 'button',
                text: i18n.getKey('config') + i18n.getKey('multilingual'),
                iconCls: 'icon_multilangual',
                hidden: /*Ext.isEmpty(me.record.get("id")) || */me.record.get("id") < 0,
                itemId: 'multilangual',
                handler: function () {
                    var record = me.record;
                    var id = record.getId();
                    var title = 'option';
                    var multilingualKey = record.get('multilingualKey');
                    JSOpen({
                        id: 'edit' + '_multilingual',
                        url: path + "partials/common/editmultilingual.html?id=" + id + '&title=' + title + '&multilingualKey=' + multilingualKey,
                        title: i18n.getKey(title) + i18n.getKey('multilingual') + i18n.getKey('config') + '(' + i18n.getKey('id') + ':' + id + ')',
                        refresh: true
                    })
                }
            }, {
                text: i18n.getKey('optional') + i18n.getKey('color'),
                itemId: 'optionalColor',
                hidden: me.valueType != 'Color',
                handler: function (btn) {
                    me.checkColorWin();
                }
            },
            '->',
            {
                text: i18n.getKey('ok'),
                itemId: 'okBtn',
                iconCls: 'icon_agree',
                handler: function (btn) {
                    var form = me.down('form');
                    var name = form.getComponent('name').getValue();
                    var sortOrder = form.getComponent('sortOrder').getValue();
                    var imgUrl = form.getComponent('imgUrl').getValue();
                    var value = form.getComponent('value').getValue();
                    var displayValue = form.getComponent('displayValue').getValue();
                    if (form.isValid()) {
                        me.btnFunction.call(me.controller, me.record, name, sortOrder, imgUrl, value, displayValue);
                        me.close();
                    }

                }
            },
            {
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    me.close();
                }
            }
        ];
        me.callParent(arguments);
        me.optionalForm = me.down('form');
        me.on("render", function (cmp) {
            me.body.on("keydown", function (event, target) {
                if (event.button == 12) {
                    var button = me.child("toolbar").getComponent("okBtn");
                    button.handler();
                }
            });
        });
    },

    reset: function (record) {
        var me = this;
        var form = this.down('form');
        me.record = record;
        if (record.get("id") != null && record.get("id") > 0) {
            me.setTitle(i18n.getKey('edit'));
        } else {
            me.setTitle(i18n.getKey('create'));
        }
        form.getComponent("name").setValue(record.get("name"));
        form.getComponent("sortOrder").setValue(record.get("sortOrder"));
        form.getComponent("imgUrl").setValue(record.get("imageUrl"));
        form.getComponent("value").setValue(record.get("value"));
        form.getComponent("displayValue").setValue(record.get("displayValue"));
    },
    checkColorWin: function () {
        var me = this;
        var colorStore = Ext.create('CGP.color.store.ColorStore');
        Ext.create('Ext.window.Window', {
            title: '',
            itemId: '',
            modal: true,
            autoShow: true,
            bbar: [
                '->', {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    itemId: 'modifyPassword',
                    iconCls: 'icon_agree',
                    handler: function () {
                        var form = this.ownerCt.ownerCt.down('form');
                        var editForm = me.down('form')
                        if (form.isValid()) {
                            var color = form.getComponent('withColor').diyGetValue();
                            var nameComp = editForm.getComponent('name');
                            var displayValueComp = editForm.getComponent('displayValue');
                            var valueComp = editForm.getComponent('value');
                            nameComp.setValue(color.colorName);
                            displayValueComp.setValue(color.colorName);
                            valueComp.setValue(color.displayCode);
                            this.ownerCt.ownerCt.close();

                        }
                    }
                }
            ],
            items: [{
                xtype: 'form',
                border: false,
                items: [{
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('withColor'),
                    allowBlank: false,
                    valueField: '_id',
                    padding: '10 10 5 20',
                    displayField: 'colorName',
                    width: 350,
                    colspan: 1,
                    store: colorStore,
                    editable: false,
                    itemId: 'withColor',
                    name: 'withColor',
                    matchFieldWidth: false,
                    filterCfg: {
                        minHeight: 60,
                        layout: {
                            type: 'column',
                            columns: 2
                        },
                        items: [
                            {
                                name: '_id',
                                xtype: 'textfield',
                                hideTrigger: true,
                                isLike: false,
                                allowDecimals: false,
                                fieldLabel: i18n.getKey('id'),
                                itemId: '_id'
                            }, {
                                name: 'colorName',
                                xtype: 'textfield',
                                hideTrigger: true,
                                isLike: false,
                                margin: 0,
                                allowDecimals: false,
                                fieldLabel: i18n.getKey('color') + i18n.getKey('name'),
                                itemId: 'colorName'
                            }
                        ]
                    },
                    gridCfg: {
                        store: colorStore,
                        width: 600,
                        height: 300,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: '_id',
                                itemId: '_id',
                            }, {
                                text: i18n.getKey('color') + i18n.getKey('name'),
                                dataIndex: 'colorName',
                                itemId: 'colorName',
                                width: 110,
                            }, {
                                text: i18n.getKey('type'),
                                dataIndex: 'clazz',
                                itemId: 'clazz',
                                width: 110,
                                renderer: function (value, mateData, record) {
                                    if (value == 'com.qpp.cgp.domain.common.color.RgbColor') {
                                        return 'RGB颜色';
                                    } else if (value == 'com.qpp.cgp.domain.common.color.CmykColor') {
                                        return 'CMYK颜色';

                                    } else if (value == 'com.qpp.cgp.domain.common.color.SpotColor') {
                                        return 'SPOT颜色';
                                    }
                                }
                            }, {
                                text: i18n.getKey('value'),
                                dataIndex: 'clazz',
                                width: 150,
                                itemId: 'value',
                                renderer: function (value, mateData, record) {
                                    if (value == 'com.qpp.cgp.domain.common.color.RgbColor') {
                                        return 'R:' + record.get('r') + ' G:' + record.get('g') + ' B:' + record.get('b') + '';
                                    } else if (value == 'com.qpp.cgp.domain.common.color.CmykColor') {
                                        return 'C:' + record.get('c') + ' M:' + record.get('m') + ' Y:' + record.get('y') + ' K:' + record.get('k') + '';
                                    }
                                }
                            }, {
                                text: i18n.getKey('显示颜色'),
                                itemId: 'color',
                                dataIndex: 'color',
                                flex: 1,
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: colorStore,
                            displayInfo: true,
                            displayMsg: '',
                            emptyMsg: i18n.getKey('noData')
                        })
                    },
                    diyGetValue: function () {
                        var me = this;
                        var data = me.getSubmitValue();
                        if (data.length > 0) {
                            var colorId = data[0];
                            var colorData = me.getValue()[colorId];
                            return colorData;
                        } else {
                            return null;
                        }
                    }
                }]
            }]
        })
    }
});
