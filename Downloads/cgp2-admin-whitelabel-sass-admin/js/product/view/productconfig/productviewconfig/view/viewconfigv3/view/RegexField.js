/**
 * Created by nan on 2021/8/3
 * 生成正则的文件匹配规则字符串,
 * 文件名，和文件类型
 */

Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config'
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.RegexField', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.regexfield',
    layout: 'hbox',
    defaults: {},
    msgTarget: 'side',
    labelAlign: 'left',
    buildExpression: function (data) {
        var expression = '';
        console.log(data);
        if (data.fileName.type == 'random') {//任意输入
            expression += '^.+';
        } else if (data.fileName.type == 'fix') {//指定文件名
            expression += '^(' + data.fileName.fixValue + ')';
        } else if (data.fileName.type == 'prefix') {//指定前缀+序号
            expression += '^(' + data.fileName.prefix + ')\\d+';
        }
        expression += '\\.(' + data.fileType.join('|') + ')$'
        return expression;
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'combo',
                name: 'regex',
                itemId: 'regex',
                titleField: 'title',
                displayField: 'display',
                valueField: 'value',
                flex: 1,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: '[A-Za-z0-9]*.pdf$',
                            display: '[A-Za-z0-9]*.pdf$',
                            title: '只能以字母和数字组合为名称的pdf文件'
                        }
                    ]
                }),
                listeners: {
                    change: function (field, NewValue, oldValue) {
                        field.ownerCt.isValid();
                    }
                }
            },
            {
                xtype: 'button',
                name: 'diyBuild',
                itemId: 'diyBuild',
                width: 80,
                margin: '0 0 0 5',
                text: i18n.getKey('自定义'),
                handler: function (btn) {
                    var me = btn.ownerCt;
                    var win = Ext.create('Ext.window.Window', {
                        modal: true,
                        constrain: true,
                        title: i18n.getKey('diy') + i18n.getKey('expression'),
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'errorstrickform',
                                defaults: {
                                    width: 350,
                                    margin: '10 25 5 25',
                                },
                                isValidForItems: true,
                                items: [
                                    {
                                        xtype: 'uxfieldcontainer',
                                        fieldLabel: i18n.getKey('文件名规则'),
                                        name: 'fileName',
                                        itemId: 'fileName',
                                        allowBlank: true,
                                        resultType: 'String',//该组件获取结果和设置值的数据类型
                                        allowDiyInput: true,//是否允许自定字符串
                                        defaults: {
                                            width: '100%',
                                            margin: '10 0 5 50',
                                            labelWidth: 50,
                                        },
                                        items: [
                                            {
                                                xtype: 'combo',
                                                name: 'type',
                                                itemId: 'type',
                                                fieldLabel: i18n.getKey('type'),
                                                valueField: 'value',
                                                displayField: 'display',
                                                editable: false,
                                                value: 'fix',
                                                store: Ext.create('Ext.data.Store', {
                                                    fields: ['value', 'display'],
                                                    data: [
                                                        {
                                                            value: 'fix',
                                                            display: '指定文件名'
                                                        },
                                                        {
                                                            value: 'prefix',
                                                            display: '指定前缀+任意序号'
                                                        },
                                                        {
                                                            value: 'random',
                                                            display: '任意文件名'
                                                        }
                                                    ]
                                                }),
                                                listeners: {
                                                    change: function (field, newValue, oldValue) {
                                                        var fixValue = field.ownerCt.getComponent('fixValue');
                                                        var prefix = field.ownerCt.getComponent('prefix');
                                                        if (newValue == 'fix') {
                                                            fixValue.show();
                                                            fixValue.setDisabled(false);
                                                            prefix.hide();
                                                            prefix.setDisabled(true);
                                                        } else if (newValue == 'prefix') {
                                                            fixValue.hide();
                                                            fixValue.setDisabled(true);
                                                            prefix.show();
                                                            prefix.setDisabled(false);
                                                        } else if (newValue == 'random') {
                                                            fixValue.hide();
                                                            fixValue.setDisabled(true);
                                                            prefix.hide();
                                                            prefix.setDisabled(true);
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'textfield',
                                                name: 'fixValue',
                                                itemId: 'fixValue',
                                                fieldLabel: i18n.getKey('文件名'),
                                            },
                                            {
                                                xtype: 'textfield',
                                                name: 'prefix',
                                                itemId: 'prefix',
                                                hidden: true,
                                                disabled: true,
                                                fieldLabel: i18n.getKey('前缀'),
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'arraydatafield',
                                        fieldLabel: i18n.getKey('文件类型'),
                                        name: 'fileType',
                                        itemId: 'fileType',
                                        allowBlank: false,
                                        height: 150,
                                        resultType: 'Array',//该组件获取结果和设置值的数据类型
                                        allowDiyInput: true,//是否允许自定字符串
                                        optionalData: [
                                            {
                                                value: 'pdf',
                                                display: 'pdf'
                                            },
                                            {
                                                value: 'jpg',
                                                display: 'jpg'
                                            },
                                            {
                                                value: 'jpeg',
                                                display: 'jpeg'
                                            },
                                            {
                                                value: 'bmp',
                                                display: 'bmp'
                                            },
                                            {
                                                value: 'png',
                                                display: 'png'
                                            },
                                            {
                                                value: 'gif',
                                                display: 'gif'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        bbar: [
                            '->',
                            {
                                xtype: 'button',
                                text: i18n.getKey('confirm'),
                                iconCls: 'icon_agree',
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var form = win.items.items[0];
                                    if (form.isValid()) {
                                        var data = form.getValue();
                                        var expression = me.buildExpression(data);
                                        me.setValue(expression);
                                        win.close();
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('cancel'),
                                iconCls: 'icon_cancel',
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    win.close();
                                }
                            }
                        ]
                    });
                    win.show();

                }
            }
        ];
        me.callParent();
    },
    setValue: function (data) {
        this.getComponent('regex').setValue(data);
    },
    getValue: function () {
        return this.getComponent('regex').getValue();
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.allowBlank == false && me.disabled == false) {
            isValid = !Ext.isEmpty(me.getValue());
        } else {
            isValid = true;
        }
        if (isValid) {
            me.clearError();
            me.unsetActiveError();
        } else {
            me.setActiveError('不允许为空');
            me.renderActiveError();
        }
        me.doLayout();
        return isValid;
    },
    getErrors: function () {
        return '不允许为空'
    },
    clearError: function () {
        var me = this;
        if (me.errorEl) {
            //隐藏错误提示信息的dom
            me.errorEl.dom.setAttribute('style', 'display: none');
        }
    },
    reset: function () {
        this.setValue(null);
    },
})