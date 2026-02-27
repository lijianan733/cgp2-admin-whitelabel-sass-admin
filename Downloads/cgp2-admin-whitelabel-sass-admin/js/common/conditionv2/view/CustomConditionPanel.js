/**
 * Created by nan on 2020/8/20.
 * 自定义条件的panel
 */
Ext.Loader.syncRequire([
    'Ext.ux.tree.JsonTreePanel'
])
Ext.define('CGP.common.conditionv2.view.CustomConditionPanel', {
    extend: 'Ext.container.Container',
    alias: 'widget.customconditionpanel',
    style: {
        borderColor:'silver',
        borderStyle:'solid',
        borderWidth:'1px'
    },
    itemId: 'conditionPanel',
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
    contextTemplate: null,//上下文模板数据
    functionTemplate: '',//方法模板
    contextAttributeStore: null,
    isAllowBlank: null,
    //在指定dom中光标处加入文本
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
    initComponent: function () {
        var me = this;
        //如果没有自己组上下文模板,就根据上下文store自动生产一个
        if (Ext.isEmpty(me.contextTemplate) && !Ext.isEmpty(me.contextAttributeStore)) {
            me.contextTemplate = me.buildContentTemplate(me.contextAttributeStore);
        }
        var treeData = JSJsonToTree(me.contextTemplate, me.title);//转换成tree的源数据
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
            layout: 'border',
            items: [
                {
                    xtype: 'panel',
                    itemId: 'leftPanel',
                    tbar: {
                        items: [
                            {
                                xtype: 'displayfield',
                                value: '<font style= "color:green;font-weight: bold">条件代码</font>'
                            },
                            {
                                xtype: 'button',
                                text: '校验表达式',
                                handler: function (btn) {
                                    var treePanel = btn.ownerCt.ownerCt;
                                    var panel = treePanel.ownerCt;
                                    var leftPanel = panel.getComponent('leftPanel');
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
                                xtype: 'button',
                                text: '使用模板',
                                handler: function (btn) {
                                    var str = "function expression(args) {\n" +
                                        "            if (上下文变量 >'值') {\n" +
                                        "                return true;\n" +
                                        "            } else if (上下文变量 <'值2') {\n" +
                                        "                return false;\n" +
                                        "            } else {\n" +
                                        "                return false;\n" +
                                        "            }\n" +
                                        "        }\n";
                                    var leftPanel = btn.ownerCt.ownerCt;
                                    var textarea = leftPanel.getComponent('textarea');
                                    textarea.diySetValue(textarea.getValue() + str);
                                }
                            },
                            {
                                xtype: 'button',
                                text: '显示帮助信息',
                                count: 0,
                                handler: function (btn) {
                                    var leftPanel = btn.ownerCt.ownerCt;
                                    var panel = leftPanel.ownerCt;
                                    var helpPanel = panel.getComponent('helpPanel');
                                    helpPanel.setVisible(btn.count % 2 == 0);
                                    btn.setText(btn.count % 2 == 0 ? '隐藏帮助信息' : '显示帮助信息');
                                    btn.count++;
                                }
                            },
                            {
                                xtype: 'button',
                                text: '显示上下文',
                                count: 0,
                                handler: function (btn) {
                                    var leftPanel = btn.ownerCt.ownerCt;
                                    var panel = leftPanel.ownerCt;
                                    var treePanel = panel.getComponent('treePanel');
                                    treePanel.setVisible(btn.count % 2 == 0);
                                    btn.setText(btn.count % 2 == 0 ? '隐藏上下文' : '显示上下文');
                                    btn.count++;
                                }
                            }
                        ]
                    },
                    bodyStyle: {
                        borderColor: 'silver'
                    },
                    layout: 'fit',
                    allowBlank: false,
                    height: '100%',
                    flex: 1,
                    region: 'center',
                    split: true,
                    items: [{
                        xtype: 'textarea',
                        itemId: 'textarea',
                        flex: 1,
                        readOnly: me.checkOnly,
                        allowBlank: me.isAllowBlank,
                        //特殊处理,这个组件默认处理的都是包含在function expression中的数据，兼容以前直接写表达式的方式
                        diySetValue: function (data) {
                            var me = this;
                            if (!Ext.isEmpty(data)) {
                                if (/^function/.test(data)) {

                                } else {
                                    //以前直接写表达式的
                                    data = 'function expression(args){return (' + data + ');}';
                                }
                            }
                            me.setValue(data);
                        },
                        diyGetValue: function () {
                            var me = this;
                            var data = this.getValue();
                            if (!Ext.isEmpty(data)) {
                                if (/^function/.test(data)) {

                                } else {
                                    //以前直接写表达式的
                                    data = 'function expression(args){return (' + data + ');}';
                                }
                            }
                            return data;
                        }
                    }
                    ],
                    diySetValue: function (data) {
                        var me = this;
                        me.items.items[0].diySetValue(data);
                    },
                    diyGetValue: function () {
                        var me = this;
                        return me.items.items[0].diyGetValue();
                    }
                },
                {
                    xtype: 'treepanel',
                    itemId: 'treePanel',
                    rootVisible: false,
                    text: 'Simple Tree2',
                    store: store,
                    region: 'east',
                    useArrows: true,
                    hidden: true,
                    height: '100%',
                    flex: 1,
                    layout: 'fit',
                    autoScroll: false,
                    bodyStyle: 'overflow-x:hidden;overflow-y:auto',
                    lines: false,
                    viewConfig: {
                        style: {
                            overflowX: 'hidden !important',
                            overflowY: 'auto'
                        },
                        stripeRows: true,
                        enableTextSelection: true
                    },
                    listeners: {
                        celldblclick: function (treeView, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                            console.log(record);
                            var treePanel = treeView.ownerCt;
                            var result = [];
                            record.bubble(function (node) {
                                if (node.isRoot() == true) {
                                    return false;
                                } else {
                                    result.push(node.get('text'));
                                }
                            });
                            var result = result.reverse();
                            var attribute = '';
                            for (var i = 0; i < result.length; i++) {
                                if (Ext.isNumeric(result[i])) {
                                    attribute += "['" + result[i] + "']"
                                } else {
                                    if (i > 0) {
                                        attribute += '.';
                                    }
                                    attribute += result[i]
                                }
                            }
                            var leftPanel = treePanel.ownerCt.getComponent('leftPanel');
                            var textarea = leftPanel.items.items[0];
                            var data = textarea.getValue();
                            treePanel.ownerCt.ownerCt.insertAtCursor(textarea.inputEl.dom, attribute);
                            /*
                                                        textarea.setValue(data + ' ' + attribute);
                            */
                        },
                        afterrender: function (treePanel) {
                            treePanel.expandAll();
                            var treeView = treePanel.getView();
                            Ext.create('Ext.tip.ToolTip', {
                                target: treeView.el,//目标元素
                                delegate: 'span.x-tree-node-text',//目标元素下子元素
                                itemId: 'ToolTip',
                                items: [{
                                    xtype: 'errorstrickform',
                                    maxHeight: 450,
                                    width: 480,
                                    defaults: {
                                        margin: '5 25 5 25',
                                        width: 430,
                                        xtype: 'displayfield'
                                    },
                                    items: [
                                        {
                                            name: 'key',
                                            fieldLabel: i18n.getKey('上下文变量名'),
                                            itemId: 'key'
                                        },
                                        {
                                            name: 'valueType',
                                            fieldLabel: i18n.getKey('valueType'),
                                            itemId: 'valueType'
                                        }, {
                                            name: 'selectType',
                                            fieldLabel: i18n.getKey('selectType'),
                                            itemId: 'selectType'
                                        },
                                        {
                                            xtype: 'gridfieldextendcontainer',
                                            name: 'options',
                                            fieldLabel: i18n.getKey('选项列表'),
                                            itemId: 'options',
                                            valueType: 'idRef',
                                            labelAlign: 'top',
                                            gridConfig: {
                                                store: {
                                                    fields: [
                                                        'attributeId',
                                                        'displayValue',
                                                        'id',
                                                        'name',
                                                        'value'
                                                    ],
                                                    data: [],
                                                    proxy: {
                                                        type: 'memory'
                                                    }
                                                },
                                                maxHeight: 220,
                                                width: '100%',
                                                columns: [
                                                    {
                                                        dataIndex: 'id',
                                                        text: i18n.getKey('id')
                                                    },
                                                    {
                                                        dataIndex: 'displayValue',
                                                        text: i18n.getKey('displayValue')
                                                    }, {
                                                        dataIndex: 'name',
                                                        text: i18n.getKey('name')
                                                    }/*, {
                                                        dataIndex: 'value',
                                                        flex: 1,
                                                        text: i18n.getKey('value')
                                                    }*/
                                                ],
                                            },
                                            diySetValue: function (data) {
                                                var me = this;
                                                var store = me._grid.getStore();
                                                if (data && data.length > 0) {
                                                    me.show();
                                                    store.proxy.data = data;
                                                    store.load();
                                                } else {
                                                    me.hide();
                                                }
                                            }
                                        }
                                    ]
                                }],
                                listeners: {
                                    // 当元素被显示时动态改变内容.
                                    beforeshow: function (tip) {
                                        var form = this.items.items[0];
                                        var value = tip.triggerElement.innerText;
                                        var customConditionPanel = treePanel.ownerCt.ownerCt;
                                        var contextAttributeStore = customConditionPanel.contextAttributeStore;
                                        var attributeRecord = contextAttributeStore.findRecord('key', value);
                                        if (attributeRecord) {
                                            var attributeData = attributeRecord.getData();
                                            //对选项类型进行处理
                                            var data = {
                                                valueType: attributeData.valueType,
                                                selectType: attributeData.selectType,
                                                require: attributeData.require,
                                                key: attributeData.key,
                                                options: attributeData?.attrOptions
                                            };
                                            form.setValue(data);
                                        }
                                    }
                                }
                            });
                        }
                    },
                    columns: [
                        {
                            xtype: 'treecolumn',
                            text: '<font color="green">上下文本变量</font>(双击在鼠标位置加入属性)',
                            height: 37,
                            dataIndex: 'text',
                            flex: 1,
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                                metadata.tdAttr = 'data-qtip=""';

                                return value;
                            }
                        }]
                },

                {
                    xtype: 'panel',
                    itemId: 'helpPanel',
                    region: 'east',
                    hidden: true,
                    height: '100%',
                    flex: 1,
                    autoScroll: true,
                    layout: {
                        type: 'vbox'
                    },
                    bodyStyle: {
                        borderColor: 'silver',
                        'overflow-x': 'hidden',
                        'overflow-y': 'auto'
                    },
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
                            html: '<img src="' + imageServer + '3b79c5b3185c9f9e4e761826eb5924a6.png' + '">'
                        },
                        {
                            xtype: 'component',
                            html: '<font>第二步,双击获取上下文</font>'
                        },
                        {
                            xtype: 'container',
                            html: '<img src="' + imageServer + '5e168822bc01f7ffbf23768181afd20f.png' + '">'
                        },
                        {
                            xtype: 'component',
                            html: '<font>第三步,查看加入到表达式中的上下文变量</font>'
                        },
                        {
                            xtype: 'container',
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
                            html: '<img src="' + imageServer + '26df0592e1ad77451fe7187e2a63e8f7.png' + '">'
                        }
                    ]
                }
            ]
        }]
        ;
        me.callParent();
    },
    /**
     *根据上下文store构建模板上下文
     * @param store
     */
    buildContentTemplate: function (store) {
        var me = this;
        var contextTemplate = {};
        store.data.items.forEach(function (item) {
            var path = item.raw.path;
            path = path + '.' + item.raw.key;
            me.builderObject(path, contextTemplate);
        });
        console.log(contextTemplate);
        return contextTemplate;
    },
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
        var result = {
            clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
            conditionType: 'custom',
            operation: null
        };
        var operation = {
            operations: [],
            clazz: 'com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation',
            expression: leftPanel.diyGetValue()
        };
        result.operation = operation;
        return result;
    },
    setDisabled: function (disabled) {
        var me = this;
        me.callParent(arguments);
        var leftPanel = me.items.items[0].getComponent('leftPanel');
        leftPanel.setDisabled(disabled);
    },
    setValue: function (data) {
        var me = this;
        var leftPanel = me.items.items[0].getComponent('leftPanel');
        var expression = data.operation.expression;
        leftPanel.diySetValue(expression);
    }
})
