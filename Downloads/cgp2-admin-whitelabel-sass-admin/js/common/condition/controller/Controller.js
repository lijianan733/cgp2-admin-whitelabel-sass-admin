/**
 * Created by nan on 2020/11/30
 * 在后台服务运行时，上下文的输入skuAttribute值为空时，仅能是[]，和null
 * 得有两套程序，一套处理旧数据，一套处理有ValueType后的数据
 */
Ext.define("CGP.common.condition.controller.Controller", {
    //'1,2,3,4,5,6,7'id
    //`'asdfasdf','sadfasfd','sadfasdf'`
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
     * 是否使用了isContained方法
     */
    isNeedAddIsContained: function () {
        //判断是否需要isContained方法
        var isNeed = false;
        for (var i = 0; i < arguments.length; i++) {
            if (Ext.isString(arguments[i])) {
                if (arguments[i].indexOf('isContained') != -1 || arguments[i].indexOf('equal') != -1) {
                    isNeed = true;
                }
            }
        }
        /*    //判断是否已经有了该方法
            if (isNeed) {
                for (var i = 0; i < arguments.length; i++) {
                    if (Ext.isString(arguments[i])) {
                        if (arguments[i].indexOf('function isContained(aa,bb)') != -1) {
                            isNeed = false;
                        }
                    }
                }
            }*/
        return isNeed;
    },
    inputTypeProperty: [//选项类型的可用操作符
        {
            value: 'Value',
            display: 'Value'
        },
        {
            value: 'Enable',
            display: 'Enable'
        },
        {
            value: 'Hidden',
            display: 'Hidden'
        },
        {
            value: 'Required',
            display: 'Required'
        },
        {
            value: 'OriginValue',
            display: 'OriginValue'
        },
        {
            value: 'OriginEnable',
            display: 'OriginEnable'
        },
        {
            value: 'OriginHidden',
            display: 'OriginHidden'
        },
        {
            value: 'OriginRequire',
            display: 'OriginRequire'
        }, {
            value: 'ReadOnly',
            display: 'ReadOnly'
        }
    ],
    optionTypeProperty: [//离散输入型的可用操作符
        {
            value: 'EnableOption',
            display: 'EnableOption'
        },
        {
            value: 'HiddenOption',
            display: 'HiddenOption'
        },
        {
            value: 'OriginEnableOption',
            display: 'OriginEnableOption'
        },
        {
            value: 'OriginHiddenOption',
            display: 'OriginHiddenOption'
        }
    ],
    contentAttributeStore: null,//必须传入,该store必须是最完整的上下文，即为各个界面用的组件的store的父集
    constructor: function (config) {
        if (Ext.isEmpty(config?.contentAttributeStore)) {
            console.log('contentAttributeStore必须有');
        } else {
            this.contentAttributeStore = config.contentAttributeStore;
        }
    },
    operatorMapping: {
        'AND': '&&',
        'OR': '||'
    },
    betweenOperatorMapping: {
        '(min,max]': {
            leftOperator: '<',
            rightOperator: '<='
        },
        '(min,max)': {
            leftOperator: '<',
            rightOperator: '<'
        },
        '[min,max]': {
            leftOperator: '<=',
            rightOperator: '<='
        },
        '[min,max)': {
            leftOperator: '<=',
            rightOperator: '<'
        }
    },
    templates: {
        InOrNotInTemplate: new Ext.XTemplate('isContained([{secondValue}],{firstValue})=={[this.getOperatorBooleanValue(values)]}', {
            getOperatorBooleanValue: function (values) {
                //In就返回true,NotIn就返回false
                return values.operator == 'In';
            }
        }),
        ArrayCompareTemplate: new Ext.XTemplate('equal({firstValue},[{secondValue}])=={[this.getOperatorBooleanValue(values)]}', {
            getOperatorBooleanValue: function (values) {
                return values.operator == '=='
            }
        }),
        normalTemplate: new Ext.Template('{firstValue}{operator}{secondValue}'),
        BetweenTemplate: new Ext.Template('({minValue}{leftOperator}{midValue}&&{midValue}{rightOperator}{maxValue})'),

    },
    /**
     * 进行特殊的校验,出错就停止程序
     */
    validConfig: function () {
        var controller = this;
        //
        if (Ext.isEmpty(controller.contentAttributeStore)) {
            throw 'controller.contentAttributeStore没配置'
        }
        if (controller.contentAttributeStore.getCount() > 0) {
            var path = controller.contentAttributeStore?.getAt(0)?.get('path') || controller.contentAttributeStore?.data?.items[0]?.raw.path;
            if (Ext.isEmpty(path)) {
                throw '上下文路径path没配置'
            }
        }
    },
    /**
     * 获取BaseOperation
     * @param operation
     * @param contentAttributeStore
     * @returns {string|*}
     */
    calculateBaseOperation: function (operation) {
        var controller = this;
        this.validConfig();

        var resultData = '';
        if (Ext.isEmpty(operation)) {
            return resultData;
        }
        var operationClazz = operation.clazz;
        if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation') {
            resultData = controller.calculateLogicalOperation(operation);
        } else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation') {
            resultData = controller.calculateCustomExpressionOperation(operation);
        } else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation') {
            resultData = controller.calculateBetweenOperation(operation);
        } else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.CompareOperation') {
            resultData = controller.calculateCompareOperation(operation);
        } else {
            resultData = controller.getBaseValueResult(operation);
        }
        return resultData;
    },
    /**
     * && 和 ||把两个表达式连接起来
     * @param operation
     * @param contentAttributeStore
     * @returns {string}
     */
    calculateLogicalOperation: function (operation) {
        var controller = this;
        var resultData = '';
        var logicalOperator = controller.operatorMapping[operation.operator];
        var resultArr = [];
        if (operation.operations.length > 0) {
            //条件中有写配置
            Ext.each(operation.operations, function (item, index) {
                var expression = controller.calculateBaseOperation(item);
                //特殊处理下数据，当直接连接baseValue时，为空值的处理
                if (expression == '') {
                    expression = "''"
                }
                resultArr.push(expression);
            })
            resultData = resultArr.join(logicalOperator);
            return resultData;
        } else {
            //没写配置，默认执行，返回true
            return true;
        }
    },
    /**
     * 获取到区间表达式
     * @param operation
     * @param contentAttributeStore
     * @returns {string}
     */
    calculateBetweenOperation: function (operation) {
        var resultData = '';
        var controller = this;
        var midValue = controller.getBaseValueResult(operation.midValue);
        var minValue = controller.getBaseValueResult(operation.operations[0], 'Number');
        var maxValue = controller.getBaseValueResult(operation.operations[1], 'Number');
        resultData = controller.concatBetweenOperation(midValue, operation.operator, minValue, maxValue);
        return resultData;
    },
    /**
     * 拼接比较类型的表达式
     * @param midValue
     * @param operators
     * @param minValue
     * @param maxValue
     * @returns {String}
     */
    concatBetweenOperation: function (midValue, operator, minValue, maxValue) {
        var controller = this;
        var operators = controller.betweenOperatorMapping[operator];
        var template = controller.templates['BetweenTemplate'];
        var context = {
            midValue: midValue,
            leftOperator: operators.leftOperator,
            rightOperator: operators.rightOperator,
            minValue: minValue,
            maxValue: maxValue
        };
        var result = template.apply(context);
        return result;
    },
    /**
     * 获取到比较类型的属性表达式

     * 根据skuAttribute转换出对应的数据类型
     * @param operation
     * @param contentAttributeStore
     * @returns {string}
     */
    calculateCompareOperation: function (operation) {
        var controller = this;
        var contentAttributeStore = controller.contentAttributeStore;
        var valueType = 'String';
        var firstValue = controller.getBaseValueResult(operation.operations[0]);//上下文中的属性,
        var secondValue = controller.getBaseValueResult(operation.operations[1],
            operation.operations[1].valueType || valueType,//优先用属性里面的，因为可能是array的单选
            operation.operations[0]
        );//比较的值
        if (operation.operations[0].clazz == 'com.qpp.cgp.domain.executecondition.operation.value.VariableValue') {
            //旧数据的格式，通过skuAttribute来判断属性值类型
            var key = operation.operations[0].name;
            if (Ext.isEmpty(key)) {
                valueType = typeof operation.operations[1].value;
                if (valueType == 'object' && (operation.operations[1].value instanceof Array)) {
                    valueType = 'Array';
                }
                valueType = valueType.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
                    return $1.toUpperCase() + $2.toLowerCase();
                });
                secondValue = controller.getBaseValueResult(operation.operations[1], valueType, operation.operations[0]);
            } else {
                try {
                    var attributeData = contentAttributeStore.findRecord('key', key).getData();
                } catch (e) {
                    var attributeData = controller.fixAttributeError(key).getData();
                }
                valueType = attributeData.valueType;
                var selectType = attributeData.selectType;
                if (['In', 'NotIn'].indexOf(operation.operator) >= 0) {
                    valueType = 'Array';
                    //处理单选的数据返回的类型不是个数组
                    if (selectType == 'SINGLE') {
                        firstValue = "[" + firstValue + "]";
                    }
                    secondValue = controller.getBaseValueResult(operation.operations[1], valueType, operation.operations[0]);
                } else {
                    if (selectType == 'MULTI') {
                        valueType = 'Array'
                    } else {
                        if (valueType == 'Number') {
                            valueType = 'Number';
                        } else {
                            //其他的boolean,date,YearMonth,string
                            valueType = 'String'
                        }
                    }
                    secondValue = controller.getBaseValueResult(operation.operations[1], valueType, operation.operations[0]);
                }
            }
        }
        return controller.concatCompareOperation(operation.operator, firstValue, secondValue);
    },
    /*    /!**
         * 根据sku属性转换保存的string类型的值
         * 本来不需要转换的，因为界面上输入sku属性的组件和在条件里获取值的组件是同一类型，但是保存为fixValue时只能为string
         * @param skuAttribute
         * @param value
         * @returns {*}
         *!/
        translateStringValue: function (selectType, valueType, value) {
            var result = '';
            if (selectType == 'MULTI') {
                result = value.replace(/'/g, '');
                result = result.split(',');
            } else {
                if (valueType == 'String') {
                    result = "'" + value + "'";
                } else if (valueType == 'Boolean') {
                    //处理旧数据中有'true','false',选项类型格式的数据
                    if (value == 'true') {
                        result = true;
                    } else if (value == 'false') {
                        result = false;
                    } else {
                        //选项类型
                        result = "'" + value + "'";
                    }
                } else if (valueType == 'Number') {
                    result = Number(value);
                } else {
                    result = "'" + value + "'";
                }
            }
            return result;
        },*/

    /**
     * 拼接比较表达式，
     * 数组是否包含某个元素用isContained()
     * 数组的是否相等用equal
     * @param operator
     * @param selectType
     * @param firstValue
     * @param secondValue
     * @returns {string}
     */
    concatCompareOperation: function (operator, firstValue, secondValue) {
        var controller = this;
        var resultData = '';
        if (operator == 'In' || operator == 'NotIn') {
            resultData = controller.templates['InOrNotInTemplate'].apply({
                firstValue: firstValue,
                secondValue: secondValue,
                operator: operator
            });
        } else {
            //数组类型的数据，只有==和!=
            if (Ext.isArray(secondValue)) {
                resultData = controller.templates['ArrayCompareTemplate'].apply({
                    firstValue: firstValue,
                    secondValue: secondValue,
                    operator: operator
                });
            } else {
                //非数组数据
                resultData = controller.templates['normalTemplate'].apply({
                    firstValue: firstValue,
                    secondValue: secondValue,
                    operator: operator
                });
            }
        }
        return resultData;
    },
    /**
     * 获取自定义表达式条件
     * @param operation
     * @returns {*}
     */
    calculateCustomExpressionOperation: function (operation) {
        var resultData = operation.expression;
        return resultData;
    }
    ,
    /**
     * 获取到各种类型的基础值的在 !运行环境! 中的格式
     * valueType指定值类型
     * @param baseValue
     * @param attributeBaseValue 上下文的属性
     * @returns {string}
     */
    getBaseValueResult: function (baseValue, valueType, attributeBaseValue) {
        var controller = this;
        var resultValue = '';
        if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
            resultValue = baseValue.value;
            //替换id为code
            //如果有attributeBaseValue,根据是否是选项类型,来替换值
            if (attributeBaseValue) {
                var record = controller.contentAttributeStore.findRecord('key', attributeBaseValue.attributeId || attributeBaseValue.name);
                if (Ext.isEmpty(record)) {
                    record = controller.fixAttributeError(baseValue.attributeId, controller.contentAttributeStore);
                } else {
                    var allowArgsToAttrs = record.get('allowArgsToAttrs');
                    if (allowArgsToAttrs == true) {
                        var selectType = record.get('selectType');
                        if (selectType == 'NON') {

                        } else {
                            //单选类型的值可以是多个，因为可以是in notIn操作
                            var optionIdArr = resultValue.split(',');
                            var options = record.get('attrOptions');
                            optionIdArr.map(function (optionId) {
                                options.map(function (optionItem) {
                                    if (optionItem.id == optionId) {
                                        resultValue = resultValue.replace(optionId, optionItem.value);
                                    }
                                });
                            });
                        }
                    }
                }
            }
            resultValue = controller.translateStringValue(valueType || baseValue.valueType, resultValue);
            return resultValue;
        } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') {
            var calculationExpression = baseValue.calculationExpression;
            resultValue = controller.dealCalculationExpression(calculationExpression);
        } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue') {
            var record = controller.contentAttributeStore.findRecord('key', baseValue.attributeId);
            if (Ext.isEmpty(record)) {
                record = controller.fixAttributeError(baseValue.attributeId, controller.contentAttributeStore);
            }
            var path = record.get('path');
            var key = baseValue.attributeId;
            //处理天苗兄的代码
            if (path.indexOf('{0}') >= 0) {
                resultValue = Ext.String.format(path, key);
            } else {
                resultValue = path + "['" + key + "']";
                if (valueType) {
                    resultValue = controller.parseFormat(valueType, resultValue);
                }
            }
        } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.VariableValue'
            || baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.PropertyPathValue') {//PropertyPathValue为旧代码
            var record = controller.contentAttributeStore.findRecord('key', baseValue.name);
            if (Ext.isEmpty(record)) {
                console.log(baseValue.value);
                record = controller.fixAttributeError(baseValue.name, controller.contentAttributeStore);
                /*
                                resultValue = baseValue.value;
                */
            }
            var path = record.get('path');
            var key = baseValue.name;
            resultValue = path + "['" + key + "']";
            //args.context['1338209']=>'attrs';把id类型的数据转为attrs,qty是特殊情况，不做处理
            if (record.get('allowArgsToAttrs')) {
                resultValue = 'attrs' + "['" + record.get('code') + "']";
            }
            if (valueType) {
                resultValue = controller.parseFormat(valueType, resultValue);
            }
        }
        return resultValue;
    },
    /**
     * 对于 基础数据类型，使用对应的类型将之强转
     * @param valueType
     * @param value
     */
    parseFormat: function (valueType, value) {
        var baseValueType = ['String', 'Number', 'Boolean'];
        if (Ext.Array.contains(baseValueType, valueType)) {
            return valueType + '(' + value + ')';
        } else {
            return value;
        }

    },
    /**
     * 转换界面输入的属性字符为正确的上下文属性
     * 关系 attr_AttrId =>path +['AttrId']
     * currentMaterial=>args.params.material
     * generateObiQuantity=>args.params.generateObiQuantity
     * @param input
     * @returns {*}
     */
    dealCalculationExpression: function (inputString) {
        var packer = new Packer
        var controller = this;
        var contentAttributeStore = controller.contentAttributeStore
        var output = packer.pack(inputString, 0, 0);
        //例如：'{Packaging weight(14470978)} {Height(191307)} {Width(191306)} {Finish(133839)}'
        output = output.replace(/[{].+?[}]/g, function (item) {//惰性匹配
            var displayName = item.substr(1, item.length - 2);
            var record = contentAttributeStore.findRecord('displayName', displayName);
            var path = record.get('path');
            var key = record.get('key');
            return path + "['" + key + "']";
        })
        //例如：attr_AttrId
        output = output.replace(/Attr_[0-9a-zA-Z\_]+/g, function (item) {
            var record = controller.contentAttributeStore.findRecord('key', item);
            if (Ext.isEmpty(record)) {
                record = controller.fixAttributeError(item, controller.contentAttributeStore);
            }
            var path = record.get('path');
            item = item.replace('Attr_', path + "['");
            item += "']";
            return item;
        });
        //处理旧数据里写了return 的表达式
        if (/^return/.test(output)) {
            output = output.replace('return', '')
        }
        return output;
    },
    /**
     * 根据值类型转换字符串数据，
     * 现在空值只有两种允许的类型[]，null
     * @param valueType
     * @param str
     */
    translateStringValue: function (valueType, str) {
        var resultValue = str;
        if (valueType == 'Array') {
            if (!Ext.isEmpty(str)) {
                resultValue = resultValue.split(',');
                resultValue = resultValue.map(function (item) {
                    if (Ext.isNumber(item)) {
                        return item;
                    } else {
                        return "'" + item + "'"
                    }
                });
            } else {
                resultValue = [];
            }
        } else {
            if (valueType == 'String') {
                resultValue = "'" + String(str) + "'";
            } else if (valueType == 'Boolean') {
                if (resultValue == 'true') {
                    resultValue = true;
                } else {
                    resultValue = false;
                }
            } else if (valueType == 'Number') {
                resultValue = Number(resultValue);
            } else {
                resultValue = "'" + resultValue + "'"
            }
        }
        return resultValue;
    },
    /**
     *  条件-值DTO转domain处理
     * @param data 一个数组，里面存放{condition，outputValue}
     * @param resultType 结构数据类型
     * @returns {{expression: {expression: string, inputs: [], clazz: string, resultType: string}, type: string, clazz: string}}
     */
    builderExpression: function (data, resultType) {
        var controller = this;
        var elseExpression = '';//else
        var nullExpression = '';//无条件执行
        var expression = '';
        for (var i = 0; i < data.length; i++) {
            var outputValueType = data[i].outputValueType || resultType || 'String';
            //获取返回值
            //返回值的多语言处理
            var outputValue = controller.getBaseValueResult(data[i].outputValue, outputValueType);
            //无条件执行
            if (Ext.isEmpty(data[i].condition) || (data[i].condition.conditionType == 'normal' && Ext.isEmpty(data[i].condition.operation.operations))) {
                nullExpression = 'return ' + outputValue + ';';
            } else {
                //else
                if (data[i].condition.conditionType == 'else') {
                    elseExpression = 'return ' + outputValue + ';';
                } else {
                    //自定义的
                    if (data[i].condition.conditionType == 'custom') {
                        var ex = controller.calculateBaseOperation(data[i].condition.operation);
                        var diyFun = 'fun' + Math.floor(Math.random() * 100000);

                        //处理不是function，直接写表达式的旧数据
                        if (/^function/.test(ex)) {

                        } else {
                            //以前直接写表达式的
                            ex = 'function expression(args){return (' + ex + ');}';
                        }
                        expression += 'var ' + diyFun + '=(' + ex + ');' + 'if(' + diyFun + '(args)){return ' + outputValue + '};';
                    } else {
                        //普通条件
                        expression += 'if(' + controller.calculateBaseOperation(data[i].condition.operation) + '){return ' + outputValue + '};';
                    }
                }
            }
        }
        if (nullExpression) {
            //直接返回无条件内容
            expression = nullExpression;
        } else {
            //把else加到最后
            expression += elseExpression;
            var extraFunString = controller.extraFunString;

        }
        if (!controller.isNeedAddIsContained(expression)) {
            extraFunString = '';
        }
        return {
            "clazz": "com.qpp.cgp.value.ExpressionValueEx",
            "type": resultType || 'String',
            "expression": {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": resultType || 'String',
                "inputs": [],
                "expression": 'function expression(args) {' +
                    extraFunString +
                    expression +
                    '}'
            }
        }
    },
    dealExpressionValue: function (input) {
        var controller = this;
        var packer = new Packer;
        var output = packer.pack(input, 0, 0);
        output = output.replace(/Attr_[0-9]+/g, function (item) {
            var record = controller.contentAttributeStore.findRecord('key', item);
            if (Ext.isEmpty(record)) {
                record = controller.fixAttributeError(item);
            }
            var path = record.get('path');
            item = item.replace('Attr_', path + "['");
            item += "']";
            return item;
        });
        output = output.replace(/currentMaterial/g, 'args.params.material');
        output = output.replace(/generateObiQuantity/g, 'args.params.generateObiQuantity');
        //兼容以前的配置数据，以前return 写在表达式中，现在把有return 开头的都删掉return
        if (/^return/.test(output)) {
            output = output.replace('return', '')
        }
        //防止表达式的忘记加;号
        return output + ';';
    },
    /**
     * 根据rtType来创建field
     * 这里是使用rtType来进行处理
     * @param data
     * @param defaultMulti
     * @param value
     * @param type
     */
    createFieldByRtAttribute: function (data, defaultMulti, value, excludeAttributeValue) {
        var controller = this;
        var valueType = data['valueType'];
        var selectType = data['selectType'];
        var options = Ext.clone(data['options']);
        var item = {};
        item.name = 'outputValue';
        item.fieldLabel = i18n.getKey('outputValue');
        item.allowBlank = false;
        item.value = value;
        item.diyGetValue = function () {
            var me = this;
            return {
                value: me.getValue()?.toString(),
                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue'
            }
        };
        item.diySetValue = function (data) {
            if (data) {
                this.setValue(data['value']);
            }
        };
        item.itemId = 'propertyValue';
        if (options.length > 0) {//选项类型
            item.xtype = 'combo';
            item.haveReset = true;
            item.reset = function () {
                var me = this;
                me.beforeReset();
                me.setValue();
                me.clearInvalid();
                delete me.wasValid;
            };
            item.multiSelect = defaultMulti ? defaultMulti : (selectType == 'MULTI' ? true : false);
            if (item.multiSelect) {
                item.allowBlank = true;//多选的属性值可以为空
                if (item.value) {
                    item.value = item.value.split(',');
                    item.value = item.value.map(function (i) {
                        return parseInt(i)
                    });
                }
                item.listConfig = {
                    itemTpl: Ext.create('Ext.XTemplate', '<input type=checkbox>{[values.name]}'),
                    onItemSelect: function (record) {
                        var node = this.getNode(record);
                        if (node) {
                            Ext.fly(node).addCls(this.selectedItemCls);
                            var checkboxs = node.getElementsByTagName("input");
                            if (checkboxs != null)
                                var checkbox = checkboxs[0];
                            checkbox.checked = true;
                        }
                    },
                    listeners: {
                        itemclick: function (view, record, item, index, e, eOpts) {
                            var isSelected = view.isSelected(item);
                            var checkboxs = item.getElementsByTagName("input");
                            if (checkboxs != null) {
                                var checkbox = checkboxs[0];
                                if (!isSelected) {
                                    checkbox.checked = true;
                                } else {
                                    checkbox.checked = false;
                                }
                            }
                        }
                    }
                };
            } else {
                if (value) {
                    if (Ext.isNumber(value)) {
                        item.value = value;
                    } else if (Ext.isString(value)) {
                        item.value = Ext.Number.from(value);
                    }
                }
                if (excludeAttributeValue.length > 0) {
                    for (var i = 0; i < options.length; i++) {
                        var option = options[i];
                        if (Ext.Array.contains(excludeAttributeValue, option.value)) {
                            options.splice(i, 1);
                            i--;
                        }
                    }
                }
            }
            console.log(options);
            item.displayField = 'name';
            item.valueField = 'name';//不需要id
            item.editable = false;
            item.store = new Ext.data.Store({
                fields: ['name', 'name'],
                data: options
            });

        } else {//输入类型
            if (valueType == 'Date') {
                item.xtype = 'datetimefield';
                item.editable = false;
                item.format = "Y-m-d H:i:s";
                if (item.value) {
                    item.value = new Date(parseInt(item.value));
                }
            } else if (valueType == 'Boolean') {
                item = Ext.Object.merge(item, {
                    xtype: 'combo',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'display'],
                        data: [{
                            value: true,
                            display: 'true'
                        }, {
                            value: false,
                            display: 'false'
                        }]
                    })
                })
            } else {
                var contextData = [];
                var contentAttributeStore = controller.contentAttributeStore || Ext.data.StoreManager.get('contentAttributeStore');
                for (var i = 0; i < contentAttributeStore.getCount(); i++) {
                    var attributeData = contentAttributeStore.getAt(i).getData();
                    contextData.push({
                        id: attributeData.key,
                        valueName: attributeData.key + '的值',
                        displayName: attributeData.path + "['" + attributeData.key + "']"
                    })
                }
                item = {
                    xtype: 'attributejsexpressioninputfield',
                    attribute: data,
                    labelAlign: 'left',
                    itemId: 'propertyValue',
                    allowBlank: false,
                    name: 'outputValue',
                    msgTarget: 'none',
                    fieldLabel: i18n.getKey('outputValue'),
                    JSExpressionInputFieldConfig: {
                        contextData: contextData
                    }
                }
            }
        }
        return item;
    },
    /**
     * 根据attribute来创建field
     * 手动输入值类型可以切换为表达式valueEx输入
     * 这里是使用attribute来进行处理,skuAttribute中的attribute字段
     * @param data
     * @param defaultMulti 是否强行多选
     * @param value
     * @param createFieldByAttribute 需要排除的选项值列表 ['value1','value2']
     * @param valueField 值字段
     * @param attributeOptions 指定options选项值数组
     */
    createFieldByAttribute: function (data, defaultMulti, value, excludeAttributeValue, valueField, attributeOptions) {
        var controller = this;
        var inputType = data['inputType'];
        var selectType = data['selectType'];
        var options = attributeOptions || Ext.clone(data['options']);
        var item = {};
        item.name = 'outputValue';
        item.fieldLabel = i18n.getKey('outputValue');
        item.allowBlank = false;
        item.value = value;
        item.diyGetValue = function () {
            var me = this;
            return {
                value: me.getValue()?.toString(),
                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue'
            }
        };
        item.diySetValue = function (data) {
            if (data) {
                var value = data['value'];
                if (Ext.isNumber(Number(value))) {
                    value = Number(value);
                }
                this.setValue(value);
            }
        };
        item.itemId = 'propertyValue';
        if (options.length > 0) {//选项类型
            item.xtype = 'combo';
            item.haveReset = true;
            item.reset = function () {
                var me = this;
                me.beforeReset();
                me.setValue();
                me.clearInvalid();
                delete me.wasValid;
            };
            item.multiSelect = defaultMulti ? defaultMulti : (selectType == 'MULTI' ? true : false);
            if (item.multiSelect) {
                item.xtype = 'multicombobox';
                item.allowBlank = true;//多选的属性值可以为空
                if (item.value) {
                    item.value = item.value.split(',');
                    item.value = item.value.map(function (i) {
                        return parseInt(i)
                    });
                }
            } else {
                if (value) {
                    if (Ext.isNumber(value)) {
                        item.value = value;
                    } else if (Ext.isString(value)) {
                        item.value = Ext.Number.from(value);
                    }
                }
                if (excludeAttributeValue.length > 0) {
                    for (var i = 0; i < options.length; i++) {
                        var option = options[i];
                        if (Ext.Array.contains(excludeAttributeValue, option.value)) {
                            options.splice(i, 1);
                            i--;
                        }
                    }
                }
            }
            console.log(options);
            item.displayField = 'value';
            item.valueField = valueField;//
            item.editable = false;
            item.store = new Ext.data.Store({
                fields: ['value', 'name', 'id'],
                data: options
            });

        } else if (inputType == 'Date') {//输入类型
            item.xtype = 'datetimefield';
            item.editable = false;
            item.format = "Y-m-d H:i:s";
            if (item.value) {
                item.value = new Date(parseInt(item.value));
            }
        } else if (inputType == 'YesOrNo') {
            item.xtype = 'radiogroup';
            var yesItem = {
                name: item.name,
                inputValue: 'YES',
                boxLabel: 'YES'
            }
            var noItem = {
                name: item.name,
                inputValue: 'NO',
                boxLabel: 'NO'
            }
            if (value) {
                if (value == 'YES') {
                    yesItem.checked = true;
                } else if (value == 'NO') {
                    noItem.checked = true;
                }
            }
            item.items = [yesItem, noItem];
            item.columns = 2;
        } else {
            var contextData = [];
            var contentAttributeStore = controller.contentAttributeStore || Ext.data.StoreManager.get('contentAttributeStore');
            for (var i = 0; i < contentAttributeStore.getCount(); i++) {
                var attributeData = contentAttributeStore.getAt(i).getData();
                contextData.push({
                    id: attributeData.key,
                    valueName: attributeData.key + '的值',
                    displayName: attributeData.path + "['" + attributeData.key + "']"
                })
            }
            item = {
                xtype: 'attributejsexpressioninputfield',
                attribute: data,
                labelAlign: 'left',
                itemId: 'propertyValue',
                allowBlank: false,
                name: 'outputValue',
                msgTarget: 'none',
                fieldLabel: i18n.getKey('outputValue'),
                JSExpressionInputFieldConfig: {
                    contextData: contextData
                }
            }
        }
        return item;
    },
    /**
     * 使用rtType来加载上下文数据
     * @param rtTypeId
     * @returns {[]}
     */
    buildContentDataByRtType: function (rtTypeId, path) {
        var contentData = [];
        var url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            var attributes = responseText.data;
            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];
                var attrOptions = [];
                for (var j = 0; j < attribute.options.length; j++) {
                    attrOptions.push({
                        name: attribute.options[j].name,
                        id: attribute.options[j].value,
                    })
                }
                contentData.push({
                    id: attribute.id, //JSGetUUID()
                    key: attribute.name, //Number
                    type: 'skuAttribute', //无
                    valueType: attribute.valueType, //默认number
                    selectType: attribute.selectType,//(默认'NON'),'SINGLE','MULTI'
                    attrOptions: attrOptions,//[]
                    required: attribute.required,//[]
                    displayName: attribute.name,//sku属性
                    path: path || 'args.context',//该属性在上下文中的路径  //args.context.page.width
                    attribute: attribute //{}
                })
            }
        })
        return contentData;
    },
    /**
     * 使用SkuAttribute来加载上下文数据
     * @param rtTypeId
     * @returns {[]}
     */
    buildContentDataBySkuAttribute: function (productId, path) {
        return JSBuildProductContentData(productId, path);
    },
    /**
     * 条件DTO转domain
     * @param valueType  valueEx||expression
     * @param DTO = {
     * clazz: "com.qpp.cgp.domain.executecondition.InputCondition",
     * conditionType: "xxxx",
     * operation: {}
     * }
     */
    conditionDTOToDomain: function (resultType, conditionDTO, valueType = 'Boolean') {
        var controller = this;
        var condition = '';
        var extraFunString = controller.extraFunString;
        if (conditionDTO.operation.clazz == "com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation") {
            if (Ext.isEmpty(conditionDTO.operation.expression)) {
                return null;
            } else {
                condition = conditionDTO.operation.expression;
                //如果有用到isContained
                if (!controller.isNeedAddIsContained(condition)) {
                    extraFunString = '';
                } else {
                    var arr = condition.split(/expression\s*\(\s*args\s*\)\s*{/);
                    condition = arr.shift() + 'expression(args) {' + extraFunString + arr.join('expression(args) {');
                }
            }
        } else {
            if (conditionDTO.operation.operations.length == 0) {
                return null;
            } else {
                condition = controller.calculateBaseOperation(conditionDTO.operation);
                //如果有用到isContained
                if (!controller.isNeedAddIsContained(condition)) {
                    extraFunString = '';
                }
                condition = "function expression(args){" + extraFunString + " return (" + condition + ")}";
            }
        }
        if (resultType == 'valueEx') {
            return {
                clazz: "com.qpp.cgp.value.ExpressionValueEx",
                constraints: [],
                expression: {
                    clazz: "com.qpp.cgp.expression.Expression",
                    expression: condition,
                    expressionEngine: "JavaScript",
                    resultType: valueType,
                },
                type: valueType,

            }
        } else if (resultType == 'expression') {
            return {
                clazz: "com.qpp.cgp.expression.Expression",
                expression: condition,
                expressionEngine: "JavaScript",
                resultType: valueType,
            }
        }
    },

    /**
     * 显示帮助信息，由于最外围的tab所在的iframe没加载对应组件文件，所以为了通用，写成方法，而不是组件
     */
    showHelpInf: function () {
        var tab = top.Ext.getCmp('tabs');
        var newPanel = tab.getComponent('contextHelpInfo') || tab.add({
            xtype: 'panel',
            title: '使用帮助',
            flex: 1,
            itemId: 'contextHelpInfo',
            layout: {
                type: 'vbox'
            },
            autoScroll: true,
            defaults: {
                margin: '5 25 5 25'
            },
            collapsible: true,
            items: [
                {
                    xtype: 'component',
                    html: '<strong>总览：</strong>'
                },
                {
                    xtype: 'container',
                    autoEl: 'div',
                    width: 800,
                    height: 600,
                    html: '<img src="' + 'https://dev-sz-qpson-nginx.qppdev.com/file/static/nantest/总览.png' + '">'
                },
                {
                    xtype: 'component',
                    html: '<strong>表达式编辑区-可用格式</strong>'
                },
                {
                    xtype: 'container',
                    html: "<div>格式1：\n" +
                        "    <pre>\n" +
                        "        function expression(args) {\n" +
                        "            if (上下文变量 >'值') {\n" +
                        "                return true;\n" +
                        "            } else if (上下文变量 <'值2') {\n" +
                        "                return false;\n" +
                        "            } else {\n" +
                        "                return false;\n" +
                        "            }\n" +
                        "        }" +
                        "   </pre>" +
                        "</div>"
                },
                {
                    xtype: 'container',
                    html: "<div>格式2：\n" +
                        "    <pre>\n" +
                        "            if (上下文变量 >'值') {\n" +
                        "                return true;\n" +
                        "            } else if (上下文变量 <'值2') {\n" +
                        "                return false;\n" +
                        "            } else {\n" +
                        "                return false;\n" +
                        "            }" +
                        "   </pre>" +
                        "</div>"
                },
                {
                    xtype: 'container',
                    html: "<div>格式3：\n" +
                        "    <pre>" +
                        '     具体数值1 < args.context["133721"] <= 具体数值2' +
                        "   </pre>" +
                        "</div>"
                },
                {
                    xtype: 'component',
                    html: '<strong>上下文信息区：\n</strong>'
                },
                {
                    xtype: 'container',
                    autoEl: 'div',
                    width: '100%',
                    height: 900,
                    html: '<img src="' + 'https://dev-sz-qpson-nginx.qppdev.com/file/static/nantest/上下文信息.png' + '">'
                },
                {
                    xtype: 'component',
                    html: '<strong>可插表达式到左侧表达式编辑区的按钮:</strong>'
                },
                {
                    xtype: 'container',
                    autoEl: 'div',
                    width: '100%',
                    height: 870,
                    html: '<img src="' + 'https://dev-sz-qpson-nginx.qppdev.com/file/static/nantest/插入按钮.png' + '">'
                },
                {
                    xtype: 'component',
                    html: '<strong>指定内容替换选中文本</strong>',
                },
                {
                    xtype: 'container',
                    autoEl: 'div',
                    width: 800,
                    height: 600,
                    html: '<img src="' + 'https://dev-sz-qpson-nginx.qppdev.com/file/static/nantest/文本选中.png' + '">'
                },
                {
                    xtype: 'component',
                    html: '<strong>指定内容插入到鼠标光标处</strong>'
                },
                {
                    xtype: 'container',
                    autoEl: 'div',
                    width: 800,
                    height: 600,
                    html: '<img src="' + 'https://dev-sz-qpson-nginx.qppdev.com/file/static/nantest/文本插入.png' + '">'
                },
            ]
        });
        tab.setActiveTab(newPanel);
    },
    /**
     * 显示MMVT的上下文详情
     */
    showMMVTInfo: function () {
        JSOpen({
            id: 'mvtContextInfo',
            url: path + 'partials/materialmvt/contextinfo.html',
            title: i18n.getKey('MMVT上下文结构示例数据'),
            refresh: true
        });
    },
    /**
     * 创建只有全部上下文中某一部分的子store
     */
    buildSubStore: function (contentStore, typeArr) {
        var me = this;
        var subData = [];
        contentStore.each(function (item) {
            //如果指明了keyType,就根据keyType进行过滤，如果没有就直接不做处理
            if (item.get('keyType')) {
                if (Ext.Array.contains(typeArr, item.get('keyType'))) {
                    subData.push(item.raw);
                }
            } else {
                subData.push(item.raw);
            }
        });
        var subStore = Ext.create('CGP.common.condition.store.ContentAttributeStore', {
            groupField: 'keyType',
            data: subData
        });
        return subStore;
    },
    /**
     * 把代码片段组合成完整的表达式
     * 判断是否需要isContainer
     * 格式：function expression (args){return xxxxx;}
     * 作为实际保存内容
     * 修改逻辑，现在只有参数为args的显示部分，其他的形参的显示完整
     * */
    buildCompleteFunction: function (str = '') {
        var controller = this;
        var result = str;
        if (Ext.isEmpty(result)) {

        } else {
            var paramsName = 'args';
            var extraFunString = controller.extraFunString;
            if (/^function\s* expression\s*\(\s*.*?\s*\)\s*\{/.test(str)) {
                //结构完整
                paramsName = controller.getParamsName(str);
            } else {
                //结构不完整,就需要用到保存的形参
                //补充默认的常用形参转换，兼容
                var defaultParams = `var context = ${paramsName};`;
                if (str.indexOf('return') != -1) {
                    result = `function expression(${paramsName}){` + defaultParams + str + '}';
                } else {
                    result = `function expression(${paramsName}){` + defaultParams + `return (` + str + ');}';
                }
            }
            //   /^function\s* expression\s*\(\s*.*?\s*\)\s*\{/
            var reg = `^function\\s* expression\\s*\\(\\s*${paramsName}\\s*\\)\\s*\\{`
            var regex = new RegExp(reg);
            //是否需要补上内置方法
            if (!controller.isNeedAddIsContained(str)) {
                extraFunString = '';
            }
            var matchResult = result.match(regex);
            var index = result.indexOf(matchResult[0]) + matchResult[0].length;
            result = result.substr(0, index) + extraFunString + result.substr(index);
            result = result.trim();
            console.log(result);
        }
        return result;
    },
    /**
     * 截取出主要部分,去除function expression(args){return ();}，return ,isContainer, equal方法
     * 作为显示内容
     * 修改逻辑，现在只有参数为args的显示部分，其他的形参的显示完整
     */
    splitFunctionBody: function (expression = '') {
        //去除可以不显示的内容
        var controller = this;
        var paramsName = controller.getParamsName(expression);
        if (paramsName == 'args') {
            var extraFunString = controller.extraFunString;
            var result = expression.replace(extraFunString, '');
            result = result.replace(/^(\s*function\s* expression\s*\(\s*.*?\s*\)\s*\{\s*)([\s\S]*)(\s*\})$/, '$2');
            result = result.replace(/(\s*var\s*context\s*=\s*.*?\s*;\s*)/, '');
            result = result.replace(/^\s*return\s*/, '');
            result = result.replace(/^(\s*\()([\s\S]*)(\);{0,}\s*)$/g, '$2');//()的内容()&&()会出问题
            result = result.replace(/(\s*;\s*)$/, '');
            //判断内容是否被（）包起来a+b)&&(1+2)&&(b+a  () adsfadf(xxxx safaf)asfdasdf safasdfsf
            if (result.indexOf(')') < result.lastIndexOf('(') && result.indexOf('(') > result.indexOf(')')) {
                //第一个)在(之前
                result = `(${result})`;
            }
            return result;
        } else {
            return expression;
        }

    },
    /**
     *    取出形参名，
     *    setValue和getValue都处理一次，用于兼容修改的情况
     */
    getParamsName: function (str) {
        var reg = `^function\\s*expression\\s*\\(\\s*(.*?)\\s*\\)\\s*\\{`
        var result = str?.match(reg);
        if (result) {
            return result[1];//返回参数名
        }
    },

    /**
     * 属性出问题后进行补救，使之界面不报错
     */
    fixAttributeError: function (attributeId, contentStore) {
        var me = this;
        var data = CGP.common.condition.config.Config.deleteAttribute;
        data.key = '<' + attributeId + '>' + '属性被删';
        data.displayName = '<' + attributeId + '>' + '属性被删';
        contentStore = contentStore || me.contentAttributeStore;
        contentStore?.add(data);
        var model = new CGP.common.condition.model.ContentAttributeModel(data);
        console.log(attributeId + '属性被删')
        return model;
    },

    /**
     * 根据
     */
    buildProfileContext: function (profileStore) {
        //转换profileStore为一棵指定格式的
        var controller = this;
        var treeData = [];
        var buildPropertyChild = function (item, propertyCode, attributeNode) {
            //根据输入方式，判断其可以有子属性
            var children = [];
            var propertyArr = [];
            propertyArr = controller.inputTypeProperty;
            if (item.attribute.selectType == 'NON') {
                //手输
                propertyArr = controller.inputTypeProperty;
            } else {
                //选项
                propertyArr = propertyArr.concat(controller.optionTypeProperty);
            }
            propertyArr.map(function (attr) {
                if (Ext.isEmpty(propertyCode)) {
                    propertyCode = 'code字段缺失';
                }
                var id = `profileValues['${propertyCode}']['${item.code}']['${attr.value}']`
                children.push({
                    text: attr.value,
                    type: 'property',
                    leaf: true,
                    skuAttribute: item,
                    attribute: item.attribute,
                    valueType: item.attribute.valueType,
                    id: id,
                    icon: path + 'ClientLibs/extjs/resources/themes/images/ux/node.png',
                });
            });
            return children;
        };
        for (var i = 0; i < profileStore.getCount(); i++) {
            var profile = profileStore.getAt(i).getData();
            var groups = profile.groups;
            var groupsData = [];
            for (var j = 0; j < groups.length; j++) {
                var group = groups[j];
                var attributes = [];
                group.attributes.forEach(function (item) {
                    var config = {
                        text: item.displayName + ' (' + item.id + ')',
                        type: 'attribute',
                        leaf: false,
                        attribute: item.attribute,
                        icon: path + 'ClientLibs/extjs/resources/themes/images/ux/category.png',
                        id: group._id + '_' + item.id + '_' + item.attribute.id,
                    };
                    config.children = buildPropertyChild(item, profile.code, config);
                    attributes.push(config);
                });
                groupsData.push({
                    text: 'group_' + group.name + ' (' + group._id + ')',
                    type: 'group',
                    leaf: false,
                    id: profile.code + '_' + group._id,
                    icon: path + 'ClientLibs/extjs/resources/themes/images/ux/category.png',
                    children: attributes
                })
            }
            treeData.push({
                text: 'profile_' + profile.code + ' (' + profile._id + ')',
                type: 'profile',
                leaf: false,
                id: profile._id + '_' + profile.code,
                icon: path + 'ClientLibs/extjs/resources/themes/images/ux/category.png',
                children: groupsData
            })
        }
        return treeData;
    }
})
