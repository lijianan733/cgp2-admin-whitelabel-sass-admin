/**
 * Created by nan on 2021/11/9
 * 该配置用于改变生成的sku产品的属性列表，当前只允许操作非sku属性，
 */
Ext.Loader.syncRequire([
    'CGP.common.rttypetortobject.view.RtTypeToRtObjectFieldContainer',
    'CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.view.condition.OutPanel',
    'CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.store.PropertySimplifyConfigStore'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var productId = builderConfigTab.productId;
    var productConfigDesignId = JSGetQueryString('productConfigDesignId');
    /**
     * 上下文变量的store
     * @type {CGP.common.condition.store.ContentAttributeStore}
     */
    var contentAttributeStore = Ext.create('CGP.common.condition.store.ContentAttributeStore', {
        storeId: 'contentAttributeStore',
        data: []
    });
    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.controller.Controller');
    /**
     * 转DTO危domain数据
     * @param mappingRules
     * @returns {[]}
     */
    var buildKeyValues = function (mappingRules) {
        var result = [];
        var conditionController = Ext.create('CGP.common.condition.controller.Controller');
        conditionController.contentAttributeStore = Ext.StoreManager.get('contentAttributeStore');
        for (var i = 0; i < mappingRules.length; i++) {
            var item = mappingRules[i];
            var domain = conditionController.builderExpression(item.mappingRules);
            result.push({
                skuAttributeId: item.notSkuAttribute.id,
                value: domain
            })
        }
        return result;
    }
    var form = Ext.create('Ext.ux.form.ErrorStrickForm', {
        defaults: {
            margin: '5 25 5 25'
        },
        isValidForItems: true,
        controller: controller,
        items: [
            {
                xtype: 'hiddenfield',
                name: '_id',
                itemId: '_id'
            },
            {
                xtype: 'hiddenfield',
                value: "com.qpp.cgp.domain.product.config.property.PropertySimplifyConfig",
                name: 'clazz',
                itemId: 'clazz'
            },
            {
                xtype: 'hiddenfield',
                itemId: 'productConfigDesignId',
                name: 'productConfigDesignId',
                value: productConfigDesignId
            },
            {//是否只在sku产品上改配置生效，因为sku产品会往可配置产品上查找配置
                xtype: 'checkboxfield',
                itemId: 'onlyNotSku',
                name: 'onlyNotSku',
                value: true,
                checked: true,
                hidden: true,
                fieldLabel: i18n.getKey('onlyNotSku'),
            },
            {
                xtype: 'textfield',
                itemId: 'description',
                name: 'description',
                width: 500,
                fieldLabel: i18n.getKey('description'),
            },
            {
                xtype: 'rttypetortobjectfieldcontainer',
                allowBlank: false,
                maxHeight: 250,
                width: 500,
                rtTypeAttributeInputFormConfig: {
                    hideRtType: false,
                    maxHeight: 250,
                    diyColumns: [
                        {
                            xtype: 'treecolumn',
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            flex: 1,
                            tdCls: 'vertical-middle',
                            renderer: function (value, metadata, record) {
                                return record.get("name");
                            }
                        },
                        {
                            dataIndex: 'valueType',
                            text: i18n.getKey('valueType'),
                            itemId: 'valueType'
                        },
                    ]
                },
                itemId: 'propertyTypeSchema',
                name: 'propertyTypeSchema',
                fieldLabel: i18n.getKey('API输入属性'),
                /*    tipInfo: '该配置的具体数据,由下单时进行进一步配置.<br>' +
                        '该字段的配置的用于映射规则中',*/
                diyGetValue: function () {
                    var data = this.getValue();
                    if (data) {
                        return data.rtType;
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.setValue({
                        rtType: data
                    })
                }
            },
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: 0,
                width: '100%',
                items: [
                    {
                        xtype: 'displayfield',
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('非SKU属性映射规则') + '</font>',
                    }
                ],
                isValid: function () {
                    return true;
                },
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
            },
            {
                xtype: 'outpanel',
                itemId: 'keyValuesDTO',
                name: 'keyValuesDTO',
                height: 350,
                width: 1000,
                productId: productId
            }
        ],
        tbar: [
            {
                xtype: 'button',
                iconCls: 'icon_save',
                text: i18n.getKey('save'),
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    if (form.isValid()) {
                        var data = form.getValue();
                        data.propertyValues = buildKeyValues(Ext.clone(data.keyValuesDTO));
                        form.controller.saveConfig(data, form);
                        console.log(data);
                    }
                }
            },
            {
                xtype: 'button',
                iconCls: 'icon_test',
                text: i18n.getKey('test'),
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    if (form.isValid()) {
                        var data = form.getValue();
                        if (data._id) {
                            form.controller.testConfig(data, form);
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), '请先保存数据');
                        }
                    }
                }
            }
        ],
        listeners: {
            'afterrender': function () {
                var form = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
                //为'uxtreecombohaspaging'添加监听
                var treeCombo = page.query('uxtreecombohaspaging[itemId=rtType]')[0];
                treeCombo.on('change', function (field, newValue, oldValue) {
                    var controller = form.controller;
                    var contentData = controller.buildContentData(newValue);
                    var contentAttributeStore = Ext.data.StoreManager.get('contentAttributeStore');
                    contentAttributeStore.proxy.data = contentData;
                    contentAttributeStore.load();
                });
                var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.store.PropertySimplifyConfigStore', {
                    autoLoad: true,
                    params: {
                        filter: Ext.JSON.encode([{
                            name: 'productConfigDesignId',
                            type: 'number',
                            value: productConfigDesignId
                        }])
                    },
                    listeners: {
                        load: function (store, records) {
                            if (records.length > 0) {
                                form.setValue(records[0].getData());
                            }
                        }
                    }
                })
            },
        }
    });
    page.add(form)

})