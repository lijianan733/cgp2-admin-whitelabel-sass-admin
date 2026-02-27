/**
 * Created by miao on 2021/6/09.
 */
Ext.Loader.syncRequire(["CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.model.TextParameter"])
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.Edit', {
    extend: "Ext.ux.form.ErrorStrickForm",

    autoScroll: true,
    scroll: 'vertical',
    layout: {
        type: 'border'
    },
    border: 0,
    bodyStyle: {
        padding: '0'
    },
    fieldDefaults: {
        labelWidth: 120,
        msgTarget: 'side',
        width: "100%"
    },

    parameterId: null,
    initComponent: function () {
        var me = this;
        var productController = Ext.create('CGP.product.view.productconfig.controller.Controller');
        var contentData = productController.buildPMVTContentData(JSGetQueryString('productId'));
        var contentAttributeStore = Ext.create('Ext.data.Store', {
            storeId: 'contentAttributeStore',
            fields: [
                {
                    name: 'key',
                    type: 'string'
                },
                {
                    name: 'type',
                    type: 'string'
                }, {
                    name: 'valueType',
                    type: 'string'
                }, {
                    name: 'selectType',
                    type: 'string'
                }, {
                    name: 'attrOptions',
                    type: 'array'
                }, {
                    name: 'required',
                    type: 'string'
                }, {
                    name: 'attributeInfo',
                    type: 'string'
                }, {
                    name: 'path',
                    type: 'string'
                },
                {
                    name: 'displayName',
                    type: 'string'
                }
            ],
            data: contentData
        });

        var controller = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.controller.Controller');
        me.tbar = [
            {
                text: i18n.getKey('save'),
                itemId: 'save',
                iconCls: 'icon_save',
                handler: function (btn) {
                    var eidtForm = btn.ownerCt.ownerCt;
                    if (eidtForm.isValid()) {
                        controller.saveTextParameter(eidtForm);
                    }
                }
            },
            {
                text: i18n.getKey('test'),
                itemId: 'test',
                iconCls: 'icon_test',
                handler: function (btn) {
                    controller.showTestTab(btn);
                }
            }
        ]
        me.items = [
            {
                region: 'north',
                xtype: 'errorstrickform',
                itemId: 'baseForm',
                height: 100,
                // split: true,
                // margin: '10',
                items: [
                    {
                        xtype: 'numberfield',
                        itemId: 'id',
                        name: '_id',
                        hidden: true
                    },
                    {
                        xtype: 'combo',
                        name: 'name',
                        itemId: 'attributeCombo',
                        fieldLabel: i18n.getKey('name'),
                        queryMode: 'local',
                        displayField: 'displayName',
                        valueField: 'value',
                        // relativeText: itemData.name + '_field_' + index,
                        matchFieldWidth: true,
                        haveReset: true,
                        allowBlank: false,
                        labelAlign: 'left',
                        margin: '20 0 0 20',
                        width: 380,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'displayName'],
                            data: [
                                {"value": "productInfor", "displayName": 'productInfor'},
                                {"value": "orderNumber", "displayName": 'orderNumber'},
                                {"value": "pageIndex", "displayName": 'pageIndex'},
                                {"value": "pageTotal", "displayName": 'pageTotal'},
                                {"value": "printQty", "displayName": 'printQty'},
                                {"value": "Qty", "displayName": 'Qty'},
                                {"value": "datePurchased", "displayName": 'datePurchased'}
                            ]
                        }),
                    }
                ]
            },
            {
                region: 'west',
                xtype: 'errorstrickform',
                itemId: 'parameterForm',
                header:false,
                useArrows: true,
                collapsible: true,
                bodyStyle: 'padding-top:0px',
                width: 350,
                items: [
                    Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.ParameterGrid', {
                        id: 'parameterGrid',
                        // fieldLabel: i18n.getKey('parameterGrid'),
                        name:'innerParameters',
                        labelAlign: 'top',
                        allowBlank: false,
                        submitValue:true,
                        width: 350,
                        listeners: {
                            select: function (row, record, index) {
                                var valueGrid = Ext.getCmp('valueGrid');
                                valueGrid.reflashData(record, index);
                                var addValueBtn=valueGrid.getGrid().down('toolbar').getComponent('add');
                                if(addValueBtn.disabled){
                                    addValueBtn.enable();
                                }
                            }
                        }
                    })
                ],
                isValid: function () {
                    var me = this;
                    var isValid = true;
                    var item = me.items.items[0];
                    if (item.rendered && !item.allowBlank && item.isValid() == false) {
                        isValid = false;
                    }
                    var innerParameters = item.getSubmitValue(), errors = {};
                    innerParameters.forEach(function (arrEl) {
                        if (Ext.isEmpty(arrEl['valueMappings'])) {
                            item.setActiveError(arrEl.name + '.valueMappings:Nulls are not allowed! ');
                            isValid = false;
                        }
                    });
                    return isValid;
                }
            },
            {
                region: 'center',
                xtype: 'errorstrickform',
                itemId: 'valueForm',
                title: i18n.getKey('values'),
                header:false,
                flex: 1,
                bodyStyle: 'padding-top:0px',
                items: [
                    Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.ValueGrid', {
                        id: 'valueGrid',
                        // fieldLabel: i18n.getKey('valueGrid'),
                        submitValue:false,
                        labelAlign: 'top',
                        flex: 1,
                    })
                ]
            }


        ];
        me.callParent();
        if (me.parameterId > 0) {
            var textParameterModel = Ext.ModelManager.getModel("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.model.TextParameter");
            if (Ext.isEmpty(textParameterModel)) {
                textParameterModel = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.model.TextParameter');
            }
            textParameterModel.load(me.parameterId, {
                success: function (record, operation) {
                    me.setValue(record.data);
                }
            });
        }

    },
    isValid: function () {
        var me = this, isValid = true;
        var items = me.items.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!item.isValid()) {
                isValid = false;
                break;
            }
        }
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        for (var i = 0; i < items.length; i++) {
            var itemForms = items[i];
            for (var j = 0; j < itemForms.items.items.length; j++) {
                var item = itemForms.items.items[j];
                if (!item.submitValue) {
                    continue;
                }
                if(item.xtype=='gridfield'){
                    item.setSubmitValue(data[item.getName()]);
                }
                else{
                    item.setValue(data[item.getName()]);
                }
            }
        }
    },
    getValue: function () {
        var me = this, data = {clazz: 'com.qpp.cgp.domain.product.config.composing.parameter.TextParameter'};
        var items = me.items.items;
        for (var i = 0; i < items.length; i++) {
            var itemForms = items[i];
            for (var j = 0; j < itemForms.items.items.length; j++) {
                var item = itemForms.items.items[j];
                if (!item.submitValue) {
                    continue;
                }
                if(item.xtype=='gridfield'){
                    data[item.getName()] = item.getSubmitValue();
                }
                else{
                    data[item.getName()] = item.getValue();
                }
            }
        }
        var valueTemplate = '';
        data.innerParameters.forEach(function (item) {
            if (item && item.name) {
                valueTemplate += '${' + item.name + '}';
            }
        });
        data['valueTemplate'] = valueTemplate;
        data['productConfigImpositionId'] = parseInt(JSGetQueryString('impositionId'));
        return data;
    }
})
