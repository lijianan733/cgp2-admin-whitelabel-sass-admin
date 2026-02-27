/**
 * Created by nan on 2020/4/16.
 * 显示上下文，包含提示模板，和上下文变量gird，可以通过点击grid中的属性直接添加到文本域中
 * 上下文变量-产品的属性，特殊的输入值
 * 转换程序
 *
 *
 */
Ext.define('CGP.common.condition.view.ContextWindow', {
    extend: 'Ext.window.Window',
    constrain: true,
    modal: false,
    title: i18n.getKey('上下文信息'),
    width: 510,
    height: 450,
    layout: {
        type: 'fit'
    },
    expressionTextarea: null,//表达式的输入框
    defaults: {
        padding: '5 25 5 25',
        labelAlign: 'top'
    },
    templateInfo: null,
    contentAttributeStore: null,
    initComponent: function () {
        var me = this;
        var contextData = me.contextData;
        me.items = [
            {
                xtype: 'grid',
                viewConfig: {
                    id: 'contextWindowGirdView'
                },
                listeners: {
                    celldblclick: function (gridView, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                        var win = gridView.ownerCt.ownerCt;
                        if (win.expressionTextarea) {
                            var attribute = record.get('displayName');
                            var result = win.expressionTextarea.getValue();
                            result += ' {' + attribute + '} ';
                            win.expressionTextarea.setValue(result);
                        }
                    }
                },
                store: me.contentAttributeStore,
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
                                    var win = gridView.ownerCt.ownerCt;
                                    if (win.expressionTextarea) {
                                        var attribute = record.get('displayName');
                                        var result = win.expressionTextarea.getValue();
                                        result += ' {' + attribute + '} ';
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
                        text: i18n.getKey('displayName'),
                        dataIndex: 'displayName',
                        renderer: function (value, matedata, record) {
                            return value;
                        }
                    }
                ]

            }
        ];
        me.callParent();
    }
})
