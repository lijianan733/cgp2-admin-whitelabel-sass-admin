/**
 * @Description: key -condition类型的值的集合
 * 指的返回值的 输入方式，值类型
 * @author nan
 * @date 2023/6/1
 *                            定义组件返回值信息
 *                             winConfig: {
 *                                 formConfig: {
 *                                 valueType:'String',
 *                                  selectType: 'SINGLE',
 *                                             attrOptions: [
 *                                                 {
 *                                                     "id": 7718086,
 *                                                     "name": "20mm Dice",
 *                                                     "displayValue": "20mm Dice",
 *                                                     "value": "20mm Dice",
 *                                                     "hidden": false,
 *                                                     "isSelected": false,
 *                                                     "sortOrder": 0,
 *                                                     "enable": true
 *                                                 }
 *                                             ],
 *                                     outputValueFieldConfig: {
 *                                         initBaseConfig: {
 *                                             clazzReadOnly: false,
 *                                             defaultClass: 'ConstantValue',//ConstantValue,ProductAttributeValue,ContextPathValue,CalculationValue，
 *                                             defaultValueType: 'Number',
 *                                             valueTypeReadOnly: 'String',
 *                                         },
 *                                     },
 *                                 }
 *                             }
 *
 */

Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.KeyToConditionForm',
    'CGP.common.conditionv2.model.other.IfConditionModel',
    'CGP.common.conditionv2.view.ValidExpressionContainer',
    'CGP.common.condition.view.ExpressionTextarea'

])
Ext.define('CGP.common.conditionv2.view.KeyToConditionGrid', {
    extend: 'Ext.ux.form.GridFieldWithCRUDV2',
    alias: 'widget.key_to_condition_grid',
    valueSource: 'storeProxy',
    contextStore: null,
    valueType: 'String',//生成的表达式的返回结果类型
    returnType: 'ValueExDto',//'ValueExDto' ||'ExpressionDto',
    /**
     * //决定返回值相关配置都放到winConfig.formConfig中
     *   formConfig: {
     *     valueType: 'String',//以form里面的数据类型为准
     *     selectType: 'NON',
     *   }
     */
    winConfig: null,
    gridConfig: null,
    rawData: null,
    /**
     * 默认返回值，如果配置了，会自动加上一条else配置，
     * 新建时，默认存在，如果旧数据缺少，则自动添加上
     * defaultReturnValue: {
     *     "clazz": "IfCondition",
     *     "statement": {
     *         "clazz": "ReturnStructure",
     *         "value": {
     *             "clazz": "ConstantValue",
     *             "valueType": "String",
     *             "value": 7718084
     *         }
     *     },
     *     "condition": null
     * }
     */
    defaultReturnValue: null,
    /**
     * 如果配置了defaultReturnValue，添加else结构
     * 初始化，获取值，设置值时调用
     * @param keyConditionStore
     */
    addDefaultReturnValue: function (keyConditionStore) {
        var me = this;
        if (me.defaultReturnValue) {
            var isExtraElse = false;//是否已经存在else结构
            keyConditionStore.proxy.data.map(function (item) {
                if (Ext.isEmpty(item.condition)) {
                    isExtraElse = true;
                }
            });
            if (isExtraElse == false) {
                keyConditionStore.proxy.data.push(me.defaultReturnValue);
            }
        }
    },
    initComponent: function () {
        var me = this;
        var mainController = Ext.create('CGP.common.conditionv2.controller.MainController', {
            contextStore: me.contextStore
        });
        var oldController = Ext.create('CGP.common.condition.controller.Controller');
        var keyConditionStore = Ext.create('Ext.data.Store', {
            model: 'CGP.common.conditionv2.model.other.IfConditionModel',
            proxy: {
                type: 'memory',
            },
            data: []
        });
        me.addDefaultReturnValue(keyConditionStore);
        keyConditionStore.load();
        me.valueType = me?.winConfig?.formConfig?.valueType || me.valueType || 'String';
        me.gridConfig = Ext.Object.merge({
            autoScroll: true,
            store: keyConditionStore,
            columns: [
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('值'),
                    dataIndex: 'statement',
                    flex: 1,
                    sortable: false,
                    getDisplayName: function (value, mateData, record) {
                        //ConstantValue,ProductAttributeValue,ContextPathValue,CalculationValue，
                        var value = value.value;
                        if (value.clazz == 'ConstantValue') {
                            var selectType = me.winConfig.formConfig.selectType;
                            if (selectType == 'NON') {
                                return `固定值(${value.valueType})：` + value.value;
                            } else if (selectType == 'SINGLE' || selectType == 'MULTI') {
                                //选项类型
                                var options = me.winConfig.formConfig.attrOptions;
                                var arr = [];
                                var ids = [];
                                if (selectType == 'SINGLE') {
                                    ids.push(Number(value.value));
                                } else if (selectType == 'MULTI') {
                                    ids.push(Number(value.value));
                                }
                                options.map(function (item) {
                                    for (var i = 0; i < ids.length; i++) {
                                        if (ids[i] == Number(item.id)) {
                                            arr.push(item.displayValue + '(' + item.id + ')');
                                        }
                                    }
                                });
                                return `固定值(${value.valueType})：` + arr.join(',');
                            }
                        } else if (value.clazz == 'ProductAttributeValue') {
                            return '指定产品属性值:' + value.attributeId;
                        } else if (value.clazz == 'ContextPathValue') {
                            return '指的上下文:' + value.path;
                        } else if (value.clazz == 'CalculationValue') {
                            var str = value.expression;
                            str = oldController.splitFunctionBody(str);
                            if (str.length <= 250) {
                                return JSAutoWordWrapStr('表达式:' + str);
                            } else {
                                return '表达式:<a href="#" style="color: blue;">查看配置</a>';
                            }
                        }
                    },
                    clickHandler: function (value, mateData, record) {
                        var value = value.value;
                        var me = this;
                        mainController.showExpression(value.expression);
                    }
                },
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('condition'),
                    dataIndex: 'condition',
                    flex: 2,
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var title = '';
                        var count = record.store.getCount();
                        if ((Ext.isEmpty(value) || value.length == 0) && count == 1) {
                            title = JSAutoWordWrapStr('<font color="red">无条件执行</font>');
                        } else if ((Ext.isEmpty(value) || value.length == 0) && count > 1) {
                            title = JSAutoWordWrapStr('<font color="red">Else (注意：其他配置的条件都不满足时,最终执行该配置)</font>');
                        } else {
                            var expression = mainController.builderController(value).generate();
                            expression = oldController.splitFunctionBody(expression);
                            if (expression.length > 250) {
                                expression = expression.substr(0, 250) + '...';
                            }
                            title = JSAutoWordWrapStr(expression + ' <a href="#" style="color: blue">查看条件</a>');
                        }
                        return {
                            xtype: 'displayfield',
                            value: title,
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    if (ela) {
                                        ela.on("click", function (event) {
                                            var win = Ext.create('Ext.window.Window', {
                                                modal: true,
                                                title: i18n.getKey('条件'),
                                                constrain: 'true',
                                                layout: 'fit',
                                                width: 800,
                                                items: [
                                                    {
                                                        xtype: 'condition_field_container',
                                                        itemId: 'condition',
                                                        name: 'condition',
                                                        margin: '5 25',
                                                        fieldLabel: i18n.getKey('条件'),
                                                        labelWidth: 30,
                                                        checkOnly: true,
                                                        contextStore: me.contextStore,
                                                        diyGetValue: function () {
                                                            return this.getBaseBom();
                                                        },
                                                        diySetValue: function (data) {
                                                            if (data) {
                                                                this.setBaseBom(data);
                                                            }
                                                        }
                                                    }
                                                ],
                                                listeners: {
                                                    afterrender: function (win) {
                                                        setTimeout(function () {
                                                            var conditionField = win.getComponent('condition');
                                                            conditionField.diySetValue(value);
                                                        }, 250)
                                                    }
                                                }
                                            }).show();
                                        });
                                    }
                                }
                            }
                        }
                    },
                }
            ],
            tbar: {
                btnHelp: {
                    hidden: false,
                    text: '<font color="red">注意</font>',
                    handler: function () {
                        Ext.Msg.alert(i18n.getKey('prompt'),
                            '注意：当配置无条件执行的配置时,自动作为Else配置;');
                    },
                },
                btnDelete: {
                    xtype: 'button',
                    iconCls: 'icon_test',
                    hidden: false,
                    width: 70,
                    text: '<font color=red>测试</font>',
                    tooltip: '根据propertyModelId测试运行',
                    handler: function (btn) {
                        var me = this;
                        var toolbar = me.ownerCt;
                        var grid = toolbar.ownerCt;
                        var gridField = grid.gridField;
                        var dto = gridField.diyGetValue();
                        var expressionData = null;
                        if (dto) {
                            var mainController = Ext.create('CGP.common.conditionv2.controller.MainController', {
                                contextStore: gridField.contextStore
                            });
                            var data = mainController.builderController(dto).generate();
                            if (data.clazz == 'com.qpp.cgp.expression.Expression') {
                                expressionData = data;
                            } else {
                                expressionData = data.expression;
                            }
                            JSValidValueEx(expressionData);
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), '当前无需校验的配置数据');
                        }
                    },
                },
                msgDisplay: {
                    hidden: false,
                    flex: 1,
                    style: {
                        'text-align': 'end',
                        'font-weight': 'bold'
                    },
                    value: 'else条件会显示在列表最后'

                }
            },
            bbar: {
                xtype: 'pagingtoolbar',
                store: keyConditionStore
            }
        }, me.gridConfig);
        me.winConfig = Ext.Object.merge({
            maximizable: true,
            setValueHandler: function (data) {
                var win = this;
                var form = win.getComponent('form');
                //等待下渲染
                setTimeout(function () {
                    form.setValue(data);
                }, 250);
            },
            formConfig: {
                xtype: 'key_to_condition_form',
                width: 800,
                defaults: {
                    width: '100%',
                    margin: '5 25'
                },
                valueType: me.valueType,
                contextStore: me.contextStore,
                saveHandler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var win = form.ownerCt;
                    if (form.isValid()) {
                        var data = {};
                        data = form.getValue();
                        win.outGrid.store.proxy.data ? null : win.outGrid.store.proxy.data = [];
                        if (win.createOrEdit == 'create') {
                            win.outGrid.store.proxy.data.push(data);
                        } else {
                            win.outGrid.store.proxy.data[win.record.index] = data;
                        }

                        var count = 0;
                        var elseIndex = null;
                        win.outGrid.store.proxy.data.map(function (item, index) {
                            var condition = item.condition;
                            if (Ext.isEmpty(condition) || condition.length == 0) {
                                elseIndex = index;
                                count++;
                            }
                        });

                        if (count > 1) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('不允许重复添加无条件执行的else配置'));
                            win.outGrid.store.proxy.data.splice(elseIndex, 1);
                        } else {
                            //放到最后
                            if (!Ext.isEmpty(elseIndex)) {
                                var elseData = win.outGrid.store.proxy.data[elseIndex];
                                win.outGrid.store.proxy.data.splice(elseIndex, 1);
                                win.outGrid.store.proxy.data.push(elseData);
                            }
                            win.outGrid.store.load();
                            win.close();
                        }
                    }
                }
            }
        }, me.winConfig);
        me.callParent();
    },
    /**
     * 获取最基础的结构
     */
    getBaseBom: function () {
        var me = this;
        var keyConditionStore = me._grid.getStore();
        me.addDefaultReturnValue(keyConditionStore);
        var arr = me.getSubmitValue();
        if (arr.length > 0) {
            var elseStatement = null;
            for (let i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (Ext.isEmpty(item.condition)) {
                    elseStatement = item;
                    arr.splice(i, 1);
                    break;
                }
            }
            return {
                clazz: 'IfElseStructure',
                conditions: arr,
                elseStatement: elseStatement
            }
        } else {
            return null;
        }
    },
    /**
     * 设置最基础的结构
     */
    setBaseBom: function (data) {
        var me = this;
        var arr = [];
        if (data.conditions && data.conditions.length > 0) {
            arr = arr.concat(data.conditions);
        }
        if (data.elseStatement) {
            arr.push(data.elseStatement);
        }
        var setValue = function () {
            me._grid.store.proxy.data = arr;
            me.addDefaultReturnValue(me._grid.store);
            me._grid.store.load();
        };
        if (me.rendered) {
            setValue();
        } else {
            me.on('afterrender', function () {
                setValue();
            });
        }

    },
    /**
     * 按照需求自行修改返回的数据结构
     * @returns {{elseStatement: *, conditions: *, clazz: string}}
     */
    diyGetValue: function () {
        //默认返回一个标准valueEx结构
        var me = this;
        if (me.rendered) {
            var result = me.getBaseBom();
            if (result) {
                //对简单和复杂进行封装
                result = {
                    clazz: 'TemplateFunction',
                    template: 'function expression(args) { ${isContained} ${P1}};',
                    paragraph: {
                        //条件结构
                        "P1": result
                    }
                }
                return {
                    clazz: me.returnType,
                    resultType: me.valueType,
                    function: result
                };
            } else {
                return null;
            }
        } else {
            return me.rawData;
        }

    },
    diySetValue: function (data) {
        var me = this;
        me.rawData = data;
        try {
            if (data && data.function) {
                var baseBom = data.function.paragraph['P1'];
                me.setBaseBom(baseBom);
            }
        } catch (e) {
            console.log(e)
        }
    }
})
