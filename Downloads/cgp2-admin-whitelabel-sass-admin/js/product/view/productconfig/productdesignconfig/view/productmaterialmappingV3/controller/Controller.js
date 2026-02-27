/**
 * Created by nan on 2020/3/26.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller", {
    extraFunString: 'function isContained(aa,bb){if(typeof(bb)=="string"){bb=bb.split(",")}if(aa==null||aa==undefined||aa==""){return false}if(bb==null||bb==undefined||bb==""){return false}for(var i=0;i<bb.length;i++){var flag=false;for(var j=0;j<aa.length;j++){if(aa[j]==bb[i]){flag=true;break}}if(flag==false){return flag}}return true};function equal(arr1,arr2){var flag=true;if(typeof(arr1)=="string"){arr1=arr1.split(",")}if(typeof(arr2)=="string"){arr2=arr2.split(",")}if(arr1==""||arr1==undefined||arr1==null){if(arr2.length==0){return true}else{return false}}if(arr2==""||arr2==undefined||arr2==null){if(arr1.length==0){return true}else{return false}}if(arr1.length!==arr2.length){flag=false}else{arr1.forEach(function(item,index,arr){if(!isContained(arr2,[item])){flag=false}})}return flag};',
    dealExpressionController: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.DealConditionV2'),
    getSMTDetail: function (mmtId) {
        var result = null;
        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + mmtId,
            method: 'GET',
            async: false,//同步请求
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
        return result;
    },
    /**
     * 创建BomIitemMapping的fieldSet
     * @param data
     * @param defaultMulti
     * @param value
     * @param type
     */
    createFieldByAttribute: function (data, defaultMulti, value, type, excludeAttributeValue) {
        var me = this;
        var controller = this;
        data = data.rtAttributeDef;
        var inputType = data['inputType'];
        var selectType = data['selectType'];
        var options = Ext.clone(data['options']);
        var switchUrl = path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png';
        var item = {};
        item.name = 'outputValue';
        item.fieldLabel = i18n.getKey('material') + i18n.getKey('attribute') + i18n.getKey('value');
        item.width = 320;
        item.allowBlank = false;
        item.value = value;
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
            item.valueField = 'value';//不需要id
            item.editable = false;
            item.store = new Ext.data.Store({
                fields: ['value', 'name'],
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
            var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
            for (var i = 0; i < skuAttributeStore.getCount(); i++) {
                var skuAttributeData = skuAttributeStore.getAt(i).getData();
                contextData.push({
                    id: skuAttributeData.attribute.id,
                    valueName: skuAttributeData.attribute.name + '的值',
                    displayName: "Attr_" + skuAttributeData.attribute.id
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
                fieldLabel: i18n.getKey('material') + i18n.getKey('attribute') + i18n.getKey('value'),
                JSExpressionInputFieldConfig: {
                    contextData: contextData
                }
            }
        }
        return item;
    },

    /**
     * 根据选择的bomItem类型添加不同组件
     */
    addBomItemConfig: function (bomItem, BomItemConfigPanel, win, data) {
        var items = [];
        var clazz = 'com.qpp.cgp.domain.product.config.material.mapping2dto.FixedBOMItemMappingDTOConfig';
        if (bomItem.clazz == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {//可选件
            items.push({
                xtype: 'bomitemqtyconfiggridfield',
                bomItem: bomItem,
                fieldLabel: i18n.getKey('Bom比例配置'),
                data: data ? data.qtyMappingRules : []
            });
            items.push({
                xtype: 'bomitemmaterialpredicatesgridfield',
                bomItem: bomItem,
                allowBlank: true,
                tipInfo: '',
                data: data ? data.materialPredicates : []
            })
            clazz = 'com.qpp.cgp.domain.product.config.material.mapping2dto.OptionalBOMItemMappingDTOConfig';
        } else if (bomItem.clazz == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {//待定件
            items.push({
                xtype: 'bomitemqtyconfiggridfield',
                bomItem: bomItem,
                fieldLabel: i18n.getKey('BomItem分裂数量配置'),
                name: 'bomItemQtyMappingRules',
                data: data ? data.bomItemQtyMappingRules : []
            });
            items.push({
                xtype: 'bomitemmappingsgridfield',
                bomItem: bomItem,
                material: BomItemConfigPanel.material,
                data: data ? data.obiMappings : []
            });
            items.push({
                xtype: 'bomitemmappingindexrulesgrid',
                bomItem: bomItem,
                data: data ? data.obiMappingIndexRules : []
            });
            clazz = 'com.qpp.cgp.domain.product.config.material.mapping2dto.UnassignBOMItemMappingDTOConfig';
        } else {//固定件
            items.push({
                xtype: 'bomitemqtyconfiggridfield',
                bomItem: bomItem,
                fieldLabel: i18n.getKey('Bom比例配置'),
                name: 'qtyMappingRules',
                data: data ? data.qtyMappingRules : []
            });
        }
        var diyFieldSet = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.DiyFieldSet', {
            title: bomItem.name + '<' + bomItem._id + '>' + '(' + bomItem.clazz.split('.').pop() + ')',
            bomItem: bomItem,
            clazz: clazz
        });
        diyFieldSet.add(items);
        BomItemConfigPanel.add(diyFieldSet);
        //触发修改事件
        var centerContainer = Ext.getCmp('productMaterialMappingV3_CenterContainer');
        if (Ext.isEmpty(data) && centerContainer) {
            centerContainer.fireEvent('dirty');
        }
        return diyFieldSet;

    },

    /**defaultValue: ""
     * 查看bomItemIndex配置
     * @param value
     */
    checkBomItemIndexMapping: function (value) {
        var win = Ext.create('Ext.window.Window', {
            width: 850,
            modal: true,
            constrain: true,
            layout: 'fit',
            title: i18n.getKey('查看映射规则'),
            height: 350,
            items: [
                {
                    xtype: 'grid',
                    autoScroll: true,
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {
                                name: 'condition',
                                type: 'object'
                            },
                            {
                                name: 'outputValue',
                                type: 'object'
                            },
                            {
                                name: 'description',
                                type: 'string'
                            }
                        ],
                        data: value || []
                    }),
                    columns: [
                        {
                            xtype: 'rownumberer',
                            tdCls: 'vertical-middle',
                            width: 60
                        },
                        {
                            text: i18n.getKey('description'),
                            dataIndex: 'description',
                            tdCls: 'vertical-middle',
                            itemId: 'description',
                            flex: 1
                        },
                        {
                            text: i18n.getKey('condition'),
                            dataIndex: 'condition',
                            tdCls: 'vertical-middle',
                            itemId: 'condition',
                            width: 150,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                                if (value && value.conditionType == 'else') {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<font color="red">其他条件都不成立时执行</font>'
                                    };
                                } else if (value && (value.operation.operations.length > 0 || value.conditionType == 'custom')) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看执行条件</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    controller.checkCondition(value);
                                                });
                                            }
                                        }
                                    };
                                } else {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<font color="green">无条件执行</font>'
                                    };
                                }
                            }
                        },
                        {
                            text: i18n.getKey('可选件生成规则'),
                            dataIndex: 'outputValue',
                            tdCls: 'vertical-middle',
                            itemId: 'outputValue',
                            flex: 1,
                            renderer: function (value) {
                                return value.value;
                            }
                        }]
                }
            ]
        });
        win.show();
    }
    ,
    /**
     *保存和修改操作
     */
    saveProductMaterialMappingConfig: function (data, createOrEdit, recordId, centerPanel) {
        var url = adminPath + 'api/materialMappingDTOConfigs';
        var method = 'POST';
        if (createOrEdit == 'edit') {
            url = adminPath + 'api/materialMappingDTOConfigs/' + recordId;
            method = 'PUT';
        }
        var manageMaterialMappingLeftGrid = centerPanel.ownerCt.getComponent('manageMaterialMappingLeftGrid');
        var materialPath = data.materialMappingConfigDomain.materialPath;
        var materialId = materialPath.replace(/,/g, '-');
        Ext.Ajax.request({
            url: url,
            async: false,
            method: method,
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                centerPanel.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    if (manageMaterialMappingLeftGrid.hidden == false) {
                        manageMaterialMappingLeftGrid.store.load();
                    }
                    centerPanel.materialMappingDTOConfig = responseMessage.data;
                    centerPanel.isDirty = false;
                    centerPanel.createOrEdit = 'edit';
                    var leftBomTree = Ext.getCmp('leftBomTree');
                    var treeNode = leftBomTree.getStore().getNodeById(materialId);
                    var selections = leftBomTree.getSelectionModel().getSelection();
                    leftBomTree.getStore().load({
                        node: treeNode,
                        callback: function () {
                            leftBomTree.getSelectionModel().select(selections, false, true);
                        }
                    });
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                centerPanel.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    }
    ,
    /**
     * 获取到配置数据
     */
    getMaterialMappingDTOConfig: function (materialPath, productConfigDesignId, async, configType) {
        var result = null;
        Ext.Ajax.request({
            url: encodeURI(adminPath +
                'api/materialMappingDTOConfigs?page=1&limit=1000&filter= [' +
                '{"name":"materialPath","value":"' +
                materialPath +
                '","type":"string"},' +
                '{"name":"' + (configType == 'mappingConfig' ? 'productConfigMappingId' : 'productConfigDesignId') + '","value":"' +
                productConfigDesignId +
                '","type":"number"}' +
                ']'),
            method: 'GET',
            async: async || false,//同步请求
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data.content;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
        return result;
    }
    ,
    /**
     * 查看BomItem用量映射规则配置，待定件中的
     * @param value
     */
    checkBomItemQtyMappingRules: function (value) {
        var controller = this;
        var win = Ext.create('Ext.window.Window', {
            width: 850,
            modal: true,
            constrain: true,
            layout: 'fit',
            title: i18n.getKey('BomItem用量映射规则'),
            height: 350,
            items: [
                {
                    xtype: 'grid',
                    autoScroll: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                name: 'condition',
                                type: 'object'
                            },
                            {
                                name: 'outputValue',
                                type: 'object'
                            },
                            {
                                name: 'description',
                                type: 'string'
                            }, {
                                name: 'clazz',
                                type: 'string',
                                value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule'
                            }
                        ],
                        data: value || []
                    }),
                    columns: [
                        {
                            xtype: 'rownumberer',
                            tdCls: 'vertical-middle',
                            width: 60
                        },
                        {
                            text: i18n.getKey('condition'),
                            dataIndex: 'condition',
                            tdCls: 'vertical-middle',
                            itemId: 'condition',
                            width: 150,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                                var grid = gridView.ownerCt;
                                console.log(value)
                                if (value && (value.operation && value.operation.operations.length > 0 || value.conditionType == 'custom')) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看执行条件</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    controller.checkCondition(value);
                                                });
                                            }
                                        }
                                    };

                                } else {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<font color="green">无条件执行</font>'
                                    };
                                }
                            }
                        },
                        {
                            text: i18n.getKey('qty'),
                            dataIndex: 'outputValue',
                            tdCls: 'vertical-middle',
                            itemId: 'outputValue',
                            width: 250,
                            renderer: function (value, mateData, record) {
                                console.log(value)
                                return value.value;
                            }
                        },
                        {
                            text: i18n.getKey('description'),
                            dataIndex: 'description',
                            tdCls: 'vertical-middle',
                            itemId: 'description',
                            flex: 1
                        }
                    ]
                }
            ]
        });
        win.show();
    }
    ,
    /**
     * 查看BomItem物料映射过滤规则,待定件中的
     * @param value
     */
    checkBomItemMaterialPredicates: function (value) {
        var controller = this;
        var win = Ext.create('Ext.window.Window', {
            width: 850,
            modal: true,
            constrain: true,
            layout: 'fit',
            title: i18n.getKey('查看映射规则'),
            height: 350,
            items: [
                {
                    xtype: 'grid',
                    autoScroll: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                name: 'condition',
                                type: 'object'
                            },
                            {
                                name: 'materialId',
                                type: 'string'
                            },
                            {
                                name: 'filterExpression',
                                type: 'string'
                            },
                            {//默认是单个物料过滤
                                name: 'clazz',
                                type: 'string',
                                value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO'
                            }
                        ],
                        data: value || []
                    }),
                    columns: [
                        {
                            xtype: 'rownumberer',
                            tdCls: 'vertical-middle',
                            width: 60
                        },
                        {
                            text: i18n.getKey('condition'),
                            dataIndex: 'condition',
                            tdCls: 'vertical-middle',
                            itemId: 'condition',
                            width: 150,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                                var grid = gridView.ownerCt;
                                if (value && (value.operation && value.operation.operations.length > 0 || value.conditionType == 'custom')) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看执行条件</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    controller.checkCondition(value);
                                                });
                                            }
                                        }
                                    };

                                } else {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<font color="green">无条件执行</font>'
                                    };
                                }
                            }
                        },
                        {
                            text: i18n.getKey('筛选'),
                            dataIndex: 'materialId',
                            tdCls: 'vertical-middle',
                            itemId: 'materialId',
                            flex: 1,
                            renderer: function (value, mateData, record) {
                                if (record.get('clazz') == 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO') {
                                    return '排除的物料 : ' + record.get('materialId');
                                } else if (record.get('clazz') == 'com.qpp.cgp.domain.product.config.material.mapping2dto.ExcludeFilterDTO') {
                                    return '批量排除公式 : ' + record.get('filterExpression');
                                } else if (record.get('clazz') == 'com.qpp.cgp.domain.product.config.material.mapping2dto.IncludeFilterDTO') {
                                    return '选定指定物料 : ' + record.get('materialId');
                                }
                            }
                        },
                        {
                            text: i18n.getKey('type'),
                            dataIndex: 'clazz',
                            tdCls: 'vertical-middle',
                            itemId: 'clazz',
                            flex: 1,
                            renderer: function (value, mateData, record) {
                                if (value == 'com.qpp.cgp.domain.product.config.material.mapping2dto.ExcludeFilterDTO') {
                                    return '表达式批量排除';
                                } else if (value == 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO') {
                                    return '单个物料排除';
                                } else if (value == 'com.qpp.cgp.domain.product.config.material.mapping2dto.IncludeFilterDTO') {
                                    return '选定指定物料';
                                }
                            }
                        }
                    ]
                }
            ]
        });
        win.show();
    }
    ,
    /**
     * 查看BomItem物料映射过滤规则,待定件中的
     * @param value
     */
    checkItemMaterialMappingConfigs: function (value) {
        var controller = this;
        var includeIds = [];
        value.forEach(function (item) {
            includeIds.push(item.materialMappingId);
        });
        var win = Ext.create('Ext.window.Window', {
            width: 850,
            modal: true,
            constrain: true,
            layout: 'fit',
            title: i18n.getKey('查看物料对应的mapping'),
            height: 350,
            items: [
                {
                    xtype: 'grid',
                    autoScroll: true,
                    allowBlank: false,
                    store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.store.MaterialMappingDTOConfigStore', {
                        params: {
                            filter: Ext.JSON.encode([{
                                name: 'includeIds',
                                type: 'string',
                                value: '[' + includeIds + ']'
                            }])
                        }
                    }),
                    height: 280,
                    selType: 'checkboxmodel',
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: '_id'
                        },
                        {
                            text: i18n.getKey('materialPath'),
                            flex: 1,
                            dataIndex: 'materialPath'
                        },
                        {
                            text: i18n.getKey('materialMappingDomainId'),
                            flex: 1,
                            dataIndex: 'materialMappingDomainId'
                        }
                    ]

                }
            ]
        });
        win.show();
    }
    ,
    /**
     * 查看条件
     */
    checkCondition: function (conditionData) {
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('查看条件'),
            modal: true,
            constrain: true,
            height: 350,
            items: [
                {
                    xtype: 'conditionfieldcontainer',
                    name: 'condition',
                    itemId: 'condition',
                    width: 800,
                    readOnly: true,
                    fieldLabel: null,
                    listeners: {
                        afterrender: function (form) {
                            var field = this;
                            field.setValue(conditionData);
                        }
                    }
                }
            ]
        });
        win.show();
    }
    ,
    /**
     * 创建对应的domain对象
     */
    createMaterialMappingConfigDomain: function (DTOData, configType) {
        var controller = this;
        var data = Ext.clone(DTOData);
        var result = {
            materialAttrMappingConfigs: controller.buildMaterialAttrMappingConfigs(data.spuRtObjectMappings),
            bomItemMappingConfigs: controller.buildBomItemMappings(data.bomItemMappings),
            productConfigDesignId: DTOData.productConfigDesignId,
            materialPath: data.materialPath,
            packageQty: data.packageQty,
            clazz: "com.qpp.cgp.domain.product.config.material.mapping2.MaterialMappingConfig",
        }
        if (configType == 'mappingConfig') {
            delete result.productConfigDesignId;
            result.productConfigMappingId = DTOData.productConfigMappingId;
        }
        console.log(result);
        return result;
    }
    ,
    /**
     * 转换BomItemMappingConfigs
     * @param bomItemMappings
     * @returns {Array}
     */
    buildBomItemMappings: function (bomItemMappings) {
        var controller = this;
        var result = [];
        bomItemMappings.forEach(function (bomItemMappingConfig) {
            if (bomItemMappingConfig.clazz == 'com.qpp.cgp.domain.product.config.material.mapping2dto.FixedBOMItemMappingDTOConfig') {
                result.push(controller.getFixedBOMItemMappingConfig(bomItemMappingConfig));

            } else if (bomItemMappingConfig.clazz == 'com.qpp.cgp.domain.product.config.material.mapping2dto.OptionalBOMItemMappingDTOConfig') {
                result.push(controller.getOptionalBOMItemMappingConfig(bomItemMappingConfig));
            } else {
                result.push(controller.getUnassignBOMItemMappingConfig(bomItemMappingConfig));
            }
        })
        return result;
    }
    ,
    /**
     * 获取到固定件Domain
     */
    getFixedBOMItemMappingConfig: function (bomItemMappingConfig) {
        var controller = this;
        var result = {
            clazz: 'com.qpp.cgp.domain.product.config.material.mapping2.FixedBOMItemMappingConfig',
            sourceBOMItemId: bomItemMappingConfig.sourceBOMItemId,
            quantity: controller.getQuantity(bomItemMappingConfig.qtyMappingRules)
        }
        return result;
    }
    ,
    /**
     * 获取到可选件Domain
     */
    getOptionalBOMItemMappingConfig: function (bomItemMappingConfig) {
        var controller = this;
        var result = {
            clazz: "com.qpp.cgp.domain.product.config.material.mapping2.OptionalBOMItemMappingConfig",
            sourceBOMItemId: bomItemMappingConfig.sourceBOMItemId,
            quantity: controller.getQuantity(bomItemMappingConfig.qtyMappingRules),
            materialPredicates: controller.getMaterialPredicate(bomItemMappingConfig.materialPredicates),
        }
        return result;
    }
    ,
    /**
     * 获取到待定件Domain
     */
    getUnassignBOMItemMappingConfig: function (bomItemMappingConfig) {
        var controller = this;
        var ubiToObiItemMappingConfigs = [];
        for (var i = 0; i < bomItemMappingConfig.obiMappings.length; i++) {
            var obiMapping = bomItemMappingConfig.obiMappings[i];
            obiMapping.itemMaterialMappingConfigs.forEach(function (item) {
                item.materialMappingId = item.materialMappingDomainId
            });
            ubiToObiItemMappingConfigs.push(
                {
                    _id: obiMapping._id,
                    clazz: 'com.qpp.cgp.domain.product.config.material.mapping2.UBIToOBIItemMappingConfig',
                    quantity: controller.getQuantity(obiMapping.qtyMappingRules),
                    materialPredicates: controller.getMaterialPredicate(obiMapping.materialPredicates),
                    itemMaterialMappingConfigs: obiMapping.itemMaterialMappingConfigs
                }
            )
        }
        var result = {
            clazz: 'com.qpp.cgp.domain.product.config.material.mapping2.UnassignBOMItemMappingConfig',
            sourceBOMItemId: bomItemMappingConfig.sourceBOMItemId,
            generateObiQuantity: controller.getQuantity(bomItemMappingConfig.bomItemQtyMappingRules),
            ubiToObiItemMappingConfigs: ubiToObiItemMappingConfigs,
            bomItemMappingIndexExpression: controller.getBomItemMappingIndexExpression(bomItemMappingConfig.obiMappingIndexRules)
        }
        return result;
    }
    ,
    /**
     * 获取到Quantity的ValueEx
     */
    getQuantity: function (qtyMappingRules) {
        var controller = this;
        var resultType = 'Number';
        var expression = '';
        var elseExpression = '';
        var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
        qtyMappingRules.forEach(function (item) {
            var outputValue = null;
            if (item.outputValue.calculationExpression) {
                outputValue = item.outputValue.calculationExpression;
                outputValue = controller.dealExpressionValue(outputValue);
                outputValue = 'return ' + outputValue + ';';
                if (Ext.isEmpty(item.condition)) {
                    expression = outputValue;
                } else {
                    if (item.condition.conditionType == 'else') {
                        elseExpression = outputValue;
                    } else {
                        expression += 'if(' + controller.dealExpressionController.calculateBaseOperation(item.condition.operation, skuAttributeStore) + '){' + outputValue + '};';
                    }
                }
            } else {
                outputValue = item.outputValue.value;
                outputValue = 'return ' + outputValue + ';';
                if (Ext.isEmpty(item.condition) || (item.condition.conditionType == 'normal' && Ext.isEmpty(item.condition.operation.operations))) {
                    expression = outputValue + ';';
                } else {
                    if (item.condition.conditionType == 'else') {
                        elseExpression = outputValue + ';';
                    } else {
                        expression += 'if(' + controller.dealExpressionController.calculateBaseOperation(item.condition.operation, skuAttributeStore) + '){' + outputValue + '};';
                    }
                }
            }
        });
        expression += elseExpression;
        /*
                var equal = "function (valA, valB) {valA = valA+'';valA=valA.replace(' ','');valB='['+valB+']';return valA==valB;};";//垃圾js引擎，不要问
        */
        var result = {
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
        };
        return result;
    }
    ,
    /**
     * 获取到物料过滤的ValueEx
     * @param materialPredicates
     * @returns {{expression: {expression: string, inputs: Array, clazz: string, resultType: string}, type: string, clazz: string}}
     */
    getMaterialPredicate: function (materialPredicates) {
        var controller = this;
        var result = [];
        var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
        materialPredicates.forEach(function (item) {
            var expression = '';
            var outputValue = '';
            if (item.clazz == 'com.qpp.cgp.domain.product.config.material.mapping2dto.ExcludeFilterDTO') {
                outputValue = item.filterExpression;
                outputValue = controller.dealExpressionValue(outputValue);
                outputValue = 'return ' + outputValue + ';';
                if (item.condition && item.condition.operation.operations.length > 0) {
                    expression += 'if(' + controller.dealExpressionController.calculateBaseOperation(item.condition.operation, skuAttributeStore) + '){return true;}else {return false;}';
                } else {
                    expression = 'return true';
                }
                result.push({
                        clazz: "com.qpp.cgp.domain.product.config.material.mapping2.ExcludeFilter",
                        condition: {
                            "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                            "type": 'Boolean',
                            "expression": {
                                "clazz": "com.qpp.cgp.expression.Expression",
                                "resultType": 'Boolean',
                                "inputs": [],
                                "expression": 'function expression(args) {' +
                                    expression +
                                    '}'
                            },
                        },
                        filter: {
                            "clazz": "com.qpp.cgp.expression.Expression",
                            "resultType": "Boolean",
                            "inputs": [],
                            "expression": 'function expression(args){' + outputValue + '}'

                        }
                    }
                );
            } else if (item.clazz == 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO') {
                outputValue = item.materialId;
                if (Ext.isEmpty(item.condition)) {
                    expression = 'return true;';
                } else {
                    expression = 'if(' + controller.dealExpressionController.calculateBaseOperation(item.condition.operation, skuAttributeStore) + '){return true;}else{return false;}';
                }
                result.push({
                    clazz: "com.qpp.cgp.domain.product.config.material.mapping2.DiscreteExcludePredicate",
                    condition: {
                        "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                        "type": 'Boolean',
                        "expression": {
                            "clazz": "com.qpp.cgp.expression.Expression",
                            "resultType": 'Boolean',
                            "inputs": [],
                            "expression": 'function expression(args) {' +
                                expression +
                                '}'
                        },
                    },
                    materialId: outputValue
                })
            } else if (item.clazz == 'com.qpp.cgp.domain.product.config.material.mapping2dto.IncludeFilterDTO') {
                outputValue = ' return args.params.material._id !=' + item.materialId;
                if (item.condition && item.condition.operation.operations.length > 0) {
                    expression += 'if(' + controller.dealExpressionController.calculateBaseOperation(item.condition.operation, skuAttributeStore) + '){return true;}else {return false;}';
                } else {
                    expression = 'return true';
                }
                result.push({
                        clazz: "com.qpp.cgp.domain.product.config.material.mapping2.ExcludeFilter",
                        condition: {
                            "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                            "type": 'Boolean',
                            "expression": {
                                "clazz": "com.qpp.cgp.expression.Expression",
                                "resultType": 'Boolean',
                                "inputs": [],
                                "expression": 'function expression(args) {' +
                                    expression +
                                    '}'
                            },
                        },
                        filter: {
                            "clazz": "com.qpp.cgp.expression.Expression",
                            "resultType": "Boolean",
                            "inputs": [],
                            "expression": 'function expression(args){' + outputValue + '}'
                        }
                    }
                );
            }
        });
        return result;
    },

    /**
     * 获取到指定位置上的物料
     * @param obiMappingIndexRules
     * @returns {{expression: string, inputs: Array, clazz: string, resultType: string}}
     */
    getBomItemMappingIndexExpression: function (obiMappingIndexRules) {
        var controller = this;
        var elseExpression = '';
        var index = 1;
        var result = '';
        var resultExpression = '';
        var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
        for (var i = 0; i < obiMappingIndexRules.length; i++) {
            var expression = "";
            obiMappingIndexRules[i].bomItemIndexRules.forEach(function (item) {
                var outputValue = item.outputValue.value;
                if (Ext.isEmpty(item.condition) || (item.condition.conditionType == 'normal' && Ext.isEmpty(item.condition.operation.operations))) {
                    expression = "return '" + outputValue + "';";
                } else {
                    if (item.condition.conditionType == "else") {
                        elseExpression = "return '" + outputValue + "';";
                    } else {
                        expression += "if(" + controller.dealExpressionController.calculateBaseOperation(item.condition.operation, skuAttributeStore) + "){return '" + outputValue + "'};";
                    }
                }
            })
            resultExpression += 'if (index ==' + obiMappingIndexRules[i].index + ') {' +
                expression
                + '}'
        }
        result = {
            clazz: 'com.qpp.cgp.expression.Expression',
            resultType: 'String',
            inputs: [],
            expression: 'function expression(args) {' +
                'var index = args.params.index;' +
                'var generateObiQuantity = args.params.generateObiQuantity;' +
                resultExpression +
                '}'
        }
        return result;

    }
    ,
    /**
     * 转换materialAttrMappingConfigs
     * @param args
     * @returns {Array}
     */
    buildMaterialAttrMappingConfigs: function (args) {
        var controller = this;
        var result = [];
        var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
        args.forEach(function (item) {
            var expression = '';
            var elseExpression = '';
            var rtAttributeTreeStore = Ext.data.StoreManager.get('rtAttributeTreeStore');
            for (var i = 0; i < item.mappingRules.length; i++) {//遍历某一属性下的值配置
                var valueRule = item.mappingRules[i];
                var outputValue = valueRule.outputValue.value || controller.dealExpressionValue(valueRule.outputValue.calculationExpression);
                var rootNode = rtAttributeTreeStore.getRootNode();
                var rtAttribute = null;
                rootNode.cascadeBy(function (node) {
                    if (node.get('path') == item.spuAttributePath) {
                        rtAttribute = node;
                        return false;
                    }
                });
                var resultType = rtAttribute.raw.rtAttributeDef.valueType;
                if (resultType == 'Number' || resultType == 'int') {//Number,int,Data都转换为string，Boolean不变
                    resultType = 'Number';
                } else if (resultType == 'Data') {
                    resultType = 'String'
                }
                if (rtAttribute.raw.rtAttributeDef.selectType != 'NON') {//选项类型
                    if (rtAttribute.raw.rtAttributeDef.selectType == 'SINGLE') {
                        outputValue = "'" + outputValue + "'";
                        if (resultType == 'Boolean') {
                            resultType = 'String';
                        }
                    } else {//多选类型
                        if (rtAttribute.raw.rtAttributeDef.arrayType == 'NON') {//现在处理多选的选择类型数据值时，
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
                //无条件执行
                if (Ext.isEmpty(valueRule.condition) || (valueRule.condition.conditionType == 'normal' && Ext.isEmpty(valueRule.condition.operation.operations))) {
                    expression = 'return ' + outputValue;
                } else {
                    if (valueRule.condition.conditionType == 'else') {
                        elseExpression = 'return ' + outputValue;
                    } else {
                        if (valueRule.outputValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                            expression += 'if(' + controller.dealExpressionController.calculateBaseOperation(valueRule.condition.operation, skuAttributeStore) + '){return ' + outputValue + '};';
                        } else {
                            expression += 'if(' + controller.dealExpressionController.calculateBaseOperation(valueRule.condition.operation, skuAttributeStore) + '){return ' + outputValue + '};';
                        }
                    }
                }
            }
            expression += elseExpression;

            /*
                        var equal = "function (valA, valB) {valA = valA+'';valA=valA.replace(' ','');valB='['+valB+']';return valA==valB;};";//垃圾js引擎，不要问
            */
            result.push({
                path: item.spuAttributePath,
                clazz: 'com.qpp.cgp.domain.product.config.material.mapping2.MaterialAttrMappingConfig',
                value: {
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
            })
        })
        return result;
    },
    getCustomExpressionOperation: function (operation, skuAttributeStore) {
        var resultData = operation.expression;
        return resultData;
    },
    /**
     * 校验表达式文本是否合法
     */
    validateExpression: function (expression) {
        var isValid = true;
        var errorInfo = '';
        var contextData = [];
        var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
        for (var i = 0; i < skuAttributeStore.getCount(); i++) {
            var data = skuAttributeStore.getAt(i).getData();
            contextData += "var  Attr_" + data.attribute.id + "='';"
        }
        contextData += 'var currentMaterial={};';
        contextData += 'var generateObiQuantity=1;';
        contextData += 'var a=function (){' + expression + '}();';
        try {
            eval(contextData);
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
        } else {
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('合法表达式'));
        }
    },
    /**
     * 获取物料没有配置值的属性
     * version=v1 是把 required=true 的属性查出来
     * version=v2 是把所有的属性查出来，不分类
     * version=v3 把所有的属性查出来，并分类
     * RtType 的 AttributesToRtType 的 required决定是否必填，和 RtAttributeDef 的 required 是不一样的
     */
    getMaterialUnSetValueAttribute: function (materialId, rootNode, spuRtObjectMappings, version) {
        var result = '';
        Ext.Ajax.request({
            url: adminPath + 'api/materialMappingConfigs/' + materialId + '/incompleteAttrTree?version=' + version,
            method: 'GET',
            async: false,//同步请求
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
        dealNode = function (records, parentNode) {
            Ext.each(records, function (item) {
                if (item.children) {
                    item['leaf'] = false;
                    item['parentId'] = parentNode.id;
                    item['id'] = (parentNode['path'] ? parentNode['path'] + ',' : '') + item['name'];
                    item['path'] = (parentNode['path'] ? parentNode['path'] + ',' : '') + item['name'];
                    dealNode(item.children, item);

                } else {
                    item['leaf'] = true;
                    item['parentId'] = parentNode.id;
                    item['id'] = (parentNode['path'] ? parentNode['path'] + ',' : '') + item['name'];
                    item['path'] = (parentNode['path'] ? parentNode['path'] + ',' : '') + item['name'];
                    item['spuRtObjectMappingDTOConfig'] = [];
                    if (spuRtObjectMappings.length > 0) {
                        for (var i = 0; i < spuRtObjectMappings.length; i++) {
                            var spuRtObjectMapping = spuRtObjectMappings[i];
                            if (spuRtObjectMapping.spuAttributePath == item['path']) {
                                item['spuRtObjectMappingDTOConfig'] = spuRtObjectMapping.mappingRules;
                            }
                        }
                    }
                }
            });
        };
        dealNode(result, rootNode);
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
    /**
     *
     * @param input
     * @returns {*}
     */
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
        //兼容以前的配置数据，以前return 写在表达式中，现在把有return 开头的都删掉return
        if (/^return/.test(output)) {
            output = output.replace('return', '')
        }
        //防止表达式的忘记加;号
        return output + ';';
    },
})
