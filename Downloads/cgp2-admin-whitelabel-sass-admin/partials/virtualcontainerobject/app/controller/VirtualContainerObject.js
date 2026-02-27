Ext.define('CGP.virtualcontainerobject.controller.VirtualContainerObject', {
    extend: 'Ext.app.Controller',
    stores: [
        'VirtualContainerObject',
        'ContentMapItem'
    ],
    models: ['VirtualContainerObject', 'ContentMapItem'],
    views: [
        // 'Main',
        // 'ContentMapGrid',
        'Edit',
        'LayoutSet',
        'ContentMapItems',
        'ContentMapGrid',
        'ContentMapEdit',
        'Argument',
        'argument.GeneralArgument',
        'argument.LeftTree',
        'argumentbuilder.BuilderArgument',
        'argumentbuilder.LeftTree',
        'argumentbuilder.ConditionValueGrid',
        "argumentbuilder.OutCenterPanel",
        'argumentbuilder.ConditionValueEdit',
        'argumentbuilder.ValueContainer',
        'argumentbuilder.RepeatValueEx',
        'VCOCombo',
        'ContentMapItemAdd'
    ],
    extraFunString: 'function isContained(aa,bb){if(typeof(bb)=="string"){bb=bb.split(",")}if(aa==null||aa==undefined||aa==""){return false}if(bb==null||bb==undefined||bb==""){return false}for(var i=0;i<bb.length;i++){var flag=false;for(var j=0;j<aa.length;j++){if(aa[j]==bb[i]){flag=true;break}}if(flag==false){return flag}}return true};function equal(arr1,arr2){var flag=true;if(typeof(arr1)=="string"){arr1=arr1.split(",")}if(typeof(arr2)=="string"){arr2=arr2.split(",")}if(arr1==""||arr1==undefined||arr1==null){if(arr2.length==0){return true}else{return false}}if(arr2==""||arr2==undefined||arr2==null){if(arr1.length==0){return true}else{return false}}if(arr1.length!==arr2.length){flag=false}else{arr1.forEach(function(item,index,arr){if(!isContained(arr2,[item])){flag=false}})}return flag};',
    dealExpressionController: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.DealConditionV2'),

    init: function () {
        this.control({
            'form toolbar [itemId="addRepeat"]': {
                click: this.addRepeat
            },
            // 'grid [itemId="conditionValueAdd"]': {
            //     click: this.addConditionValue
            // },
            '[itemId="itemAdd"]': {
                click: this.addvcoItem
            },
            'form toolbar [itemId="btnSave"]': {
                click: this.saveVCO
            }
        });
    },

    saveVCO: function (btn) {
        var form = btn.ownerCt.ownerCt;
        if (!form.isValid()) {
            return false;
        }
        var data = form.diyGetValue();
        var url = adminPath + 'api/virtualContainerObjects', method = 'POST';
        var id = JSGetQueryString('id');
        if (id) {
            method = 'PUT';
            url += '/' + id;
        }
        var callback = function (require, success, response) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                form.vcoId = resp.data?._id;
                form.diySetValue(resp.data);
            }
        };
        JSAjaxRequest(url, method, true, data, i18n.getKey('save') + i18n.getKey('success'), callback)
    },
    /**
     * 返回的是一个展平的对象
     * @param v
     * @param parentKeys
     * @returns {*|{[p: string]: *}}
     */
    flattern: function (v, parentKeys = []) {
        if (!Ext.isObject(v)) {
            return {[parentKeys.join(".")]: v}
        }
        // 是对象的话，递归映射。注意 flattern()
        const subs = Object.entries(v)
            .map(([key, value]) => flattern(value, [...parentKeys, key]));
        // subs 是多个（当前 v 每个属性对应一个）展平的对象，
        // 当然需要合并成一个返回去的
        return Object.assign({}, ...subs);
    },

    createValueComp: function (record, leftTree) {
        var me = leftTree;
        var valueType = record.get('valueType');
        var selectType = record.get('selectType');
        var options = record.get('options');
        var array = record.getPath('name').split('/');
        var valuePath = '$';
        Ext.Array.each(array, function (item) {
            if (!Ext.isEmpty(item)) {
                valuePath += '.' + item;
            }
        });
        var comp = null;
        if (record.get('leaf')) {
            comp = {
                width: 330,
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        var array = record.getPath('name').split('/');
                        var value = me.valueJsonObject;
                        for (var i = 0; i < array.length; i++) {
                            if (!Ext.isEmpty(array[i])) {

                                if (i == array.length - 1) {
                                    if (Ext.isEmpty(newValue)) {
                                        value[array[i]] = null;
                                    } else {
                                        value[array[i]] = newValue;
                                    }
                                } else if (array[2] && array[2].indexOf('item_') == 0) {
                                    value = me.valueJsonObject[array[i]];
                                } else {
                                    value = value[array[i]];
                                }
                            }
                        }

                    },
                    afterrender: function (comp) {
                        if (me.objectJson) {
                            comp.setValue(jsonPath(me.objectJson, valuePath)[0] || jsonPath(me.valueJsonObject, valuePath)[0]);
                        }
                    }
                }
            };
            switch (selectType) {
                case 'NON':
                    if (Ext.Array.contains(['String', 'Date'], valueType)) {
                        comp = Ext.merge(comp, {
                            xtype: 'textfield',
                        })

                    } else if (Ext.Array.contains(['Number', 'int'], valueType)) {
                        comp = Ext.merge(comp, {
                            xtype: 'numberfield',
                            allowBlank: false
                        })

                    } else if (valueType === 'Boolean') {
                        comp = Ext.merge(comp, {
                            xtype: 'combo',
                            displayField: 'name',
                            valueField: 'value',
                            editable: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value'],
                                data: [
                                    {name: 'true', value: true},
                                    {name: 'false', value: false}
                                ]
                            }),
                            queryMode: 'local'
                        })
                    }
                    break;
                case 'SINGLE':
                    if (Ext.Array.contains(['String', 'Date', 'Number', 'int', 'Boolean'], valueType)) {
                        comp = Ext.merge(comp, {
                            xtype: 'combo',
                            displayField: 'name',
                            editable: false,
                            valueField: 'value',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value'],
                                data: options
                            }),
                            queryMode: 'local'
                        });
                    }
                    break;
                case 'MULTI':
                    if (Ext.Array.contains(['String', 'Date', 'Number', 'int', 'Boolean'], valueType)) {
                        comp = Ext.merge(comp, {
                            xtype: 'combo',
                            displayField: 'name',
                            multiSelect: true,
                            editable: false,
                            valueField: 'value',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'value'],
                                data: options
                            }),
                            queryMode: 'local'
                        });
                    }
                    break;
            }
        }
        return comp;
    },
    createConditionValueComp: function (name, rtAttrData, gridRec) {

        var valueType = rtAttrData?.valueType;
        var selectType = rtAttrData?.selectType;
        var options = rtAttrData?.options;
        var value = gridRec?.get('outputValue');
        var comp = {
            itemId: 'fixValueField',
            fieldLabel: rtAttrData?.name,
            listeners: {
                afterrender: function (comp) {
                    comp.setValue(value?.value);
                }
            },
        };
        switch (selectType) {
            case 'NON':
                if (Ext.Array.contains(['String', 'Date'], valueType)) {
                    comp.xtype = 'textfield';
                } else if (Ext.Array.contains(['Number', 'int'], valueType)) {
                    comp.xtype = 'numberfield';
                } else if (valueType === 'Boolean') {
                    comp = Ext.merge(comp, {
                        xtype: 'combo',
                        displayField: 'name',
                        valueField: 'value',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: [
                                {name: 'true', value: true},
                                {name: 'false', value: false}
                            ]
                        }),
                        queryMode: 'local'
                    })
                }
                break;
            case 'SINGLE':
                if (Ext.Array.contains(['String', 'Date', 'Number', 'int', 'Boolean'], valueType)) {
                    comp = Ext.merge(comp, {
                        xtype: 'combo',
                        displayField: 'name',
                        editable: false,
                        valueField: 'value',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: options
                        }),
                        queryMode: 'local'
                    });
                }
                break;
            case 'MULTI':
                if (Ext.Array.contains(['String', 'Date', 'Number', 'int', 'Boolean'], valueType)) {
                    comp = Ext.merge(comp, {
                        xtype: 'combo',
                        displayField: 'name',
                        multiSelect: true,
                        editable: false,
                        valueField: 'value',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: options
                        }),
                        queryMode: 'local'
                    });
                }
                break;
        }
        var resultContainer = Ext.widget('valuecontainer', {
            itemId: 'valueContainer',
            name: name,
            msgTarget: 'none',
            attribute: rtAttrData,
            JSExpressionInputFieldConfig: {
                contextData: null
            }
        });
        resultContainer.add(comp);
        var type = resultContainer.fixValueClazz;
        if (comp.xtype == 'textfield' || comp.xtype == 'numberfield') {
            resultContainer.add([
                {
                    xtype: 'textarea',
                    itemId: 'expressionField',
                    fieldLabel: rtAttrData?.name,
                    emptyText: 'return arg1 + 2;',
                    hidden: true,
                    disabled: true
                },
                {
                    xtype: 'displayfield',
                    itemId: 'switch',
                    columnWidth: 0.2,
                    height: 24,
                    value: '<img class="tag" title="切换为表达式输入" style="margin-left: 0px;margin-top:-4px;height:24px;width: 24px;cursor: pointer" src="' + resultContainer.switchUrl + '">',
                    listeners: {
                        render: function (display) {
                            var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                            if (type == resultContainer.fixValueClazz || Ext.isEmpty(type)) {
                                a.title = '切换为表达式输入';
                            } else {
                                a.title = '切换为固定值输入';
                            }
                            ela.on("click", function () {
                                var form = display.ownerCt.ownerCt;
                                var fixValueField = display.ownerCt.getComponent('fixValueField');
                                var expressionField = display.ownerCt.getComponent('expressionField');
                                if (fixValueField.hidden == true) {
                                    a.title = '切换为表达式输入';
                                    fixValueField.show();
                                    expressionField.hide();
                                    expressionField.setDisabled(true);
                                    fixValueField.setDisabled(false);
                                } else {
                                    a.title = '切换为固定值输入';
                                    fixValueField.hide();
                                    expressionField.show();
                                    expressionField.setDisabled(false);
                                    fixValueField.setDisabled(true);
                                }
                            });
                        }
                    }
                }
            ]);
        }
        return resultContainer;
    },
    selectVCT: function (btn, from) {
        var mainPage = btn.ownerCt.ownerCt;
        var title = i18n.getKey('select') + i18n.getKey('VCT');
        var win = Ext.create("Ext.window.Window", {
            itemId: "vctWindow",
            title: title,
            modal: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    itemId: 'vctForm',
                    border: 0,
                    items: [
                        {
                            name: 'containerType',
                            xtype: 'gridcombo',
                            fieldLabel: i18n.getKey('VCT'),
                            itemId: 'containerType',
                            displayField: 'displayName',
                            valueField: '_id',
                            width: 380,
                            margin: '10 25',
                            editable: false,
                            store: Ext.create('CGP.virtualcontainertype.store.VirtualContainerTypeStore', {
                                storeId: 'vctStore'
                            }),
                            matchFieldWidth: false,
                            multiSelect: false,
                            allowBlank: false,
                            autoScroll: true,
                            filterCfg: {
                                layout: {
                                    type: 'column',
                                    columns: 3
                                },
                                defaults: {
                                    width: 250,
                                    isLike: false,
                                    padding: 2,
                                    labelWidth: 40

                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('id'),
                                        name: '_id',
                                        itemId: '_id',
                                        isLike: false,
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('description'),
                                        name: 'description',
                                        itemId: 'description',
                                    },
                                ]
                            },
                            gridCfg: {
                                store: Ext.data.StoreManager.lookup('vctStore'),
                                height: 300,
                                width: 600,
                                autoScroll: true,
                                //hideHeaders : true,
                                columns: [
                                    {
                                        text: i18n.getKey('id'),
                                        width: 100,
                                        dataIndex: '_id',
                                        renderer: function (value, metaData) {
                                            metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                            return value;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('description'),
                                        flex: 1,
                                        dataIndex: 'description'
                                    }
                                ],
                                bbar: Ext.create('Ext.PagingToolbar', {
                                    store: Ext.data.StoreManager.lookup('vctStore'),
                                    displayInfo: true, // 是否 ? 示， 分 ? 信息
                                    displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                    emptyMsg: i18n.getKey('noData')
                                })
                            }
                        }
                    ]
                }

            ],
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var window = btn.ownerCt.ownerCt;
                        var formComp = window.getComponent('vctForm');
                        if (!formComp.isValid()) {
                            return false;
                        }
                        var vct = formComp.getComponent('containerType').getValue();
                        var tabId = 'virtualcontainerobject/app/view' + '_edit';
                        window.close();
                        JSOpen({
                            id: from ? from + tabId : tabId,
                            url: path + "partials/" + 'virtualcontainerobject/app/view' + "/edit.html?vctId=" + Object.keys(vct)[0],
                            title: 'create' + '_' + i18n.getKey('VCO')
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }]
        });
        win.show();
    },

    addRepeat: function (btn) {
        var me = this;
        var currTree = btn.ownerCt.ownerCt;
        var itemRtType = currTree.itemRtType;
        if (Ext.isEmpty(itemRtType)) {
            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('必须先选择子VCO!'));
            return false;
        }
        me.addItemNode(currTree, itemRtType);
    },
    addItemNode: function (currTree, itemRtType, itemValue) {
        var me = this;
        if (Ext.isEmpty(itemRtType)) {
            return false;
        }
        var root = currTree.getRootNode();
        var index = root.childNodes?.length ? root.childNodes?.length : 0;
        var nodeId = JSGetUUID();
        var childenItem = {
            "_id": nodeId,
            "clazz": "com.qpp.cgp.domain.bom.attribute.RtAttributeDef",
            "code": "item_" + index,
            "name": "item_" + index,
            "description": "",
            "required": true,
            "valueType": "CustomType",
            "validationExp": "",
            "valueDefault": "",
            "selectType": "NON",
            "customType": {
                "_id": itemRtType["_id"],
                "idReference": "RtType",
                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                "attributesToRtTypes": [],
                "multilingualKey": "com.qpp.cgp.domain.bom.attribute.RtType"
            },
            "arrayType": "Array",
            "options": [],
            "belongsToParent": true,
            "depth": 1,
            "sortOrder": 1,
            "id": nodeId
        };
        // if(Ext.isEmpty(currTree.objectJson)){
        //     currTree.objectJson={};
        // }
        // if(itemValue){
        //     currTree.objectJson["item_" + index]=itemValue;
        // }
        currTree.getRootNode().appendChild(childenItem);
        me.organizeValueObject(currTree, currTree.getRootNode(), childenItem);
    },
    /**
     * 构建valueObject
     * @param currTree
     * @param node
     * @param recData
     */
    organizeValueObject: function (currTree, node, recData) {
        var item = recData, me = currTree;
        if (node.isRoot()) {
            if (item['valueType'] == 'CustomType') {
                me.valueJsonObject[item['name']] = {};
            } else {
                if (!Ext.isEmpty(me.objectJson)) {
                    if (!Ext.isEmpty(me.objectJson[item['name']])) {
                        me.valueJsonObject[item['name']] = me.objectJson[item['name']]
                    } else {
                        me.valueJsonObject[item['name']] = null
                    }
                }
            }
        } else {
            var path = node.getPath('name');
            var array = path.split('/');
            var valuePath = '$';
            Ext.Array.each(array, function (item) {
                if (!Ext.isEmpty(item)) {
                    valuePath += '.' + item;
                }
            });
            if (item['valueType'] == 'CustomType') {
                jsonPath(me.valueJsonObject, valuePath)[0][item['name']] = {};
            } else {
                if (jsonPath(me.objectJson, valuePath)) {
                    jsonPath(me.valueJsonObject, valuePath)[0][item['name']] = jsonPath(me.objectJson, valuePath)[0][item['name']]
                } else {
                    jsonPath(me.valueJsonObject, valuePath)[0][item['name']] = null
                }
            }
        }
    },

    addConditionValue: function (btn) {
        var grid = btn.ownerCt.ownerCt, me = this;
        if (Ext.isEmpty(grid.rtAttribute)) {
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择左侧要赋值的属性'));
            return false;
        }
        me.editConditionValue(grid, null);
    },
    editConditionValue: function (grid, currRec) {
        for (var i = 0; i < grid.store.getCount(); i++) {
            var record = grid.store.getAt(i);
            var condition = record.get('condition');
            if (Ext.isEmpty(condition)) {
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('已有无条件执行的配置，无需添加其他配置'));
                return;
            }
        }
        var win = Ext.widget('conditionvalueedit', {
            createOrEdit: Ext.isEmpty(currRec) ? 'create' : 'edit',
            outGrid: grid,
            rtAttribute: grid.rtAttribute,
            record: currRec
        });
        win.show();
    },

    addvcoItem: function (btn) {
        var contentMapGrid = Ext.ComponentQuery.query('form [itemId="contentMapGrid"]')[0];

        var win = Ext.widget('contentitemadd', {
            itemId: 'contentItemAdd',
            contentMapGrid: contentMapGrid
        });
        win.show();
    },

    mapKeyValue: function (args, rtAttributeTree) {
        var controller = this;
        var result = [];
        var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
        args.forEach(function (item) {
            var expression = '';
            var elseExpression = '';
            for (var i = 0; i < item.mappingRules.length; i++) {//遍历某一属性下的值配置
                var valueRule = item.mappingRules[i];
                var outputValue = valueRule.outputValue.value || controller.dealExpressionValue(valueRule.outputValue.calculationExpression);
                var rootNode = rtAttributeTree.getRootNode();
                var rtAttribute = null;
                rootNode.cascadeBy(function (node) {
                    if (node.getPath('name') == item.key) {
                        rtAttribute = node;
                        return false;
                    }
                });
                var resultType = item.resultType;
                if (resultType == 'Number' || resultType == 'int') {//Number,int,Data都转换为string，Boolean不变
                    resultType = 'Number';
                } else if (resultType == 'Data') {
                    resultType = 'String'
                }
                if (rtAttribute.raw.selectType != 'NON') {//选项类型
                    if (rtAttribute.raw.selectType == 'SINGLE') {
                        outputValue = "'" + outputValue + "'";
                        if (resultType == 'Boolean') {
                            resultType = 'String';
                        }
                    } else {//多选类型
                        if (rtAttribute.raw.arrayType == 'NON') {//现在处理多选的选择类型数据值时，
                            resultType = 'Array';
                        } else {
                            resultType = 'Array';
                        }
                    }
                } else {//输入类型
                    if (valueRule.outputValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                        if (resultType == 'Number') {
                            outputValue = new Number(outputValue);
                        } else {
                            outputValue = "'" + outputValue + "'";
                        }
                    } else {
                        outputValue = outputValue;
                    }
                }
                if (Ext.isEmpty(valueRule.condition) || (valueRule.condition.conditionType == 'normal' && Ext.isEmpty(valueRule.condition.operation.operations))) {
                    if (valueRule.outputValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                        expression = 'return ' + outputValue + ';';
                    } else {
                        var output = outputValue;
                        expression = output;
                    }
                } else {
                    if (valueRule.condition.conditionType == 'else') {
                        if (valueRule.outputValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                            elseExpression = 'return ' + outputValue + ';';
                        } else {
                            elseExpression = outputValue;
                        }
                    } else {
                        if (valueRule.outputValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                            expression += 'if(' + controller.dealExpressionController.calculateBaseOperation(valueRule.condition.operation, skuAttributeStore) + '){return ' + outputValue + '};';
                        } else {
                            var output = outputValue;
                            expression += 'if(' + controller.dealExpressionController.calculateBaseOperation(valueRule.condition.operation, skuAttributeStore) + '){' + output + '};';
                        }
                    }
                }
            }
            expression += elseExpression;

            /*
                        var equal = "function (valA, valB) {valA = valA+'';valA=valA.replace(' ','');valB='['+valB+']';return valA==valB;};";//垃圾js引擎，不要问
            */
            result.push({
                key: item.key.replace('//', '$.').replace(/\//g, '.'),
                clazz: 'com.qpp.cgp.domain.pcresource.virtualcontainer.MapKeyValue',
                value: {
                    "clazz": "com.qpp.cgp.domain.pcresource.virtualcontainer.ExpressionValue",
                    "valueEx": {
                        "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                        "type": resultType,
                        "expression": {
                            "clazz": "com.qpp.cgp.expression.Expression",
                            "resultType": resultType,
                            "inputs": [],
                            "expression": 'function expression(args) {' +
                                controller.extraFunString +
                                expression +
                                '}'
                        }
                    }
                },
            })
        })
        return result;
    },

    dealExpressionValue: function (input) {
        var packer = new Packer;
        var output = packer.pack(input, 0, 0);
        output = output.replace(/Attr_[0-9]+/g, function (item) {
            item = item.replace('Attr_', "args.context['");
            item += "']";
            return item;
        });
        output = output.replace(/currentMaterial/g, 'args.params.material');
        output = output.replace(/generateObiQuantity/g, 'args.params.generateObiQuantity');
        return output;
    },

    showArgument: function (comp) {
        var leftTree = comp.getComponent('leftTree');
        if (Ext.isEmpty(leftTree.data) || Ext.Object.isEmpty(leftTree.data)) {
            leftTree.store.load();
        }
    }
});