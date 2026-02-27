/**
 *
 */
Ext.define("CGP.tools.freemark.template.controller.Controller", {

    /**
     *
     * @param data
     * @param editTab
     * @param mask
     */
    saveData:function (data, editTab, mask){
        var me = this, method = "POST",url;
        url = composingPath + 'api/freemarker/templates';
        Ext.Ajax.request({
            url : url,
            method : method,
            headers : {
                Authorization: 'Bearer '+ Ext.util.Cookies.get('token')
            },
            jsonData : data,
            success : function(response,options){
                var resp = Ext.JSON.decode(response.responseText);
                if(resp.success){
                    mask.hide();
                    editTab.createOrEdit='edit';
                    editTab.editModel.data=resp.data;
                    var topEditTab = window.parent.Ext.getCmp('variableEdit');
                    topEditTab.setTitle(i18n.getKey('edit') + i18n.getKey('variable')+'('+resp.data._id+')');
                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveSuccess'),function(){
                    });
                }else{
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure')+resp.data.message)
                }
            },
            failure : function(response,options){
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure') + object.data.message);
            },
            callback : function(){
                mask.hide();
            }
        });
    },
    /**
     *添加参数组窗口
     * @param grid
     * @param record
     * @param leftAttributes
     */
    inputWind:function(grid,record,productId){
        if(Ext.isEmpty(productId)){
            Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('必须选择可配置产品'));
            return false;
        }
        var data=Ext.isEmpty(record)?null:record.data;
        var wind=Ext.create("Ext.window.Window",{
            itemId: "inputKeyWind",
            title: i18n.getKey('varKeys'),
            modal: true,
            layout: 'fit',
            width:900,
            height:600,
            items:[
                Ext.create('CGP.tools.freemark.template.view.TemplateModuleForm',{
                    itemId:'inputKeyForm',
                    productId:productId,
                    currRecord:record,
                    variableStore:grid.store
                })
            ],
            bbar:[
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var parentComp=btn.ownerCt.ownerCt;
                        var comitData=null;
                        if(parentComp.getComponent('inputKeyForm').isValid()){
                            comitData=wind.getComponent('inputKeyForm').getValue();
                        }
                        if(Ext.isEmpty(record)){
                            grid.store.add(comitData);
                        }
                        else{
                            for(var key in comitData){
                                if(key!='_id'){
                                    record.set(key,comitData[key]);
                                }
                            }
                        }
                        parentComp.close();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        wind.close();
                    }
                }
            ]
        });
        wind.show();
    },

    /**
     *赋值条件窗口
     * @param grid
     * @param record
     * @param productId
     */
    valueConditionWind:function(grid,record,productId){
        var wind=Ext.create("Ext.window.Window",{
            itemId: "valueConditionWind",
            title: i18n.getKey('valueCondition'),
            modal: true,
            layout: 'fit',
            width:900,
            height:600,
            items:[
                Ext.create('CGP.tools.freemark.template.view.KeysValueCondition',{
                    data:record.data,
                    itemId:'valueCondition',
                    productId:productId
                })
            ],
            bbar:[
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var parentComp=btn.ownerCt.ownerCt;
                        var comitData=null;
                        if(parentComp.getComponent('valueCondition').isValid()){
                            comitData=wind.getComponent('valueCondition').getValue();
                        }
                        if(record.get('isAdd')){
                            grid.store.add(comitData);
                        }
                        else{
                            for(var key in comitData){
                                if(key!='_id'){
                                    record.set(key,comitData[key]);
                                }
                            }
                        }

                        parentComp.close();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        wind.close();
                    }
                }
            ]
        });
        wind.show();
    },

    /**
     *参数转换为freemark变量
     * @param templateModules
     * @returns {String|string}
     * @constructor
     */
    variableToFreemark:function (templateModules){
        var resultData = '',variable='';
        if(Ext.isEmpty(templateModules)||templateModules.length<1)
            return resultData;
        Ext.Array.forEach(templateModules,function (item,index){
            if(item.groups.length==1&& (Ext.isEmpty(item.groups[0].condition)||item.groups[0].condition=={})){
                Ext.Array.forEach(item.groups[0].variables,function (el,i){
                    if(el.value.indexOf('lineItems')>=0){
                        variable+=el.name+'='+el.value+' ';
                    }
                    else{
                        variable+=el.name+'="'+el.value+'" ';
                    }
                })
            }
            else {
                Ext.Array.forEach(item.varKeys,function (key,i){
                    variable+=key.name+'=" " ';
                    // if(key.type=='NUMBER'){
                    //     Variable+=key.name+'=0 ';
                    // }
                    // else if(key.type=='BOOLEAN'){
                    //     Variable+=key.name+'=false ';
                    // }
                });
            }
        });
        resultData=Ext.String.format('<#assign {0} />',variable);
        return resultData;
    },
    /**
     *参数赋值转换为freemark表达式
     * @param condition
     * @returns {string|*}
     */
    conditionToFreemark: function (condition) {
        var me = this;
        if (Ext.isEmpty(condition)) {
            return '';
        }
        if (condition.conditionType == 'custom') {
            return condition.operation.expression;
        } else {
            // return me.operation(condition.operation);
            var conditionCtrl=Ext.create('CGP.common.condition.controller.Controller',{
                contentAttributeStore:Ext.data.StoreManager.get('contentAttribute')
            });
            return conditionCtrl.calculateBaseOperation(condition.operation);
        }
    },
    operation: function (operation) {
        var me = this;
        var resultData = '';
        if (Ext.isEmpty(operation)) {
            return resultData;
        }
        var operationClazz = operation.clazz;
        if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation') {
            var logicalOperator = '';
            if (operation.operator == 'AND') {
                logicalOperator = ' && ';
            } else if (operation.operator == 'OR') {
                logicalOperator = ' || ';
            }
            Ext.each(operation.operations, function (item, index) {
                if (item.clazz == 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation') {
                    me.operation(item);
                } else if (item.clazz != 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation' && index != 0) {
                    resultData += logicalOperator + me.operation(item);
                } else if (item.clazz != 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation' && index == 0) {
                    resultData += me.operation(item);
                }
            })
        }
        else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation')
        {
            var operator = me.getSelectionOperator(operation.operator);
            var midValue = me.getBaseValueResult(operation.midValue);
            Ext.each(operation.operations, function (item, index) {
                var value = me.getBaseValueResult(item);
                if (index == 0) {
                    resultData += "(" + value + operator.leftOperator + midValue;
                } else if (index == 1) {
                    resultData += '&&' + midValue + operator.rightOperator + value + ")";
                }
            })
        }
        else if (operationClazz == 'com.qpp.cgp.domain.executecondition.operation.CompareOperation') {
            var resultOperator = '';
            Ext.each(operation.operations, function (item, index) {

                var value = '';
                if (['In', 'NotIn'].indexOf(operation.operator) >= 0) {
                    if (index == 0) {
                        resultData = value;
                    } else {
                        var subArr = '[' + value + ']';
                        if (operation.operator == 'In') {
                            resultData = 'isContained(' + subArr + ',' + resultData + ')';
                        } else {
                            resultData = '!isContained(' + subArr + ',' + resultData + ')';
                        }
                    }
                }
                else
                {
                    if (index == 0) {
                        if (!Ext.isEmpty(item.skuAttributeId)) {

                            var attr='';
                            if(item.attributeProfile._id>0){
                                attr=Ext.String.format('lineItems[0].productInstance.productAttributeValueMap["{0}"].attributeOptionIds',item.skuAttributeId)
                            }
                            else{
                                attr=Ext.String.format('lineItems[0].productInstance.productAttributeValueMap["{0}"].attributeValue',item.skuAttributeId)
                            }
                            resultData += attr + operation.operator;
                        } else {
                            resultData += item.name + operation.operator;
                        }
                    }
                    else {
                        if (item.clazz=='com.qpp.cgp.domain.executecondition.operation.value.FixValue') {

                            resultData +='"'+item.value+'"';
                        }
                    }
                }

            })
        }
        return resultData
    },
    /**
     *
     * @param variables
     * @returns {string}
     */
    setValueExp:function (variables){
        var result='';
        if(variables&& variables instanceof Array){
            Ext.Array.each(variables,function (item){
                result+=Ext.String.format('<#assign {0}="{1}" >\n',item.name,item.value);
            });
        }
        return result;
    },

    /**
     *
     * @param data
     */
    testFreemark:function (data,mask){
        var me = this, method = "POST",url;
        url = composingPath + 'api/freemarker/templates/test';
        Ext.Ajax.request({
            url : url,
            method : method,
            headers : {
                Authorization: 'Bearer '+ Ext.util.Cookies.get('token')
            },
            jsonData : data,
            success : function(response,options){
                var resp = Ext.JSON.decode(response.responseText);
                if(resp.success){
                    mask.hide();
                    var wind=Ext.create("Ext.window.Window",{
                        itemId: "inputKeyWind",
                        title: i18n.getKey('test')+i18n.getKey('result'),
                        modal: true,
                        layout: 'fit',
                        width:500,
                        height:400,
                        items:[
                            {
                                xtype:'textareafield',
                                itemid:'result',
                                readOnly:true,
                                value:resp.data
                            }
                        ]
                    });
                    wind.show();
                }else{
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure')+resp.data.message)
                }
            },
            failure : function(response,options){
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure') + object.data.message);
            },
            callback : function(){
                mask.hide();
            }
        });
    },

    /**
     * 获取自定义参数数组
     * @param value
     */
    getVarKeys:function (value){
        var varKeys=[];
        if(value&& Array.isArray(value)){
            Ext.Array.each(value,function (item){
                if(Array.isArray(item.varKeys)){
                    varKeys=varKeys.concat(item.varKeys);
                }
            })
        }
        return varKeys;
    },

    /**
     *
     * @param pbtn
     */
    orderDataForm:function (pbtn){
        var wind=Ext.create("Ext.window.Window",{
            itemId: "inputKeyWind",
            title: i18n.getKey('orderData'),
            modal: true,
            layout: 'fit',
            width:900,
            height:600,
            items:[
                Ext.create('CGP.tools.freemark.template.view.OrderDataForm',{
                    itemId:'orderDataForm'
                })
            ],
            bbar:[
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var comitData=null;
                        if(wind.getComponent('orderDataForm').isValid()){
                            comitData=wind.getComponent('orderDataForm').getValue();
                        }
                        pbtn.ownerCt.getComponent('orderData').setValue(JSON.stringify(comitData));
                        wind.close();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        wind.close();
                    }
                }
            ]
        });
        wind.show();
    },

    /**
     * 变量对象创建freemark表达式
     * @param pbtn
     */
    fromVariable:function (pbtn){
        var me=this;
        var wind=Ext.create("Ext.window.Window",{
            itemId: "variableWind",
            title: i18n.getKey('variable'),
            modal: true,
            layout: 'fit',
            bodyPadding: 0,
            width:900,
            height:600,
            items:[
                Ext.create('CGP.tools.freemark.template.VariableQuery',{
                    itemId:'variableGrid',
                    simpleSelect:true
                })
                // {
                //     xtype: 'panel',
                //     itemId: 'fromVariable',
                //     //title: i18n.getKey("fromVariable"),
                //     autoScroll: false,
                //     html: '<iframe id="tools_iframe_variable" src="' + path + 'partials/tools/freemark/template/main.html?selectmodel=SINGLE" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>'
                // }
            ],
            bbar:[
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var selectionModel=btn.ownerCt.ownerCt.getComponent('variableGrid').grid.getSelectionModel();
                        var selectData=selectionModel.getSelection();
                        if(selectData.length>0){
                            var items=selectData[0].get('items');
                            Ext.create('CGP.common.store.ConditionProductAttribute', {
                                storeId:'contentAttribute',
                                productId: selectData[0].get('contextSource')["productId"],
                                listeners:{
                                    load:function (store, records,successful){
                                        if(successful){
                                            var strExp=me.variableToFreemark( items )+ '\n'+me.variabeltoExp( items );
                                            pbtn.ownerCt.getComponent('freemarkerExpression').setValue(strExp);
                                            pbtn.ownerCt.getComponent('resultTemplate').setValue(me.getResultTemplate( items ));
                                            wind.close();
                                        }
                                    }
                                }
                            });
                            // var productAttr=me.getProductAttr();
                            // Ext.create('Ext.data.Store', {
                            //     storeId:'contentAttribute',
                            //     model: "CGP.common.model.ConditionProductAttribute",
                            //     data:productAttr
                            // });

                        }
                        else{
                            Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('未选中数据'));
                        }

                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        wind.close();
                    }
                }
            ]
        });
        wind.show();
    },
    fromVariableNew:function (pbtn){
        var me=this;
        var wind=Ext.create("Ext.window.Window",{
            itemId: "variableWind",
            title: i18n.getKey('variable'),
            modal: true,
            layout: 'fit',
            width:900,
            height:600,
            items:[
                Ext.create('CGP.tools.freemark.template.SeachPage',{
                    itemId:'seachPage'
                })
            ],
            bbar:[
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var selectionModel=wind.getComponent('variableGrid').getSelectionModel();
                        var selectData=selectionModel.getSelection();//getSelection( )
                        if(selectionModel.getCount()>0){
                            var strExp=me.variableToFreemark(selectData[0].get('items'))+ '\n'+me.variabeltoExp(selectData[0].get('items'));
                            pbtn.ownerCt.getComponent('freemarkerExpression').setValue(strExp);
                            pbtn.ownerCt.getComponent('resultTemplate').setValue(me.getResultTemplate(selectData[0].get('items')));
                            Ext.getCmp('formInput').enable(true);
                            Ext.create('CGP.common.store.ProductAttributeStore', {
                                storeId: 'skuAttribute',
                                productId: selectData[0].get('contextSource')["productId"]
                            });
                            wind.close();
                        }
                        else{
                            Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('未选选中数据'));
                        }

                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        wind.close();
                    }
                }
            ]
        });
        wind.show();
    },
    /**
     * 变量对象转换成freemark赋值表达式
     * @param variables
     * @returns {string}
     */
    variabeltoExp:function (variables){
        var result='',me=this;
        Ext.Array.forEach(variables, function (TemplateModule) {
            if (TemplateModule.groups && !(TemplateModule.groups.length==1&&Ext.isEmpty(TemplateModule.groups[0].condition))) {
                var variablegroup = '';
                Ext.Array.forEach(TemplateModule.groups, function (el, index) {
                    var conditionExp = me.conditionToFreemark(el.condition);
                    var valueExp = me.setValueExp(el.variables);
                    if (conditionExp && valueExp) {
                        if (index == 0)
                            variablegroup += Ext.String.format('<#if {0}>\n{1}\n', conditionExp, valueExp);
                        else {
                            variablegroup += Ext.String.format('<#elseif {0}>\n{1}\n', conditionExp, valueExp);
                        }
                    } else if (Ext.isEmpty(conditionExp) && valueExp) {
                        variablegroup += Ext.String.format('<#else >\n{1}\n', conditionExp, valueExp);
                    }

                });
                if (variablegroup)
                    variablegroup += '</#if>\n';
                result += variablegroup;
            }
        });
        return result;
    },

    /**
     * 获取变量输出字符串模板
     * @param variables
     * @returns {string}
     */
    getResultTemplate:function (variables){
        var me=this;
        var varKeys=[],varTemplate='';
        if(Array.isArray(variables)){
            varKeys=me.getVarKeys(variables);
            varTemplate+='Custom Variable:\n';
        }
        Ext.Array.each(varKeys,function (varKey){
            varTemplate+=varKey.name+':${'+varKey.name+'};  '

        })
        var defaultVariateStore = Ext.data.StoreManager.get('defaultVariateStore');
        varTemplate+="\n\nDefault Variable:\n";
        if(defaultVariateStore){
            defaultVariateStore.each(function (item){
                varTemplate+=item.get('name')+':排版程序赋值 ;  '
                //defaultKeys.push(item.get('name'));
            })
        }
        return varTemplate;
    }
})