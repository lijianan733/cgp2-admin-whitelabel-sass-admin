/**
 * Created by nan on 2020/4/16.
 * 显示上下文，包含提示模板，和上下文变量gird，可以通过点击grid中的属性直接添加到文本域中
 * 上下文本变量-产品的属性，特殊的输入值
 * 转换程序
 *
 *
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.ContextWindow', {
    extend: 'Ext.window.Window',
    constrain: true,
    modal: false,
    title: i18n.getKey('提示信息'),
    layout: 'vbox',
    width: 510,
    height: 450,
    expressionTextarea: null,//表达式的输入框
    defaults: {
        padding: '5 25 5 25',
        labelAlign: 'top'
    },
    templateInfo: null,
    contextData: null,//上下文数据
    initComponent: function () {
        var me = this;
        var contextData = me.contextData;

        console.log(contextData);
        me.items = [

            {
                xtype: 'textarea',
                fieldLabel: i18n.getKey('表达式模板'),
                value: me.templateInfo,
                height: 120,
                width: 450,

            }, {
                xtype: 'gridfield',
                fieldLabel: i18n.getKey('可用上下文变量'),
                width: 450,
                height: 200,
                msgTarget: 'none',
                gridConfig: {
                    height: 220,
                    viewConfig: {
                        id: 'contextWindowGirdView'
                    },
                    maxHeight: 200,
                    renderTo: JSGetUUID(),
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'id', type: 'string'},
                            {name: 'name', type: 'string'},
                            {name: 'value', type: 'string'}
                        ],
                        data: contextData
                    }),
                    columns: [
                        {
                            xtype: 'actioncolumn',
                            width: 30,
                            hidden: !me.expressionTextarea,
                            items: [
                                {
                                    iconCls: 'icon_add',  // Use a URL in the icon config
                                    tooltip: '加入表达式',
                                    handler: function (gridView, rowIndex, colIndex, a, b, record) {
                                        var win = gridView.ownerCt.gridField.ownerCt;
                                        if (win.expressionTextarea) {
                                            var attribute = record.get('value');
                                            var result = win.expressionTextarea.getValue();
                                            result += attribute;
                                            win.expressionTextarea.setValue(result);
                                        }
                                    }
                                }
                            ]
                        },
                        /* {
                             text: i18n.getKey('attribute') + i18n.getKey('id'),
                             dataIndex: 'id',
                         },*/
                        {
                            flex: 1,
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            renderer: function (value, matedata, record) {
                                return value + (record.get('id') ? '(' + record.get('id') + ')的值' : '');
                            }
                        }
                    ]
                }
            }
        ];
        me.callParent();
    }
})
