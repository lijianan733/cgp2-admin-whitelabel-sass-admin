/**
 * Created by nan on 2020/1/2.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.controller.Controller', {
    /**
     * 删除产品物料ViewType
     * @param {Number} productMaterialViewTypeID
     * @param {Ext.data.Store} store 产品物料viewType store
     */
    deleteProductMaterialViewType: function (productMaterialViewTypeID, store) {
        Ext.Msg.confirm('提示', '是否删除？', callback);

        function callback(id) {
            if (id === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/productMaterialViewTypes/' + productMaterialViewTypeID,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var success = response.success;
                        if (success) {
                            store.load();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        }
    },
    /**
     * 编辑产品物料viewType窗口
     * @param {Ext.data.Model} record 正要编辑的产品物料
     * @param {Ext.data.Store} store 产品物料viewType store
     * @param {Number} productConfigDesignId productConfigDesignRecord productConfigDesign的ID
     * @param {Number} productBomConfigId productConfigDesignRecord 管理的最新productBomConfigId
     */
    addProductMaterialViewTypeWin: function (record, productConfigDesignId, productBomConfigId, schemaVersion, productId) {
        var me = this;
        var recordId = record ? record.getId() : null;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
        builderConfigTab.editProductMaterialViewType(recordId, productId, productConfigDesignId, productBomConfigId, schemaVersion);
    },
    /**
     * 用于CGP.product.view.productconfig.productdesignconfig.view.ManagerProductMtViewType类中展示materialSelector列中express类型的值
     * @param value 字段值
     */
    showExpression: function (value) {
        var me = this;
        var items = [];
        var conditions = JSON.parse(JSON.stringify(value));
        var countItems = [];
        var count = 0;
        for (var i in conditions) {
            var item = null;
            if (i == 'clazz') {
                conditions[i] = conditions[i].substring(conditions[i].lastIndexOf('.') + 1, (conditions[i].length));
            }
            if (i == 'inputs') {
                var inputFieldSet = [];
                for (var k = 0; k < conditions[i].length; k++) {
                    var config = conditions[i][k];
                    var nextItem = [];
                    for (var j in config) {
                        if (j == 'clazz') {
                            config[j] = config[j].substring(config[j].lastIndexOf('.') + 1, (config[j].length));
                        }
                        var configItem = {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey(j),
                            value: config[j]
                        };
                        if (j == 'value') {
                            var items2 = [];
                            for (var h in config[j]) {
                                if (h == 'clazz') {
                                    config[j][h] = config[j][h].substring(config[j][h].lastIndexOf('.') + 1, (config[j][h].length));
                                }
                                if (h == 'expression') {
                                    var id = JSGetUUID();
                                    var value = config[j][h];
                                    var item2 = {
                                        xtype: 'displayfield',
                                        fieldLabel: i18n.getKey(h),
                                        value: '<a href="#" id=' + id + '>' + '查看表达式' + '</a>',
                                        listeners: {
                                            render: function (display) {
                                                var clickElement = document.getElementById(id);
                                                if (!Ext.isEmpty(clickElement)) {
                                                    clickElement.addEventListener('click', function () {
                                                        me.showExpression(value)
                                                    }, false);
                                                }
                                            }
                                        }
                                    };
                                } else {
                                    var item2 = {
                                        xtype: 'displayfield',
                                        fieldLabel: i18n.getKey(h),
                                        value: config[j][h]
                                    };
                                }

                                items2.push(item2)
                            }
                            configItem = {
                                xtype: 'fieldcontainer',
                                padding: false,
                                labelAlign: 'top',
                                border: false,
                                title: i18n.getKey(j),
                                fieldLabel: i18n.getKey(j),
                                defaults: {
                                    margin: '0 0 10 30'
                                },
                                items: items2
                            };
                        }
                        nextItem.push(configItem);
                    }

                    inputFieldSet.push({
                        xtype: 'fieldset',
                        labelAlign: 'top',
                        collapsed: true,
                        title: i18n.getKey('input') + (k + 1),
                        fieldLabel: i18n.getKey('input') + (k + 1),
                        collapsible: true,
                        items: nextItem,
                        defaults: {
                            margin: '0 0 10 30'
                        }
                    });

                }
                var inputContainer = {
                    xtype: 'fieldcontainer',
                    items: inputFieldSet,
                    fieldLabel: i18n.getKey('input'),
                    labelAlign: 'top'
                }
                items.push(inputContainer);
            } else {
                item = {
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey(i),
                    value: conditions[i]
                }
                items.push(item)
            }
        }
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            autoScroll: true,
            border: false,
            items: items
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('check') + i18n.getKey('expression'),
            height: 600,
            width: 800,
            modal: true,
            layout: 'fit',
            items: form
        }).show();
    },
    searchGridCombo: function () {

        var queries = [];

        var items = this.ownerCt.items.items;

        var store = this.ownerCt.ownerCt.getStore();

        var params = {};

        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                query.value = items[i].getValue();
            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                query.value = '%' + items[i].getValue() + '%'
            }
            query.type = 'string';
            queries.push(query);
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = null;
        }

        store.loadPage(1);


    },
    clearParams: function () {

        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();

        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = null;


    },
    saveForm: function (form, me) {
        var data = {};
        var materialSelectorType = form.getComponent('materialSelector').getComponent('MaterialSelectorType').getValue();
        var ExpressionNewValue = form.getComponent('materialSelector').getComponent('ExpressionSelector').getComponent('ExpressionSelectorButton').getValue();
        if (materialSelectorType == 'com.qpp.cgp.domain.bom.material.ExpressionSelector' && Ext.isEmpty(ExpressionNewValue.clazz)) {
            Ext.Msg.alert(i18n.getKey('prompt'), 'expressionValue不能为空');
            return;
        }
        if (form.isValid()) {
            data.conditionExpression = form.getComponent('conditionExpression').getValue();
            data.productConfigDesignId = form.getComponent('productConfigDesignId').getValue();
            data.clazz = form.getComponent('clazz').getValue();
            data.name = form.getComponent('productMaterialTypeName').getValue();
            data.materialPath = form.getComponent('materialSelector').getComponent('IdPathSelector').getComponent('materialPath').getValue();
            data.productMaterialViewTypeId = form.getComponent('productViewType').getComponent('productMaterialViewTypeId').getValue();
            data.materialSelector = {};
            var materialSelector = form.getComponent('materialSelector');
            data.materialSelector.clazz = materialSelector.getComponent('MaterialSelectorType').getValue();
            if (data.materialSelector.clazz == 'com.qpp.cgp.domain.bom.material.IdPathSelector') {
                data.materialSelector.idPath = materialSelector.getComponent('IdPathSelector').getComponent('materialPath').getValue();
            }
            if (data.materialSelector.clazz == 'com.qpp.cgp.domain.bom.material.MaterialIdSelector') {
                data.materialSelector.materialId = materialSelector.getComponent('MaterialIdSelector').getComponent('materialId').getValue();
            }
            if (data.materialSelector.clazz == 'com.qpp.cgp.domain.bom.material.JsonPathSelector') {
                data.materialSelector.jsonPath = materialSelector.getComponent('JsonPathSelector').getValue();
            }
            if (data.materialSelector.clazz == 'com.qpp.cgp.domain.bom.material.ExpressionSelector') {
                data.materialSelector.expression = materialSelector.getComponent('ExpressionSelector').getValue();
            }
            data.userAssign = null;
            data.materialViewType = {
                _id: form.getComponent('materialViewType').getSingleValue(),
                idReference: 'MaterialViewType',
                clazz: domainObj.MaterialViewType
            };
            var aboutSimplifyBomConfig = form.getComponent('aboutSimplifyBomConfig');
            data.pageContentQty = aboutSimplifyBomConfig.getComponent('pageContentQty').getValue();
            data.productMaterialViewTypeIds = aboutSimplifyBomConfig.getComponent('productMaterialViewTypeIds').getValue();
            if (Ext.isEmpty(me.record)) {//新建
                me.controller.addProductMaterialViewType(data, me)
            } else {//编辑
                data._id = me.record.data._id;
                me.controller.updateProductMaterialViewType(data, me);
            }
        }
    },
    showExpressValueExValue: function (store, button, configurableId) {
        var controller = this;
        var storeData = store;
        var createOrEdit = storeData.getCount() > 0 ? 'edit' : 'create';
        var alertwindow = Ext.create('Ext.window.Window', {
            title: i18n.getKey(createOrEdit) + i18n.getKey('ExpressionValue'),
            height: 750,
            modal: true,
            width: 800,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'form',
                autoScroll: true,
                itemId: 'conditionsForm',
                fieldDefaults: {
                    margin: '10 0 0 20 ',
                    allowBlank: false
                },
                bbar: ['->', {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (view) {
                        var conditionsalertwindow = this.ownerCt.ownerCt.items.items[0];
                        controller.getValidExpressionContainerValue(conditionsalertwindow, view, createOrEdit, storeData, button);
                    }
                },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function () {
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                ]
            }
        });
        var alertwindowFormContainer = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.view.ValidExpressionContainer', {
            itemId: JSGetUUID(),
            name: JSGetUUID(),
            id: JSGetUUID(),
            gridConfigRenderTo: JSGetUUID(),
            configurableId: configurableId
        });
        alertwindowFormContainer.getComponent('clazz').store = Ext.create('Ext.data.Store', {
            autoSync: true,
            autoLoad: true,
            fields: [
                {name: 'name', type: 'string'},
                {name: 'class', type: 'string'}
            ],
            data: [
                {class: 'com.qpp.cgp.expression.Expression', name: 'CustomExpression'},
                {class: 'com.qpp.cgp.expression.RegexExpression', name: 'RegexExpression'}
            ]
        });
        alertwindow.getComponent('conditionsForm').add(alertwindowFormContainer);
        if (createOrEdit == 'edit') {
            alertwindowFormContainer.setValue(store.getAt(0).getData());
        }
        alertwindow.show();
    },
    productMaterialViewTypeIdCreate: function (button) {
        JSGetCommonKey(true, function (key) {
            button.ownerCt.getComponent('productMaterialViewTypeId').setValue(key);
        });
    },
    /**
     *修改产品viewType
     * @param {Object} data 新增或修改的数据
     * @param {Ext.window.Window} win 编辑窗口
     */
    updateProductMaterialViewType: function (data, win) {
        Ext.Ajax.request({
            url: adminPath + 'api/productMaterialViewTypes/' + data['_id'],
            method: 'PUT',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('modifySuccess'));

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     * 新增一个产品物料viewType
     * @param {Object} data 新增或修改的数据
     * @param {Ext.data.Store} store 产品物料viewType store
     * @param {Ext.window.Window} win 编辑窗口
     */
    addProductMaterialViewType: function (data, editTab) {
        data.productMaterialViewTypeId = data.productMaterialViewTypeId.toString();
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
        Ext.Ajax.request({
            url: adminPath + 'api/productMaterialViewTypes',
            method: 'POST',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    editTab.setValue(response.data);
                    //editTab.setTitle(i18n.get('edit')+i18n.getKey('product')+i18n.getKey('material')+i18n.getKey('view')+i18n.getKey('type'))
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        var editProductMaterialViewType = builderConfigTab.getComponent('editProductMaterialViewType');
                        var title = i18n.getKey('edit') + i18n.getKey('productMaterialViewType');
                        editProductMaterialViewType.setTitle(title);
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })

    },
    getValidExpressionContainerValue: function (conditionsalertwindow, view, createOrEdit, store, button) {
        var ExpressionOldValue = window.buttonInitValue;
        var ExpressionNewValue = view.ownerCt.ownerCt.getValues();
        /* if (this.Compare(ExpressionOldValue, ExpressionNewValue)) {
             //没有修改
         } else {
             for (var i = 0; i < window.localRecordData.ExpressionSelector.length; i++) {
                 var a = window.localRecordData.ExpressionSelector[i];
                 var b = ExpressionNewValue;
                 if (this.Compare(a, b)) {
                     Ext.Msg.alert(i18n.getKey('prompt'), 'expressionValue已存在相同配置');
                     return;
                 }
             }
         }
 */

        var itemsclassValue = conditionsalertwindow.getComponent('clazz').getValue();
        var record = null;
        if (store.getCount() != 0) {
            record = store.getAt(0);
        } else {
            record = Ext.create(store.model);
        }
        //当有范围约束时的处理
        if (itemsclassValue == 'RangeExpression') {
            var inputs = conditionsalertwindow.getComponent('inputs');
            var inputStore = inputs.gridConfig.store;
            inputStore.removeAll();
            var minIsUse = conditionsalertwindow.getComponent('min').getComponent('otherOperation').getComponent('allowUse').getValue();
            var minIsEqual = conditionsalertwindow.getComponent('min').getComponent('otherOperation').getComponent('allowEqual').getValue();
            if (minIsUse == true) {
                var min = conditionsalertwindow.getComponent('min').getValue();
                var newrecord = Ext.create(inputStore.model);
                newrecord.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                newrecord.set('name', 'min');
                newrecord.set('value', conditionsalertwindow.getComponent('min').getValue());
                inputStore.add(newrecord);
            }
            var maxIsUse = conditionsalertwindow.getComponent('max').getComponent('otherOperation').getComponent('allowUse').getValue();
            var maxIsEqual = conditionsalertwindow.getComponent('max').getComponent('otherOperation').getComponent('allowEqual').getValue();
            if (maxIsUse == true) {
                var max = conditionsalertwindow.getComponent('max').getValue();
                var newrecord = Ext.create(inputStore.model);
                newrecord.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                newrecord.set('name', 'max');
                newrecord.set('value', conditionsalertwindow.getComponent('max').getValue());
                inputStore.add(newrecord);
            }
            if (minIsUse == false && maxIsUse == false) {
                Ext.Msg.alert(i18n.getKey('prompt'), '最大最小值必须有一项启用');
            }
            var expression = conditionsalertwindow.getComponent('expression');
            var expressionString = 'function expression(context) { return ';
            if (minIsUse == false) {
                expressionString += (minIsEqual ? 'context.inputs.min<=context.context.currentAttributeValue;}' : 'context.inputs.min<context.context.currentAttributeValue;}');
            } else if (maxIsUse == false) {
                expressionString += (maxIsEqual ? 'context.context.currentAttributeValue<=context.inputs.max;}' : 'context.context.currentAttributeValue<context.inputs.max;}');
            } else {
                expressionString += (minIsEqual ? 'context.inputs.min<=context.context.currentAttributeValue' : 'context.inputs.min<context.context.currentAttributeValue');
                expressionString += (maxIsEqual ? ' && context.context.currentAttributeValue<=context.inputs.max;}' : ' && context.context.currentAttributeValue<context.inputs.max;}');
            }
            expression.setValue(expressionString);
        }
        if (view.ownerCt.ownerCt.form.isValid()) {
            var fields = view.ownerCt.ownerCt.items.items[0];
            for (var i in fields.getValue()) {
                if (i == 'inputs') {
                    for (var j = 0; j < fields.getValue()[i].length; j++) {
                        delete fields.getValue()[i][j].value.otherOperation;
                    }
                    record.set(i, fields.getValue()[i]);

                } else if (i == 'min' || i == 'max') {
                    delete fields.getValue()[i].otherOperation;
                    record.set(i, fields.getValue()[i]);

                } else {
                    record.set(i, fields.getValue()[i]);
                }
            }
            if (createOrEdit == 'create') {
                store.add(record);
            }
            button.value = view.ownerCt.ownerCt.getValues();
            view.ownerCt.ownerCt.ownerCt.close();
        }
    },
    Compare: function (objA, objB) {
        function isObj(object) {
            return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
        }

        function isArray(object) {
            return object && typeof (object) == 'object' && object.constructor == Array;
        }

        function getLength(object) {
            var count = 0;
            for (var i in object) count++;
            return count;
        }

        function CompareObj(objA, objB, flag) {
            for (var key in objA) {
                if (!flag) //跳出整个循环
                    break;
                if (!objB.hasOwnProperty(key)) {
                    flag = false;
                    break;
                }
                if (!isArray(objA[key])) { //子级不是数组时,比较属性值
                    if (objB[key] != objA[key]) {
                        flag = false;
                        break;
                    }
                } else {
                    if (!isArray(objB[key])) {
                        flag = false;
                        break;
                    }
                    var oA = objA[key],
                        oB = objB[key];
                    if (oA.length != oB.length) {
                        flag = false;
                        break;
                    }
                    if (oA.length == oB.length && oB.length == 0) {
                        flag = true;
                    } else {
                        for (var k in oA) {
                            if (!flag) //这里跳出循环是为了不让递归继续
                                break;
                            flag = CompareObj(oA[k], oB[k], flag);
                        }
                    }
                }
            }
            return flag;
        }

        if (!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
        if (getLength(objA) != getLength(objB)) return false; //判断长度是否一致
        return CompareObj(objA, objB, true); //默认为true
    }
})
