/**
 * Created by nan on 2020/4/27.
 * 自定义表达式结果，
 * 显示上下文，点击上下文输入
 * 校验合法性
 * 格式化，压缩
 *
 */
Ext.Loader.syncRequire(['CGP.common.controller.Format', 'CGP.common.controller.Packer']);
Ext.define('CGP.common.commoncomp.JSExpressionInputField', {
    extend: 'Ext.ux.form.field.UxTextArea',
    emptyText: '请输入表达式',
    margin: '0 5 0 0',
    contextData: null,//上下文变量信息格式[{displayName:'attr_123456'//显示的变量名,id:'1234456',valueName:'args.params.123456'//实际的上下文名}]
    templateInfo: null,//提示模板信息
    msgTarget: 'none',
    readOnly: false,
    alias: 'widget.jsexpressioninputfield',
    initComponent: function () {
        var me = this;
        /**
         * Created by nan on 2020/4/16.
         * 显示上下文，包含提示模板，和上下文变量gird，可以通过点击grid中的属性直接添加到文本域中
         * 上下文变量-产品的属性，特殊的输入值
         * 转换程序
         *
         *
         */
        Ext.define('LocalContextWindow', {
            extend: 'Ext.window.Window',
            constrain: true,
            modal: true,
            title: i18n.getKey('编辑表达式'),
            layout: 'vbox',
            autoScroll: true,
            expressionTextarea: null,//表达式的输入框
            defaults: {
                padding: '5 25 5 25',
                labelAlign: 'top',
                height: 180,
                width: '100%',
            },
            width: 500,
            height: 500,
            JSExpressionInputField: null,//该弹窗的父组件
            templateInfo: null,
            contextData: null,//上下文数据
            initComponent: function () {
                var me = this;
                var contextData = me.contextData;
                var usableVariables = [];
                for (var i = 0; i < contextData.length; i++) {
                    var data = contextData[i];
                    usableVariables.push(data.displayName);
                }
                console.log(contextData);
                me.items = [
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('表达式'),
                        value: me.JSExpressionInputField.getValue() || me.templateInfo,
                        emptyText: '例如：' + me.templateInfo,
                        itemId: 'textarea',
                        checkChangeBuffer: 1000,//1秒检查一次改变
                        listeners: {
                            change: function (textArea, newValue, oldValue) {
                                //当发现有不合法的变量时，删除对应的不合法变量
                                var matchArr = newValue.split('Attr_');
                                matchArr.shift();//删除第一个元素
                                for (var i = 0; i < matchArr.length; i++) {
                                    matchArr[i] = 'Attr_' + matchArr[i];
                                }
                                for (var i = 0; i < matchArr.length; i++) {
                                    if (matchArr[i].match(/Attr_\w+/g)) {
                                        matchArr[i] = matchArr[i].match(/Attr_\w+/g)[0];
                                    }
                                }
                                var isChanged = false;
                                if (matchArr) {
                                    for (var i = 0; i < matchArr.length; i++) {
                                        if (!Ext.Array.contains(usableVariables, matchArr[i])) {
                                            var regex = new RegExp(matchArr[i], 'g');
                                            var matchedArr = newValue.match(regex);
                                            if (matchedArr) {
                                                if (matchedArr.length == 1) {//只有一个匹配
                                                    newValue = newValue.replace(matchArr[i], '');
                                                    isChanged = true;
                                                    break;
                                                } else {//多个匹配
                                                    var arr = newValue.split(matchArr[i]);
                                                    for (var j = 1; j < arr.length; j++) {
                                                        arr[j] = matchArr[i] + arr[j];
                                                    }
                                                    var index = -1;
                                                    for (var j = 1; j < arr.length; j++) {
                                                        if (arr[j] == matchArr[i]) {//处理直接相等的情况
                                                            index = j;
                                                            console.log(arr);
                                                            arr[index] = arr[index].replace(matchArr[i], '');
                                                            newValue = arr.join('');
                                                            isChanged = true;
                                                            break;
                                                        } else {
                                                            if (arr[j].length > matchArr[i].length) {//处理Attr_123+sadfsad这个情况
                                                                var str = arr[j][matchArr[i].length];
                                                                if (/\W/.test(str)) {
                                                                    index = j;
                                                                    console.log(arr);
                                                                    arr[index] = arr[index].replace(matchArr[i], '');
                                                                    newValue = arr.join('');
                                                                    isChanged = true;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    isChanged ? textArea.setValue(' ' + newValue) : null;
                                }
                            }
                        }
                    }, {
                        xtype: 'gridfield',
                        fieldLabel: i18n.getKey('表达式可用变量'),
                        msgTarget: 'none',
                        height: 180,
                        gridConfig: {
                            viewConfig: {
                                id: 'contextWindowGirdView'
                            },
                            height: 180,
                            maxHeight: 200,
                            renderTo: JSGetUUID(),
                            store: Ext.create('Ext.data.Store', {
                                autoSync: true,
                                fields: [
                                    {name: 'id', type: 'string'},
                                    {name: 'displayName', type: 'string'},
                                    {name: 'valueName', type: 'string'}
                                ],
                                data: contextData
                            }),
                            columns: [
                                {
                                    xtype: 'actioncolumn',
                                    width: 30,
                                    hidden: me.expressionTextarea.readOnly || !me.expressionTextarea,
                                    items: [
                                        {
                                            iconCls: 'icon_add',  // Use a URL in the icon config
                                            tooltip: '加入表达式',
                                            handler: function (gridView, rowIndex, colIndex, a, b, record) {
                                                var win = gridView.ownerCt.gridField.ownerCt;
                                                var textarea = win.getComponent('textarea');
                                                if (textarea) {
                                                    var attribute = record.get('displayName');
                                                    var result = textarea.getValue();
                                                    result += ' ' + attribute + ' ';
                                                    textarea.setValue(result);
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
                                    text: i18n.getKey('变量名') + ' <font color="green">(点击加号按钮添加)</font>',
                                    dataIndex: 'displayName',
                                    renderer: function (value, matedata, record) {
                                        return value;
                                    }
                                },
                                {
                                    flex: 1,
                                    text: i18n.getKey('变量含义'),
                                    dataIndex: 'valueName',
                                    renderer: function (value, matedata, record) {
                                        return value;
                                    }
                                }
                            ]
                        }
                    }
                ];
                me.bbar = [
                    {
                        xtype: 'button',
                        text: i18n.getKey('校验合法性'),
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            var textarea = win.getComponent('textarea');
                            if (win.JSExpressionInputField.validateExpression(textarea.getValue())) {
                                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('合法表达式'));
                            }
                        }
                    },
                    '->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('confirm'),
                        iconCls: 'icon_agree',
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            var textarea = win.getComponent('textarea');
                            console.log(textarea.getValue());
                            if (win.JSExpressionInputField.validateExpression(textarea.getValue())) {
                                win.JSExpressionInputField.setValue(textarea.getValue());
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
                ];
                me.callParent();
            }
        })
        me.callParent();
    },
    /**
     * 现在还是没发处理对任意格式的上下文的兼容
     * @param expression
     * @returns {boolean}
     */
    validateExpression: function (expression) {
        var me = this;
        var isValid = true;
        /*      var errorInfo = '';
              var contextDataStr = '';
              me.contextData = me.contextData || [];
              for (var i = 0; i < me.contextData.length; i++) {
                  contextDataStr += 'var ' + me.contextData[i]['displayName'] + '=null;'
              }
              contextDataStr += 'var a=function (){' + expression + '}();';
              try {
                  eval(contextDataStr);
              } catch (e) {
                  isValid = false;
                  errorInfo = e.message;
              }
              if (isValid == false) {
                  if (errorInfo.indexOf(' is not defined') > -1) {//处理属性未定义
                      var attribute = errorInfo.split(' is not defined')[0];
                      errorInfo = '属性' + attribute + '未定义';
                  }
                  Ext.Msg.alert(i18n.getKey('error'), i18n.getKey(errorInfo));
              }*/
        return isValid;
    },
    createToolbar: function (toolbarConfig) {
        var me = this;
        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('编辑表达式'),
                    iconCls: 'icon_tool', //your iconCls here
                    handler: function (btn) {
                        var expressionField = btn.ownerCt.ownerCt;
                        var win = Ext.getCmp('contextWindow');
                        if (Ext.isEmpty(win)) {
                            win = Ext.create('LocalContextWindow', {
                                JSExpressionInputField: expressionField,
                                expressionTextarea: expressionField,
                                templateInfo: 'Attr_属性Id+2;',
                                id: 'contextWindow',
                                contextData: expressionField.contextData,
                                x: expressionField.getBox().x + 350,
                                y: expressionField.getBox().y - 120,
                            });
                        }
                        win.show();
                        console.log(this);
                    },
                    scope: this,
                    tooltip: '查看所有可用占位符',
                    overflowText: '查看所有可用占位符'
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('格式化'),
                    handler: function () {
                        var me = this;
                        var expressionField = me.ownerCt.ownerCt;
                        var tabchar = ' ';
                        var tabsize = '1';
                        expressionField.setValue(window.js_beautify(expressionField.getValue(), tabsize, tabchar));
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('压缩'),
                    handler: function () {
                        var me = this;
                        var expressionField = me.ownerCt.ownerCt;
                        var packer = new Packer;
                        var output = packer.pack(expressionField.getValue(), 0, 0);
                        expressionField.setValue(output);
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('校验合法性'),
                    handler: function () {
                        var me = this;
                        var expressionField = me.ownerCt.ownerCt;
                        if (expressionField.validateExpression(expressionField.getValue())) {
                            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('合法表达式'));
                        }
                    }
                }
            ]
        });
        return me.toolbar;
    },
})
