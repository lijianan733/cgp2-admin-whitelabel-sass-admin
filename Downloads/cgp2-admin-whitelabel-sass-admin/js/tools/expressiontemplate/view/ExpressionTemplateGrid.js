/**
 * @Description:
 * @author nan
 * @date 2023/2/16
 */
Ext.Loader.syncRequire([
    'CGP.tools.expressiontemplate.store.Store'
])
Ext.define('CGP.tools.expressiontemplate.view.ExpressionTemplateGrid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    alias: 'widget.expressiontemplategrid',
    tags: [
        {
            value: 'bom',
            display: 'bom'
        }, {
            value: 'view',
            display: 'view'
        },
        {
            value: 'imposition',
            display: 'imposition'
        }, {
            value: 'design',
            display: 'design'
        }, {
            value: 'materialMapping',
            display: '物料映射'
        },
        {
            value: 'attributeMapping',
            display: '属性映射'
        },
        {
            value: 'navigate',
            display: 'builder导航'
        },
        {
            value: 'builderView',
            display: 'builderView'
        }, {
            value: 'pmvt/smvt',
            display: 'pmvt/smvt'
        }, {
            value: 'other',
            display: 'other'
        }
    ],
    editRecord: function (record, grid) {
        var tags = grid.ownerCt.tags;
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: i18n.getKey(record ? 'edit' : 'create') + '模板',
            layout: 'fit',
            width: 800,
            height: 600,
            maximizable: true,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    isValidForItems: true,
                    defaults: {
                        width: 450,
                        margin: '5px 25px 5px 25px',
                        allowBlank: false,
                    },

                    layout: {
                        type: 'vbox'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'name',
                            itemId: 'name',
                            fieldLabel: i18n.getKey('name')
                        },
                        {
                            xtype: 'combo',
                            name: 'tag',
                            itemId: 'tag',
                            fieldLabel: '标签',
                            valueField: 'value',
                            displayField: 'display',
                            haveReset: true,
                            editable: true,
                            tipInfo: '其他特定常用标签,联系开发人员添加',
                            store: {
                                xtype: 'store',
                                fields: ['value', 'display'],
                                data: tags
                            },
                        },
                        {
                            xtype: 'combo',
                            name: 'resultType',
                            itemId: 'resultType',
                            fieldLabel: '结果值类型',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            value: 'String',
                            store: {
                                xtype: 'store',
                                fields: ['value', 'display'],
                                data: [
                                    {
                                        value: 'String',
                                        display: 'String'
                                    }, {
                                        value: 'Number',
                                        display: 'Number'
                                    },
                                    {
                                        value: 'Boolean',
                                        display: 'Boolean'
                                    }, {
                                        value: 'Array',
                                        display: 'Array'
                                    },
                                    {
                                        value: 'Map',
                                        display: 'Map'
                                    }
                                ]
                            },
                        },
                        {
                            xtype: 'textarea',
                            name: 'description',
                            itemId: 'description',
                            fieldLabel: i18n.getKey('description')
                        },
                        {
                            xtype: 'uxtextarea_v2',
                            name: 'expression',
                            itemId: 'expression',
                            fieldLabel: i18n.getKey('expression'),
                            width: '100%',
                            flex: 1,
                            toolbarConfig: {
                                items: [
                                    {
                                        xtype: 'button',
                                        text: '简单示例',
                                        iconCls: 'icon_test',
                                        handler: function (btn) {
                                            var me = this;
                                            var expressionField = me.up('[xtype=uxtextarea_v2]');
                                            var str = "function expression(args) {\n" +
                                                "            if (1 >2) {\n" +
                                                "                return true;\n" +
                                                "            } else if (1 < 2) {\n" +
                                                "                return false;\n" +
                                                "            } else {\n" +
                                                "                return false;\n" +
                                                "            }\n" +
                                                "        }\n";
                                            expressionField.setValue(expressionField.getValue() + str);
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        text: '校验语法',
                                        iconCls: 'icon_test',
                                        handler: function (btn) {
                                            var me = this;
                                            var expressionField = me.up('[xtype=uxtextarea_v2]');
                                            if (expressionField.isValid()) {
                                                var data = expressionField.getValue();
                                                try {
                                                    data = '(' + data + ')';
                                                    eval(data);
                                                    Ext.Msg.alert(i18n.getKey('prompt'), '合法表达式');
                                                } catch (e) {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), e);
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: 'button',
                                        iconCls: 'icon_test',
                                        text: '<font color="red">测试运行</font>',
                                        handler: function () {
                                            var me = this;
                                            var expressionField = me.up('[xtype=uxtextarea_v2]');
                                            if (expressionField.isValid()) {
                                                var expression = expressionField.getValue();
                                                var resultType = expressionField.ownerCt.getComponent('resultType');
                                                JSValidValueEx({
                                                    "clazz": "com.qpp.cgp.expression.Expression",
                                                    "expression": expression,
                                                    "expressionEngine": "JavaScript",
                                                    "resultType": resultType.getValue() || 'String'
                                                });
                                            }
                                        }
                                    }, {
                                        xtype: 'button',
                                        iconCls: 'icon_test',
                                        text: i18n.getKey('格式化'),
                                        handler: function () {
                                            var me = this;
                                            var expressionField = me.up('[xtype=uxtextarea_v2]');
                                            var tabchar = ' ';
                                            var tabsize = '1';
                                            expressionField.setValue(window.js_beautify(expressionField.getValue(), tabsize, tabchar));
                                        }
                                    }]
                            }
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'clazz',
                            itemId: 'clazz',
                            value: 'com.qpp.cgp.domain.partner.cooperation.manufacture.ExpressionTemplate'
                        }
                    ],
                    listeners: {
                        afterrender: function () {
                            var form = this;
                            record ? form.setValue(record.getData()) : null;
                        }
                    }
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.getComponent('form');
                        if (form.isValid()) {
                            var data = form.getValue();
                            var url = adminPath + 'api/expressionTemplates';
                            var method = 'POST';
                            var msg = i18n.getKey('创建成功');
                            if (record) {
                                url = adminPath + 'api/expressionTemplates/' + record.getId();
                                method = 'PUT';
                                msg = i18n.getKey('修改成功');
                            }
                            JSAjaxRequest(url, method, true, data, msg, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    win.close();
                                    grid.store.load();
                                }
                            })
                        }
                    }
                }
            }
        });
        win.show();
    },
    tbarCfg: null,
    initComponent: function () {
        var me = this;
        /**
         * 测试自动发布
         */
        var store = Ext.create('CGP.tools.expressiontemplate.store.Store', {});
        me.gridCfg = Ext.Object.merge({
            tbar: Ext.Object.merge({
                xtype: 'uxstandardtoolbar',
                disabledButtons: ['config', 'export', 'import'],
                hiddenButtons: ['read', 'clear'],
                btnCreate: {
                    handler: function (btn) {
                        var uxgrid = btn.ownerCt.ownerCt;
                        uxgrid.ownerCt.editRecord(null, uxgrid);
                    }
                }
            }, me.tbarCfg),
            store: store,
            frame: false,
            selType: 'simple',
            deleteAction: true,
            editAction: true,
            editActionHandler: function (gridView, rowIndex, colIndex, a, b, record) {//编辑按钮的映射
                var uxgrid = gridView.ownerCt;
                uxgrid.ownerCt.editRecord(record, uxgrid);
            },
            columns: [
                {
                    width: 150,
                    dataIndex: 'name',
                    text: i18n.getKey('name')
                }, {
                    width: 150,
                    dataIndex: 'tag',
                    text: i18n.getKey('tags'),
                    renderer: function (value, metadata, record, a, b, c, view) {
                        var tags = this.ownerCt.tags;
                        var result = '';
                        tags.map(function (item) {
                            if (item.value == value) {
                                result = item.display;
                            }
                        });
                        return result || value;
                    }
                },
                {
                    width: 100,
                    dataIndex: 'resultType',
                    text: i18n.getKey('resultType')
                },
                {
                    width: 300,
                    dataIndex: 'description',
                    text: i18n.getKey('description'),
                    renderer: function (value) {
                        return JSAutoWordWrapStr(value);
                    }
                },
                {
                    xtype: 'atagcolumn',
                    minWidth: 100,
                    flex: 1,
                    dataIndex: 'expression',
                    text: i18n.getKey('expression'),
                    getDisplayName: function () {
                        return '<a href="#">查看表达式</a>';
                    },
                    clickHandler: function (value, metaData, record) {
                        var win = Ext.create('Ext.window.Window', {
                            layout: 'fit',
                            title: '查看',
                            modal: true,
                            constrain: true,
                            width: 450,
                            height: 450,
                            items: [
                                {
                                    xtype: 'textarea',
                                    value: value
                                }
                            ]
                        });
                        win.show();
                    }
                }]
        }, me.gridCfg);
        me.filterCfg = Ext.Object.merge({
            items: [
                {
                    xtype: 'combo',
                    name: 'tag',
                    itemId: 'tag',
                    fieldLabel: '标签',
                    valueField: 'value',
                    displayField: 'display',
                    editable: true,
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: me.tags
                    },
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    itemId: 'name',
                    fieldLabel: i18n.getKey('name'),
                },
                {
                    xtype: 'textfield',
                    name: 'description',
                    itemId: 'description',
                    fieldLabel: i18n.getKey('description'),
                }
            ]
        }, me.filterCfg);
        me.callParent();
    },
})
