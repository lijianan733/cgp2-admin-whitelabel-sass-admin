/**
 * @Description:自定义表达式组件
 * @author nan
 * @date 2022/9/26
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.UseTemplateBtn',
    'CGP.common.controller.Format',
    'CGP.common.controller.Packer'
])
Ext.define('CGP.common.conditionv2.view.DiyExpressionContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.diy_expression_container',
    style: {
        borderColor: 'silver',
        borderStyle: 'solid',
        borderWidth: '1px'
    },
    itemId: 'diyExpression',
    layout: {
        type: 'accordion',
        titleCollapse: true,
        animate: true,
        multi: true,
        activeOnTop: false
    },
    header: false,
    autoScroll: true,
    checkOnly: false,//是否只查看
    items: [],
    contentTemplate: null,//上下文模板数据
    functionTemplate: '',//方法模板
    contextStore: null,
    isAllowBlank: null,
    /**
     * 在指定dom中光标处加入文本
     */
    insertAtCursor: function (myField, myValue) {
        //IE 浏览器
        if (document.selection) {
            myField.focus();
            sel = document.selection.createRange();
            sel.text = myValue;
            sel.select();
        }
        //FireFox、Chrome等
        else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;

            // 保存滚动条
            var restoreTop = myField.scrollTop;
            myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);

            if (restoreTop > 0) {
                myField.scrollTop = restoreTop;
            }
            myField.focus();
            myField.selectionStart = startPos + myValue.length;
            myField.selectionEnd = startPos + myValue.length;
        } else {
            myField.value += myValue;
            myField.focus();
        }
    },
    /**
     * 显示帮助信息
     */
    showHelpInfo: function () {
        var a = {
            xtype: 'panel',
            closable: true,
            itemId: 'helpPanel',
            title: '条件组件使用帮助',
            flex: 1,
            layout: {
                type: 'vbox'
            },
            autoScroll: true,
            defaults: {
                margin: '5 25 5 25'
            },
            tbar: [
                {
                    xtype: 'displayfield',
                    value: '<font style= "color:green;font-weight: bold">帮助信息</font>'
                }
            ],
            items: [
                {
                    xtype: 'component',
                    html: '<strong>标准格式：</strong>'
                },
                {
                    xtype: 'container',
                    html: "<div>\n" +
                        "    <pre>\n" +
                        "        function expression(args) {\n" +
                        "            if (上下文变量 >'值') {\n" +
                        "                return true;\n" +
                        "            } else if (上下文变量 <'值2') {\n" +
                        "                return false;\n" +
                        "            } else {\n" +
                        "                return false;\n" +
                        "            }\n" +
                        "        }\n" +
                        "   </pre>\n" +
                        "</div>"
                },
                {
                    xtype: 'component',
                    html: '<strong>上下文变量获取方式：</strong>'
                },
                {
                    xtype: 'component',
                    html: '<font>第一步,显示上下文</font>'
                },
                {
                    xtype: 'container',
                    autoEl: 'div',
                    width: 400,
                    height: 230,
                    html: '<img src="' + imageServer + '3b79c5b3185c9f9e4e761826eb5924a6.png' + '">'
                },
                {
                    xtype: 'component',
                    html: '<font>第二步,双击获取上下文</font>'
                },
                {
                    xtype: 'container',
                    width: 400,
                    height: 400,
                    html: '<img src="' + imageServer + '5e168822bc01f7ffbf23768181afd20f.png' + '">'
                },
                {
                    xtype: 'component',
                    html: '<font>第三步,查看加入到表达式中的上下文变量</font>'
                },
                {
                    xtype: 'container',
                    width: 450,
                    height: 180,
                    html: '<img src="' + imageServer + '71a32616f6f4d694eca7bd3195844435.png' + '">'
                },
                {
                    xtype: 'component',
                    html: '<strong>获取到上下文变量的值信息：</strong>'
                },
                {
                    xtype: 'component',
                    html: '<font>第一步,鼠标悬停到需要值信息的上下文变量处,会显示该变量的属性信息<br>' +
                        '第二步,获知属性的值类型和输入方式<br>' +
                        '第三步,如果是选项类型上下文变量,则有选项列表,该变量的值就是选项列表中id列中的值<br>' +
                        '如果是输入类型则自行输入,String类型值例如：“Length”,Number类型的值例如:10000<br></font>'
                },
                {
                    xtype: 'container',
                    width: 600,
                    height: 500,
                    html: '<img src="' + imageServer + '26df0592e1ad77451fe7187e2a63e8f7.png' + '">'
                }
            ]
        };
        var tab = top.Ext.getCmp('tabs');
        var panel = tab.getComponent('helpPanel')
        if (panel) {

        } else {
            panel = tab.add(a);
        }
        tab.setActiveTab(panel);
    },
    /**
     *根据上下文store构建模板上下文
     * @param store
     */
    buildContentTemplate: function (store) {
        var me = this;
        var contentTemplate = {};
        store.data.items.forEach(function (item) {
            var path = item.raw.path;
            path = path + '.' + item.raw.key;
            me.builderObject(path, contentTemplate);
        });
        return contentTemplate;
    },
    /**
     * 组成上下文数据
     * @param path
     * @param object
     */
    builderObject: function (path, object) {
        var index = path.indexOf('.');
        if (index > 0) {
            var str = path.slice(0, index);
            var otherStr = path.slice(index + 1);
            object[str] = object[str] || {};
            arguments.callee(otherStr, object[str]);
        } else {
            object[path] = object[path] || null;
        }
    },
    isValid: function () {
        var me = this;
        var leftPanel = me.items.items[0].getComponent('leftPanel');
        var textarea = leftPanel.items.items[0];
        if (me.hidden == false) {
            try {
                eval(leftPanel.diyGetValue())
            } catch (e) {
                textarea.setActiveError(i18n.getKey('illegal expression'));
                textarea.activeError = i18n.getKey('illegal expression');
                return false;
            }
            return textarea.isValid();
        } else {
            return true;
        }
    },
    getValue: function () {
        var me = this;
        var leftPanel = me.items.items[0].getComponent('leftPanel');
        var expression = leftPanel.diyGetValue();
        if (expression) {
            var result = {
                clazz: "CustomizeFunction",
                expression: expression
            };
            return result;
        } else {
            return null;
        }

    },
    setDisabled: function (disabled) {
        var me = this;
        me.callParent(arguments);
        var leftPanel = me.items.items[0].getComponent('leftPanel');
        leftPanel.setDisabled(disabled);
    },
    setValue: function (data) {
        var me = this;
        if (me.rendered) {
            var leftPanel = me.items.items[0].getComponent('leftPanel');
            var expression = data.expression;
            leftPanel.diySetValue(expression);
        } else {
            me.on('afterrender', function () {
                var leftPanel = me.items.items[0].getComponent('leftPanel');
                var expression = data.expression;
                leftPanel.diySetValue(expression);
            })
        }

    },
    initComponent: function () {
        var me = this;
        //如果没有自己组上下文模板,就根据上下文store自动生产一个
        if (Ext.isEmpty(me.contentTemplate) && !Ext.isEmpty(me.contextStore)) {
            me.contentTemplate = me.buildContentTemplate(me.contextStore);
        }
        var treeData = JSJsonToTree(me.contentTemplate, me.title);//转换成tree的源数据
        var store = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            fields: [
                'text', 'value'
            ],
            proxy: {
                type: 'memory'
            },
            root: {
                expanded: true,
                children: treeData.children
            }
        });
        me.items = [{
            xtype: 'panel',
            header: {
                items: [
                    {
                        xtype: 'displayfield',
                        value: '自定义执行条件',
                        fieldStyle: {
                            color: '#666',
                            fontWeight: 'bold'
                        }
                    }
                ]
            },
            bodyStyle: {
                backgroundColor: '#dfeaf2'
            },
            layout: 'border',
            items: [
                {
                    xtype: 'panel',
                    itemId: 'leftPanel',
                    flex: 2,
                    minWidth: 450,
                    layout: 'fit',
                    allowBlank: false,
                    height: '100%',
                    region: 'center',
                    split: true,
                    bodyStyle: {
                        borderColor: 'silver'
                    },
                    tbar: [
                        {
                            xtype: 'displayfield',
                            value: '<font style= "color:green;font-weight: bold">条件代码</font>'
                        },
                        {
                            xtype: 'button',
                            text: '校验语法',
                            iconCls: 'icon_test',
                            handler: function (btn) {
                                var leftPanel = btn.ownerCt.ownerCt;
                                var data = leftPanel.diyGetValue();
                                try {
                                    data = '(' + data + ')';
                                    eval(data);
                                    Ext.Msg.alert(i18n.getKey('prompt'), '合法表达式');
                                } catch (e) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), e);
                                }
                            }
                        },
                        {
                            xtype: 'usetemplatebtn',
                            text: '使用模板',
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('格式化'),
                            iconCls: 'icon_config',
                            count: 1,
                            handler: function (btn) {
                                var leftPanel = btn.ownerCt.ownerCt;
                                var textarea = leftPanel.getComponent('textarea');
                                if (btn.count % 2 == 0) {
                                    var tabchar = ' ';
                                    var tabsize = '4';
                                    textarea.setValue(window.js_beautify(textarea.getValue(), tabsize, tabchar));
                                    btn.setText('压缩');
                                } else {
                                    var packer = new Packer;
                                    var output = packer.pack(textarea.getValue(), 0, 0);
                                    textarea.setValue(output);
                                    btn.setText('格式化');
                                }
                                btn.count++;
                            }
                        },
                        {
                            xtype: 'button',
                            text: '编辑表达式',
                            itemId: 'edit',
                            iconCls: 'icon_edit',
                            handler: function (btn) {
                                var customConditionPanel = btn.up('[itemId=leftPanel]');
                                var str = customConditionPanel.down('textarea').getValue()
                                var win = Ext.create('CGP.common.condition.view.customexpression.CustomConditionWindow', {
                                    animateTarget: btn.el,//动画的起点
                                    initData: str,
                                    contentAttributeStore: me.contextStore,
                                    saveHandler: function (str) {
                                        var me = this;
                                        customConditionPanel.diySetValue(str);
                                    }
                                });
                                win.show()
                            }
                        }
                    ],
                    items: [{
                        xtype: 'textarea',
                        itemId: 'textarea',
                        flex: 1,
                        readOnly: me.checkOnly,
                        allowBlank: me.isAllowBlank,
                        emptyText: '例如:function expression(args) {\n' +
                            '                return true;\n' +
                            '        }',
                        //特殊处理,这个组件默认处理的都是包含在function expression中的数据，兼容以前直接写表达式的方式
                        diySetValue: function (data) {
                            var me = this;
                            var controller = Ext.create('CGP.common.condition.controller.Controller');
                            data = controller.splitFunctionBody(data);
                            me.setValue(data);
                        },
                        diyGetValue: function () {
                            var me = this;
                            var data = me.getValue();
                            var controller = Ext.create('CGP.common.condition.controller.Controller');
                            data = controller.buildCompleteFunction(data);
                            return data;
                        },
                    }],
                    diySetValue: function (data) {
                        var me = this;
                        me.items.items[0].diySetValue(data);

                    },
                    diyGetValue: function () {
                        var me = this;
                        return me.items.items[0].diyGetValue();
                    }
                }
            ]
        }];
        me.callParent();
    },

})

