/**
 * Created by nan on 2019/5/13.
 * 由于是动态加载common包的
 * create关键字会提前加载，widget不会，
 * 故必须提前静态引入
 *   commonPartFieldConfig: {
                        defaultValueConfig: {
                            clazzSetReadOnly: true,
                            clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                            type: 'Boolean',
                            typeSetReadOnly: true
                        }
                    }
 */
Ext.define('CGP.common.valueExV3.ValueExComponentColumn', {
    extend: 'Skirtle.grid.column.Component',
    alias: 'widget.valueexcomponentcolumn',
    commonPartFieldConfig: null,//配置默认值和是否可以编辑clazz,type
    winTitle: null,//编辑弹窗的title
    nullCanEdit: true,//在渲染时，如果valueEx值为null,是否返回null，还是一个编辑的按钮
    canChangeValue: true,//是否可以通过编辑改变record的
    readOnly: false,
    saveHandler: null,//自定义的保存的操作
    constructor: function () {
        var me = this;
        me.commonPartFieldConfig = {};
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.renderer = function (value, mete, record, rowIndex, colIndex, store, gridView) {
            var dataIndex = this.headerCt.columnManager.columns[colIndex].dataIndex;
            var disPlayStr = null;
            if (Ext.isEmpty(value) || Ext.Object.isEmpty(value)) {
                if (me.nullCanEdit) {
                    if (me.readOnly == true) {
                        disPlayStr = i18n.getKey('check');
                    } else {
                        disPlayStr = i18n.getKey('edit');
                    }
                } else {
                    return null;//没有值时直接返回空
                }
            } else {
                if (value.clazz == 'com.qpp.cgp.value.ConstantValue') {
                    disPlayStr = value.value;

                } else if (value.clazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                    disPlayStr = '查看表达式';
                } else if (value.clazz == 'com.qpp.cgp.value.JsonPathValue') {
                    disPlayStr = value.path;
                }
            }
            return {
                xtype: 'button',
                text: disPlayStr.toString(),
                value: value,
                cls: 'a-btn',
                rendererArguments: arguments,
                tooltip: i18n.getKey('点击进行编辑'),
                itemId: 'diyConditionExpression',
                flex: 4,
                border: false,
                getValue: function () {
                    var me = this;
                    return me.value;
                },
                setValue: function (value) {
                    var me = this;
                    me.value = value;
                },
                handler: function (button) {
                    var valueEx = Ext.create('CGP.common.valueExV3.GroupGridTab', {
                        itemId: 'diyConditionExpressionWindow',
                        readOnly: !me.canChangeValue,
                        commonPartFieldConfig: Ext.Object.merge({}, me.commonPartFieldConfig),
                        listeners: {
                            'afterrender': function (view) {
                                if (!Ext.Object.isEmpty(button.value)) {//不为一个空对象
                                    view.getGridPanel().setValue(button.value.constraints);
                                    view.getFormPanel().setValue(button.value);
                                } else {
                                    view.getGridPanel().setValue({});
                                }
                            }
                        }
                    });
                    var win = Ext.create('Ext.window.Window', {
                        modal: true,
                        constrain: true,
                        maximizable: true,
                        editButton: button,
                        layout: 'fit',
                        width: '60%',
                        height: '70%',
                        title: me.winTitle || (i18n.getKey('check') + i18n.getKey(dataIndex)),
                        items: [valueEx],
                        bbar: {
                            hidden: !me.canChangeValue,
                            items:
                                [
                                    '->',
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('confirm'),
                                        iconCls: 'icon_agree',
                                        handler: me.saveHandler || function (btn) {
                                            var formPanel = btn.ownerCt.ownerCt.getComponent('diyConditionExpressionWindow').getFormPanel();
                                            var gridPanelValue = btn.ownerCt.ownerCt.getComponent('diyConditionExpressionWindow').getGridPanelValue();
                                            var formPanelValue = btn.ownerCt.ownerCt.getComponent('diyConditionExpressionWindow').getFormPanelValue();
                                            formPanelValue.constraints = gridPanelValue;
                                            if (!formPanel.isValid()) {
                                                return
                                            } else {
                                                if (formPanelValue.clazz == 'com.qpp.cgp.value.ExpressionValueEx' && Ext.isEmpty(formPanelValue.expression)) {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), '基本信息中的表达式不能为空！')
                                                } else {
                                                    button.value = formPanelValue;
                                                    store.proxy.data[rowIndex][dataIndex] = formPanelValue;
                                                    store.load();
                                                    win.close();
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('cancel'),
                                        iconCls: 'icon_cancel',
                                        handler: function (btn) {
                                            win.close();
                                        }
                                    }
                                ]
                        }
                    })
                    win.show();
                }
            }
        };
        me.callParent();
    }
})
