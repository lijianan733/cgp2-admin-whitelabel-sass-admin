/**
 * @Description:
 * @author nan
 * @date 2022/9/26
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.config.Config'
])
/**
 * Dto转domain的处理方法
 */
Ext.define("CGP.common.conditionv2.controller.MainController", {
    contextStore: null,//必填有,全局的storeId必须为 contextStore
    extraFunString: 'function isContained(aa,bb){if(typeof(bb)=="string" && /^[\\d,/]+$/.test(bb)){bb=bb.split(",")}' +
        'if(aa==null||aa==undefined||aa==""){return false}if(bb==null||bb==undefined||bb==""){return false};if(!Array.isArray(bb)){bb = [bb]};' +
        'for(var i=0;i<bb.length;i++){var flag=false;for(var j=0;j<aa.length;j++){if(aa[j]==bb[i]){flag=true;break}}' +
        'if(flag==false){return flag}}return flag};' +
        'function equal(arr1,arr2){var flag=true;' +
        'if(typeof(arr1)=="string"){arr1=arr1.split(",")}if(typeof(arr2)=="string"){arr2=arr2.split(",")}' +
        'if(arr1==""||arr1==undefined||arr1==null){if(arr2.length==0){return true}else{return false}}' +
        'if(arr2==""||arr2==undefined||arr2==null){if(arr1.length==0){return true}else{return false}}' +
        'if(arr1.length!==arr2.length){flag=false}else{arr1.forEach(function(item,index,arr){' +
        'if(!isContained(arr2,[item])){flag=false}})}return flag};',

    /**
     * 是否需要添加额外的处理方法
     * @param map
     * @returns {boolean}
     */
    isNeedExtraFun: function (map) {
        var isUsingIsContained = false;
        for (var i in map) {
            if (map[i].indexOf('isContained') != -1) {
                isUsingIsContained = true;
            }
            if (map[i].indexOf('equal') != -1) {
                isUsingIsContained = true;
            }
        }
        return isUsingIsContained;
    },
    constructor: function (config) {
        var me = this;
        if (Ext.isEmpty(config.contextStore)) {
            console.error('contextStore为空');
        }
        Ext.Object.merge(me, config);
    },
    /**
     * 根据数据创建对应的处理类
     * @param data
     * @returns {config.controller}
     */
    builderController: function (data) {
        var me = this;
        var map = CGP.common.conditionv2.config.Config.map;
        var config = map[data.clazz];
        if (Ext.isEmpty(config)) {
            console.error('配置数据为空')
        }
        return Ext.create(config.controller, {
            modelName: config.modelName,
            mainController: me,
            contextStore: me.contextStore,
            data: data,
        });
    },

    /**
     * 各种节点对应的处理方法,各个具体子类控制器自行实现对应处理
     */
    map: {
        CalculationValue: 'CalculationValueModelGenerate',
        ConstantValue: 'ConstantValueModelGenerate',
        ContextPathValue: 'ContextPathValueModelGenerate',
        ProductAttributeValue: 'ProductAttributeValueModelGenerate',
        PropertyPathValue: 'PropertyPathValueModelGenerate',
        CompareOperation: 'CompareOperationModelGenerate',
        IntervalOperation: 'IntervalOperationModelGenerate',
        LogicalOperation: 'LogicalOperationModelGenerate',
        RangeOperation: 'RangeOperationModelGenerate',
        CustomizeFunction: 'CustomizeFunctionModelGenerate',
        TemplateFunction: 'TemplateFunctionModelGenerate'
    },
    CalculationValueModelGenerate: function (data) {
        var result = '';
        return '';
    },
    ConstantValueModelGenerate: function (data) {
        var result = '';
        return '';
    },
    ContextPathValueModelGenerate: function (data) {
        var result = '';
        return ''
    },
    ProductAttributeValueModelGenerate: function (data) {
        var result = '';
        return ''
    },
    PropertyPathValueModelGenerate: function (data) {
        var result = '';
        return ''
    },
    CompareOperationModelGenerate: function (data) {
        var result = '';
        return ''
    },
    IntervalOperationModelGenerate: function (data) {
        var result = '';
        return ''
    },
    LogicalOperationModelGenerate: function (data) {
        var result = '';
        return ''
    },
    RangeOperationModelGenerate: function (data) {
        var result = '';
        return ''
    },
    /**
     * 自定义表达式
     * @param data
     * @returns {*}
     * @constructor
     */
    CustomizeFunctionModelGenerate: function (data) {
        var result = '';
        return data.expression;
    },
    /**
     *
     * @param IExpression
     * @returns {string}
     */
    transformIExpression: function (IExpression) {
        var controller = this;
        var result = '未处理';
        if (IExpression.clazz == 'IfElseStructure') {
            //todo
        } else if (IExpression.clazz == 'ReturnStructure') {
            result = 'return (' + controller.transformValue(IExpression.value) + ')';
        } else if (IExpression.clazz == 'IfCondition') {

        } else if (IExpression.clazz == 'LogicalOperation') {

        } else if (IExpression.clazz == 'IntervalOperation') {

        } else if (IExpression.clazz == 'CompareOperation') {

        } else if (IExpression.clazz == 'RangeOperation') {

        } else if (IExpression.clazz == 'ContextPathValue' ||
            IExpression.clazz == 'ProductAttributeValue' ||
            IExpression.clazz == 'PropertyPathValue' ||
            IExpression.clazz == 'ConstantValue' ||
            IExpression.clazz == 'CalculationValue') {
            result = controller.transformValue(IExpression);
        }
        return result;
    },
    /**
     * 指定模板的处理程序
     * @param data
     * @returns {*|string}
     * @constructor
     */
    TemplateFunctionModelGenerate: function (data) {
        var controller = this;
        var result = '';
        var template = data.template;
        var map = {};
        for (var i in data.paragraph) {
            map[i] = controller.transformIExpression(data.paragraph[i]);
        }
        for (var i in map) {
            template = template.replace('${' + i + '}', map[i]);
        }
        result = template;
        return result;
    },
    /**
     * 转换程序的入口
     * @param data
     * @returns
     */
    transform: function (data) {
        var me = this;
        //表达式类型
        var expression = me[me.map[data.function.clazz]](data.function);
        if (data.clazz == 'ExpressionDto') {
            return {
                clazz: 'com.qpp.cgp.expression.Expression',
                expression: expression,
                expressionEngine: 'JavaScript',
                resultType: data.resultType
            }
        } else if (data.clazz == 'ValueExDto') {
            return {
                clazz: "com.qpp.cgp.value.ExpressionValueEx",
                constraints: [],
                type: data.resultType,
                expression: {
                    clazz: 'com.qpp.cgp.expression.Expression',
                    expression: expression,
                    expressionEngine: 'JavaScript',
                    resultType: data.resultType
                },
            }
        }
    },
    /**
     * 根据valueDTO转换出对应的值表达式
     */
    transformValue: function (data) {
        var controller = this;
        var result;
        if (data.clazz == 'ContextPathValue') {
            result = data.path;
        } else if (data.clazz == 'ProductAttributeValue') {
            if (Ext.isEmpty(controller.contextStore)) {
                console.error('controller.contextStore缺失')
            }
            var record = controller.contextStore.findRecord('key', data.attributeId);
            result = record.get('path') + '["' + data.attributeId + '"]';

        } else if (data.clazz == 'ConstantValue') {
            result = data.value;

        } else if (data.clazz == 'PropertyPathValue') {
            //todo

        } else if (data.clazz == 'CalculationValue') {
            var expression = data.expression;
            var parameter = data.parameter;
            var context = {};
            for (var i = 0; i < parameter.length; i++) {
                context[parameter[i].key] = controller.transformValue(Ext.clone(parameter[i].value));
            }
            for (var i in context) {
                var regex = new RegExp('\\$\\{' + i + '\\}', 'g')
                expression = expression.replace(regex, context[i]);
            }
            result = expression;
        }
        return result;
    },

    /**
     *  创建树状结构的上下文数据
     * @returns {Ext.data.TreeStore|*}
     */
    buildTreeStore: function (rootName, storeId = 'treeContextStore') {
        var controller = this;
        var treeStore = Ext.data.StoreManager.get(storeId);
        if (treeStore) {
            return treeStore;
        } else {
            var contextTemplate = JSBuildContentTemplateTreeDate(controller.contextStore);
            var treeData = JSJsonToTree(contextTemplate, rootName);
            treeStore = Ext.create('Ext.data.TreeStore', {
                storeId: storeId,
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
            return treeStore;
        }
    },
    /**
     * 对表达式的内容专门的显示查看方式
     */
    showExpression: function (data) {
        var controller = this;
        var contextStore = controller.contextStore;
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            title: i18n.getKey('条件'),
            constrain: 'true',
            layout: 'fit',
            width: 800,
            items: [
                {
                    xtype: 'expression_textarea',
                    height: 450,
                    width: '100%',
                    name: 'expression',
                    itemId: 'expression',
                    allowBlank: false,
                    contentAttributeStore: contextStore,
                }
            ],
            listeners: {
                afterrender: function (win) {
                    setTimeout(function () {
                        var conditionField = win.getComponent('expression');
                        conditionField.diySetValue({
                            clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
                            conditionType: 'custom',
                            operation: {
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation',
                                expression: data
                            }
                        });
                    }, 250)
                }
            }
        }).show();
    },
    /**
     * 根据对应节点，转换数据内容，把args转attrs格式
     * @param oldStr
     * @param node
     * @param attributeNode 属性节点
     * @returns {string}
     */
    translateArgsToAttrs: function (oldStr, node, attributeNode) {
        //转成attrs格式
        var controller = this;
        var newStr = oldStr;
        var contextStore = controller.contextStore;
        //需要转格式
        //属性值
        if (node.clazz == 'ProductAttributeValue') {
            var record = contextStore.findRecord('key', node.attributeId);
            if (record.get('allowArgsToAttrs')) {
                newStr = 'attrs["' + record.get('code') + '"]';
            }
        } else if (node.clazz == 'ConstantValue' && attributeNode.clazz == 'ProductAttributeValue') {
            var record = contextStore.findRecord('key', attributeNode.attributeId);
            if (Ext.isEmpty(record)) {
                record = controller.fixAttributeError(attributeNode.attributeId, contextStore);
            } else {
                if (record.get('allowArgsToAttrs')) {
                    var selectType = record.get('selectType');
                    if (selectType == 'NON') {

                    } else {
                        //单选类型的值可以是多个，因为可以是in notIn操作
                        var options = record.get('attrOptions');
                        options.map(function (optionItem) {
                            oldStr = oldStr.replace(optionItem.id, optionItem.value);
                        });
                        newStr = oldStr;
                    }
                }
            }
        }
        return newStr;
    }
})
